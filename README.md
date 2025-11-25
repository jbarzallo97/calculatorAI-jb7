# CalcJB7 AI

Una calculadora moderna con inteligencia artificial construida con Angular, que incluye un modelo de suscripción premium y un fondo interactivo de globo 3D.

## 🚀 Características

- **Calculadora Avanzada**: Operaciones matemáticas completas (suma, resta, multiplicación, división, porcentaje, negación)
- **Modelo de Suscripción Premium**: Ediciones Estándar y Premium con diferentes capacidades
- **Globo 3D Interactivo**: Hermoso globo potenciado por Three.js con visualización de datos GeoJSON
- **Modales Animados**: Transiciones y animaciones suaves para los modales de suscripción y éxito
- **Diseño Responsive**: Completamente optimizado para dispositivos móviles, tablets y escritorio
- **Soporte de Teclado**: Usa tu teclado para interactuar con la calculadora
- **UI Moderna**: Tema oscuro con colores azules de acento y animaciones suaves

## 🛠️ Tecnologías

- **Angular 15**: Framework frontend
- **TypeScript**: Lenguaje de programación
- **Three.js**: Librería de gráficos 3D para la visualización del globo
- **Tailwind CSS**: Framework CSS utility-first
- **SASS**: Preprocesador CSS para estilos

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd calculator-AI-jb7
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. Navega a `http://localhost:4200/` en tu navegador

## 🎮 Uso

### Operaciones de la Calculadora

- **Números**: Haz clic en los botones o usa el teclado (0-9)
- **Operadores**: Haz clic o usa el teclado (`+`, `-`, `*`, `/`)
- **Igual**: Presiona `=` o `Enter` para calcular
- **Limpiar**: Presiona `C` o `Escape` para limpiar
- **Retroceso**: Presiona `Backspace` para eliminar el último dígito

### Características Premium

- Edición Estándar: Funcionalidad básica de calculadora
- Edición Premium: Acceso completo a todas las operaciones matemáticas
- Suscríbete a Premium para desbloquear todas las características

## 📱 Diseño Responsive

La aplicación es completamente responsive y está optimizada para:
- Dispositivos móviles (320px+)
- Tablets (768px+)
- Escritorio (1024px+)

## 🎨 Esquema de Colores

- **Azul Principal**: `#3b82f6`
- **Fondo Oscuro**: `#18181b` (zinc-900)
- **Fondo de Tarjetas**: `#27272a` (zinc-800)
- **Texto**: Blanco con varios niveles de opacidad

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── pages/
│   │   └── calculator/          # Componente principal de la calculadora
│   ├── shared/
│   │   ├── modals/
│   │   │   ├── subscription-modal/    # Modal de suscripción premium
│   │   │   ├── success-modal/          # Modal de confirmación de éxito
│   │   │   ├── processing-calculation/ # Modal de animación de procesamiento
│   │   │   └── globe-scene/            # Componente de globo 3D
│   │   └── shared.module.ts
│   └── globe/
│       ├── threeGeoJSON.ts      # Utilidad de renderizado GeoJSON
│       └── getStarfield.ts      # Utilidad de generación de campo estelar
└── assets/
    └── geojson/                 # Archivos de datos GeoJSON
```

## 🚀 Build

Ejecuta `ng build` para construir el proyecto. Los artefactos de build se almacenarán en el directorio `dist/`.

## 🧪 Testing

Ejecuta `ng test` para ejecutar las pruebas unitarias mediante [Karma](https://karma-runner.github.io).

## 📄 Licencia

Este proyecto es privado.

## 👤 Autor

**Johan Barzallo**
- GitHub: [@jbarzallo97](https://github.com/jbarzallo97)
- LinkedIn: [jbarzallo97](https://www.linkedin.com/in/jbarzallo97/)

---

Construido con ❤️ usando Angular y Three.js

> 💡 **Nota**: Esta es una plataforma satírica que hace referencia a cómo todo ahora requiere una suscripción premium. ¿Una calculadora que necesita pago? ¡Qué gracioso! 😄 En un mundo donde hasta el agua embotellada tiene membresía premium, ¿por qué no una calculadora? 🧮✨
