import { signal, computed, WritableSignal, Signal } from '@angular/core';

export class StateService<T extends Record<string, any>> {
  private _state: {
    [K in keyof T]: WritableSignal<T[K]> | WritableSignal<T[K][number]>[];
  };
  private _initialState: T;

  private constructor(initialState: T) {
    this._initialState = { ...initialState };
    this._state = {} as {
      [K in keyof T]: WritableSignal<T[K]> | WritableSignal<T[K][number]>[];
    };

    Object.keys(initialState).forEach((key) => {
      const value = initialState[key as keyof T];

      if (Array.isArray(value)) {
        // Solución: Tipar correctamente 'item' usando infer
        type ArrayElement<T> = T extends (infer U)[] ? U : never;
        this._state[key as keyof T] = value.map(
          (item: ArrayElement<T[keyof T]>) => signal(item)
        ) as WritableSignal<ArrayElement<T[keyof T]>>[];
      } else {
        this._state[key as keyof T] = signal(value);
      }
    });
  }

  static create<T extends Record<string, any>>(
    initialState: T
  ): StateService<T> {
    return new StateService<T>(initialState);
  }

  get<K extends keyof T>(key: K): Signal<T[K]> {
    if (Array.isArray(this._state[key])) {
      type ArrayElement<T> = T extends (infer U)[] ? U : never;

      return computed(() =>
        (this._state[key] as WritableSignal<ArrayElement<T[K]>>[]).map((sig) =>
          sig()
        )
      ) as Signal<T[K]>;
    }

    return computed(() => (this._state[key] as WritableSignal<T[K]>)());
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    if (Array.isArray(value)) {
      type ArrayElement<T> = T extends (infer U)[] ? U : never;

      this._state[key] = value.map((item: ArrayElement<T[K]>) =>
        signal(item)
      ) as WritableSignal<ArrayElement<T[K]>>[];
    } else {
      (this._state[key] as WritableSignal<T[K]>).set(value);
    }
  }

  // Agregar elemento a un array como una nueva señal
  addToArray<K extends keyof T>(
    key: K,
    item: T[K] extends any[] ? T[K][number] : never
  ): void {
    if (Array.isArray(this._state[key])) {
      (this._state[key] as WritableSignal<T[K][number]>[]).push(signal(item));
    } else {
      throw new Error(`${String(key)} is not an array`);
    }
  }

  updateArrayItem<K extends keyof T>(
    key: K,
    predicate: (item: T[K] extends (infer U)[] ? U : never) => boolean,
    updater: (
      item: T[K] extends (infer U)[] ? U : never
    ) => T[K] extends (infer U)[] ? U : never
  ): void {
    if (!Array.isArray(this._state[key])) {
      throw new Error(`${String(key)} is not an array`);
    }

    type ArrayElement<T> = T extends (infer U)[] ? U : never;

    const signalsArray = this._state[key] as WritableSignal<
      ArrayElement<T[K]>
    >[];

    signalsArray.forEach((sig) => {
      if (predicate(sig())) {
        sig.set(updater(sig()));
      }
    });
  }

  // Eliminar un elemento del array sin perder la reactividad
  removeFromArray<K extends keyof T>(
    key: K,
    predicate: (item: T[K] extends any[] ? T[K][number] : never) => boolean
  ): void {
    if (!Array.isArray(this._state[key])) {
      throw new Error(`${String(key)} is not an array`);
    }

    const signalsArray = this._state[key] as WritableSignal<T[K][number]>[];
    this._state[key] = signalsArray.filter(
      (sig) => !predicate(sig())
    ) as WritableSignal<T[K][number]>[];
  }
  get state(): T {
    return Object.keys(this._state).reduce(
      (acc, key) => ({
        ...acc,
        [key]: (this._state[key as keyof T] as WritableSignal<T[keyof T]>)(),
      }),
      {} as T
    );
  }

  setNested<K extends keyof T, P extends keyof NonNullable<T[K]>>(
    key: K,
    prop: P,
    value: NonNullable<T[K]>[P]
  ): void {
    const state = this._state[key];

    if (Array.isArray(state)) {
      throw new Error(
        `setNested no soporta modificar arrays directamente en ${String(key)}`
      );
    }

    (state as WritableSignal<T[K]>).update((currentState) => {
      if (
        currentState === null ||
        typeof currentState !== 'object' ||
        Array.isArray(currentState)
      ) {
        currentState = {} as NonNullable<T[K]>; // Inicializa un objeto vacío si era null
      }

      if (!(prop in currentState)) {
        console.warn(
          `La propiedad "${String(prop)}" no existía en ${String(
            key
          )} y fue creada.`
        );
      }

      return {
        ...currentState,
        [prop]:
          Array.isArray(currentState[prop]) && Array.isArray(value)
            ? [...(currentState[prop] as any[]), ...value] // Si ambas son arrays, se concatenan
            : value, // Si no es un array, simplemente se asigna el nuevo valor
      };
    });
  }

  setDeep<K extends keyof T>(path: string, value: any): void {
    const keys = path.split('.');
    const rootKey = keys[0] as K;

    this.getWritableSignal(rootKey).update((currentState) => {
      let obj: any = structuredClone
        ? structuredClone(currentState)
        : { ...currentState };

      let temp = obj;
      for (let i = 1; i < keys.length - 1; i++) {
        const key = keys[i];

        if (temp[key] === undefined || temp[key] === null) {
          temp[key] = {};
        } else if (typeof temp[key] !== 'object') {
          throw new Error(
            `Path ${keys.slice(0, i + 1).join('.')} is not an object`
          );
        }

        temp = temp[key];
      }

      temp[keys[keys.length - 1]] = value;
      return obj; // Retorna el objeto clonado con la actualización
    });
  }

  private getWritableSignal<K extends keyof T>(key: K): WritableSignal<T[K]> {
    return this._state[key] as WritableSignal<T[K]>;
  }

  reset(): void {
    Object.keys(this._initialState).forEach((key) => {
      if (Array.isArray(this._initialState[key])) {
        this._state[key as keyof T] = (this._initialState[key] as any[]).map(
          (item) => signal(item)
        );
      } else {
        (this._state[key as keyof T] as WritableSignal<T[keyof T]>).set(
          this._initialState[key as keyof T]
        );
      }
    });
  }
}
