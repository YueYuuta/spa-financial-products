# SpaFinancialProducts

🚀 **SPA en Angular 18 para la gestión de productos financieros**  
Este proyecto permite listar, buscar, agregar, editar y eliminar productos financieros consumiendo una API local. Desarrollado con **Angular 18**, **Standalone Components** y **SCSS**, aplicando buenas prácticas, principios SOLID y pruebas unitarias con Jest.

## 🛠️ Tecnologías Utilizadas

- **Angular 18** (Standalone Components)
- **TypeScript 4.8+**
- **SCSS** para estilos
- **RxJS** para manejo de estados reactivos
- **Jest** para pruebas unitarias
- **Angular Router** para navegación
- **Atomic Design** en componentes

## 🚀 Instalación y Ejecución

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/YueYuuta/spa-financial-products.git
   cd spa-financial-products
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   ng serve
   ```
   Luego, abre en el navegador: **[http://localhost:4200](http://localhost:4200)**

## ⚙️ Configuración del Backend Local

Este proyecto consume una API local. Para levantar el backend:

1. Descomprimir el archivo `repo-interview-main.zip` (solicítalo si no lo tienes).
2. Instalar dependencias del backend:
   ```bash
   npm install
   ```
3. Ejecutar el backend:
   ```bash
   npm run start:dev
   ```
   La API estará disponible en: **[http://localhost:3002](http://localhost:3002)**

## ✅ Pruebas Unitarias

Ejecutar pruebas con **Jest**:

```bash
ng test
```

## 📂 Estructura del Proyecto

```
📂 src
 ├── 📂 app
 │   ├── 📂 components        # Componentes
 │   ├── 📂 pages             # Vistas principales
 │   ├── 📂 services          # Servicios para consumir la API
 │   ├── 📂 utils             # Utilidades y helpers
 │   ├── app.config.ts        # Configuración del proyecto
 │   ├── app.component.ts     # Componente raíz
 ├── main.ts                  # Punto de entrada de Angular
 ├── styles.scss               # Estilos globales
```

## 📜 Licencia

Este proyecto está bajo la licencia **MIT**.
