import { signal, WritableSignal, Signal, computed } from '@angular/core';

// Definición del tipo ArrayElement para trabajar con arrays
type ArrayElement<T> = T extends (infer U)[] ? U : never;

export class NanoStateJC<T extends Record<string, any>> {
  private _state: {
    [K in keyof T]: WritableSignal<T[K]> | WritableSignal<T[K][number]>[];
  };
  private _initialState: T;

  constructor(initialState: T) {
    this._initialState = { ...initialState };
    this._state = {} as {
      [K in keyof T]: WritableSignal<T[K]> | WritableSignal<T[K][number]>[];
    };

    // Inicializar señales para cada propiedad del estado
    Object.keys(initialState).forEach((key) => {
      const value = initialState[key as keyof T];
      if (Array.isArray(value)) {
        this._state[key as keyof T] = value.map(
          (item: ArrayElement<T[keyof T]>) => signal(item)
        ) as WritableSignal<ArrayElement<T[keyof T]>>[];
      } else {
        this._state[key as keyof T] = signal(value);
      }
    });
  }

  // Método estático para crear una instancia con el estado inicial
  static create<T extends Record<string, any>>(
    initialState: T
  ): NanoStateJC<T> {
    return new NanoStateJC<T>(initialState);
  }

  // Obtener el estado actual (sin señales)
  get state(): T {
    return Object.keys(this._state).reduce(
      (acc, key) => ({
        ...acc,
        [key]: (this._state[key as keyof T] as WritableSignal<T[keyof T]>)(),
      }),
      {} as T
    );
  }

  // Métodos de modificación de arrays
  private updateArray<K extends keyof T>(
    key: K,
    predicate: (item: T[K] extends (infer U)[] ? U : never) => boolean,
    updater: (
      item: T[K] extends (infer U)[] ? U : never
    ) => T[K] extends (infer U)[] ? U : never
  ) {
    if (!Array.isArray(this._state[key])) {
      throw new Error(`${String(key)} is not an array`);
    }
    const signalsArray = this._state[key] as WritableSignal<T[K][number]>[];
    signalsArray.forEach((sig) => {
      if (predicate(sig())) {
        sig.set(updater(sig()));
      }
    });
  }

  private addItem<K extends keyof T>(
    key: K,
    item: T[K] extends (infer U)[] ? U : never
  ) {
    if (!Array.isArray(this._state[key])) {
      throw new Error(`${String(key)} is not an array`);
    }
    (this._state[key] as WritableSignal<T[K][number]>[]).push(signal(item));
  }

  private removeItem<K extends keyof T>(
    key: K,
    predicate: (item: T[K] extends (infer U)[] ? U : never) => boolean
  ) {
    if (!Array.isArray(this._state[key])) {
      throw new Error(`${String(key)} is not an array`);
    }
    const signalsArray = this._state[key] as WritableSignal<T[K][number]>[];
    this._state[key] = signalsArray.filter(
      (sig) => !predicate(sig())
    ) as WritableSignal<T[K][number]>[];
  }

  // Actualizar el valor de una propiedad
  update<K extends keyof T>(key: K, value: T[K]) {
    (this._state[key] as WritableSignal<T[K]>).set(value);
  }

  // Modificar estructuras anidadas (nested)
  nested<K extends keyof T, P extends keyof NonNullable<T[K]>>(
    key: K,
    prop: P,
    value: NonNullable<T[K]>[P]
  ) {
    (this._state[key] as WritableSignal<T[K]>).update((currentState) => {
      if (
        !currentState ||
        typeof currentState !== 'object' ||
        Array.isArray(currentState)
      ) {
        currentState = {} as NonNullable<T[K]>;
      }
      return { ...currentState, [prop]: value };
    });
  }

  // Modificar propiedades profundas (deep)
  deep<K extends keyof T>(key: K, path: string, value: any) {
    const keys = path.split('.');
    this.getWritableSignal(key).update((currentState) => {
      let obj = this.deepClone(currentState);

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
      return obj;
    });
  }

  // API para manejar modificaciones del estado
  modify<K extends keyof T>(key: K) {
    return {
      // Obtener valor actual
      get: (): Signal<T[K]> => {
        if (Array.isArray(this._state[key])) {
          return computed(() =>
            (this._state[key] as WritableSignal<ArrayElement<T[K]>>[]).map(
              (sig) => sig()
            )
          ) as Signal<T[K]>;
        }
        return computed(() => (this._state[key] as WritableSignal<T[K]>)());
      },

      // Establecer un nuevo valor
      set: (value: T[K]) => {
        if (Array.isArray(value)) {
          this._state[key] = value.map((item: ArrayElement<T[K]>) =>
            signal(item)
          ) as WritableSignal<ArrayElement<T[K]>>[];
        } else {
          (this._state[key] as WritableSignal<T[K]>).set(value);
        }
      },

      // Actualizar elementos del array
      update: (
        predicate: (item: T[K] extends (infer U)[] ? U : never) => boolean,
        updater: (
          item: T[K] extends (infer U)[] ? U : never
        ) => T[K] extends (infer U)[] ? U : never
      ) => {
        this.updateArray(key, predicate, updater);
      },

      // Añadir un item al array
      add: (item: T[K] extends (infer U)[] ? U : never) => {
        this.addItem(key, item);
      },

      // Eliminar un item del array
      remove: (
        predicate: (item: T[K] extends (infer U)[] ? U : never) => boolean
      ) => {
        this.removeItem(key, predicate);
      },

      // Modificar una propiedad anidada
      nested: (prop: string, value: any) => {
        this.nested(key, prop, value);
      },

      // Modificar una propiedad profunda
      deep: (path: string, value: any) => {
        this.deep(key, path, value);
      },
    };
  }

  // Obtiene la señal writable para una propiedad específica
  private getWritableSignal<K extends keyof T>(key: K): WritableSignal<T[K]> {
    return this._state[key] as WritableSignal<T[K]>;
  }

  // Clonación profunda de un objeto
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)); // Alternativa simple a structuredClone
  }

  // Resetear el estado al valor inicial
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
