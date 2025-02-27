import { signal, computed, WritableSignal, Signal } from '@angular/core';

export class StateService<T extends Record<string, any>> {
  private _state: { [K in keyof T]: WritableSignal<T[K]> };
  private _initialState: T;

  private constructor(initialState: T) {
    this._initialState = { ...initialState };
    this._state = {} as { [K in keyof T]: WritableSignal<T[K]> };

    // Crear signals para cada propiedad
    Object.keys(initialState).forEach((key) => {
      this._state[key as keyof T] = signal(initialState[key as keyof T]);
    });
  }

  // Método estático para instanciar el servicio
  static create<T extends Record<string, any>>(
    initialState: T
  ): StateService<T> {
    return new StateService<T>(initialState);
  }

  // Getter computado para obtener valores reactivos
  get<K extends keyof T>(key: K): Signal<T[K]> {
    return computed(() => this._state[key]());
  }

  // Setter para modificar el estado
  set<K extends keyof T>(key: K, value: T[K]): void {
    this._state[key].set(value);
  }

  get state(): T {
    return Object.keys(this._state).reduce(
      (acc, key) => ({
        ...acc,
        [key]: this._state[key as keyof T](),
      }),
      {} as T
    );
  }

  setNested<K extends keyof T, P extends keyof NonNullable<T[K]>>(
    key: K,
    prop: P,
    value: NonNullable<T[K]>[P]
  ): void {
    this._state[key].update((currentState) => {
      if (
        currentState === null ||
        typeof currentState !== 'object' ||
        Array.isArray(currentState)
      ) {
        currentState = {} as NonNullable<T[K]>; // Inicializa un objeto vacío si era null
      }

      return {
        ...currentState,
        [prop]: value,
      };
    });
  }

  setDeep<K extends keyof T>(path: string, value: any): void {
    this.getWritableSignal(path.split('.')[0] as K).update((currentState) => {
      const keys = path.split('.');
      let obj: any = currentState;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];

        if (obj[key] === undefined || obj[key] === null) {
          obj[key] = {}; // Inicializa el objeto si es null o undefined
        } else if (typeof obj[key] !== 'object') {
          throw new Error(
            `Path ${keys.slice(0, i + 1).join('.')} is not an object`
          );
        }

        obj = obj[key];
      }

      obj[keys[keys.length - 1]] = value;
      return { ...currentState }; // Devuelve un nuevo objeto para que Angular lo detecte
    });
  }

  private getWritableSignal<K extends keyof T>(key: K): WritableSignal<T[K]> {
    return this._state[key] as WritableSignal<T[K]>;
  }

  // Actualizar el estado basado en su valor actual
  update<K extends keyof T>(key: K, updater: (current: T[K]) => T[K]): void {
    this._state[key].update(updater);
  }

  // Métodos CRUD automáticos para arrays (con tipado seguro)
  addToArray<K extends keyof T>(
    key: K,
    item: T[K] extends any[] ? T[K][number] : never
  ): void {
    if (Array.isArray(this._state[key]())) {
      this._state[key].update(
        (current) => [...(current as any[]), item] as T[K]
      );
    } else {
      throw new Error(`${String(key)} is not an array`);
    }
  }

  removeFromArray<K extends keyof T>(
    key: K,
    predicate: (item: T[K] extends any[] ? T[K][number] : never) => boolean
  ): void {
    if (Array.isArray(this._state[key]())) {
      this._state[key].update(
        (current) =>
          (current as any[]).filter((item) => !predicate(item)) as T[K]
      );
    } else {
      throw new Error(`${String(key)} is not an array`);
    }
  }

  updateArrayItem<K extends keyof T>(
    key: K,
    predicate: (item: T[K] extends any[] ? T[K][number] : never) => boolean,
    updater: (
      item: T[K] extends any[] ? T[K][number] : never
    ) => T[K] extends any[] ? T[K][number] : never
  ): void {
    if (Array.isArray(this._state[key]())) {
      this._state[key].update(
        (current) =>
          (current as any[]).map((item) =>
            predicate(item) ? updater(item) : item
          ) as T[K]
      );
    } else {
      throw new Error(`${String(key)} is not an array`);
    }
  }

  findOne<K extends keyof T>(
    key: K,
    predicate: (item: T[K] extends any[] ? T[K][number] : never) => boolean
  ): T[K] extends any[] ? T[K][number] | undefined : never {
    if (Array.isArray(this._state[key]())) {
      return (this._state[key]() as any[]).find(predicate) as any;
    } else {
      throw new Error(`${String(key)} is not an array`);
    }
  }
  reset(): void {
    Object.keys(this._initialState).forEach((key) => {
      this._state[key as keyof T].set(this._initialState[key as keyof T]);
    });
  }
}
