# OsoStateJC

<img src="https://i.postimg.cc/y8r0kVf9/Dise-o-sin-t-tulo-removebg-preview.png" width="100">

**OsoStateJC** es una librería ligera para la gestión de estado en Angular utilizando Signals. Permite manejar el estado de manera reactiva y fluida con una API sencilla e intuitiva.

## 📌 Características

- 📌 Gestión de estado basada en Signals.
- 🔄 API fluida para modificaciones.
- 📌 Soporte para propiedades anidadas y actualizaciones profundas.
- 📌 Métodos para agregar, modificar y eliminar elementos en arreglos.
- 🔄 Reseteo de estado a su valor inicial.

## 🚀 Instalación

No requiere instalación adicional. Simplemente importa y usa la clase en un servicio o componente de Angular:

```typescript
import { OsoStateJC } from "./oso-state";
```

## 📖 Uso

### Creación de un Estado

```typescript
const state = OsoStateJC.create({
  name: "John",
  age: 30,
  hobbies: ["reading", "coding"],
});
```

## 📌 API

### 🔍 Obtener el estado actual

```typescript
const currentState = state.state;
```

### ✏️ Modificar una propiedad

```typescript
state.modify("name").set("Jane");
```

### 🔍 Leer una propiedad

```typescript
const nameSignal = state.modify("name").get();
```

### 🔄 Obtener dinámicamente una propiedad

```typescript
const dynamicValue = state.modify("name").get()();
```

### 🏗️ Modificar elementos de un array

#### ➕ Agregar un elemento

```typescript
state.modify("hobbies").add("gaming");
```

#### ❌ Eliminar un elemento

```typescript
state.modify("hobbies").remove((hobby) => hobby === "reading");
```

#### 🔄 Actualizar elementos en un array

```typescript
state.modify("hobbies").update(
  (hobby) => hobby === "coding",
  () => "programming"
);
```

### 📌 Modificar propiedades anidadas

```typescript
state.modify("user").nested("email", "new@example.com");
```

### 🌍 Modificar valores en profundidad

```typescript
state.modify("user").deep("address.city", "New York");
```

### 🔄 Resetear el estado

```typescript
state.reset();
```

## ✅ Buenas Prácticas

- Utilizar un solo `OsoStateJC` por dominio de estado.
- Evitar modificar el estado directamente sin usar la API provista.
- Usar Signals en los templates para mantener la reactividad.

## ⚠️ Consideraciones

- No persiste el estado entre recargas de página.
- Diseñado para ser ligero y sin dependencias externas.

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si deseas mejorar `OsoStateJC`, por favor abre un issue o realiza un pull request.

## 📄 Licencia

MIT © [OsoDreamer](https://tusitio.com)

---

`OsoStateJC` es una solución ligera y eficaz para manejar el estado en Angular de forma reactiva y estructurada. Su API fluida facilita la manipulación del estado sin comprometer la escalabilidad.
