# Arquitectura del Portafolio 3

## Objetivo

Reinterpretar el lenguaje visual de la referencia —un entorno oscuro con escultura metálica y tarjetas flotantes— mediante recursos propios. Es un **proyecto demostrativo de Creative Frontend**, no un sitio comercial.

## División de responsabilidades

```text
app/
  layout.tsx               Metadatos y estructura base
  page.tsx                 Página principal
  globals.css              Diseño, responsive y accesibilidad
  icon.svg                 Identidad gráfica original
components/
  Experience.tsx           Navegación, interacción y estructura visual
  scenes/
    HeroScene.tsx          Escultura dorada con ribbons y puntos GPU
    WorkScene.tsx          Tarjetas 3D, cámara, shaders estándar y partículas
lib/
  artwork.ts               Texturas procedurales a partir de Canvas2D
  projects.ts              Datos de los seis proyectos conceptuales
  site.ts                  Datos editables del sitio
```

## Flujo de scroll

1. El visitante entra al hero. La geometría anima la rotación y la posición en función del cursor.
2. `IntersectionObserver` monta la escena de la galería al acercarse el scroll y desmonta la anterior al alejarse.
3. `ScrollTrigger` calcula un `progress` normalizado de `0` a `1` a lo largo de la sección de `600svh`.
4. La galería calcula la posición fraccional `progress * (N - 1)`. Cada tarjeta interpreta su distancia a ese valor y ajusta X/Y/Z, rotación y escala con `MathUtils.damp`.
5. Los botones y los indicadores llevan el scroll al porcentaje exacto correspondiente al proyecto seleccionado.
6. Al pulsar una tarjeta activa o el enlace «Explore» se abre un modal con información del concepto.

## Decisiones de diseño

- **Sin dependencias de imágenes remotas:** los recursos son generativos, por lo que el ZIP es pequeño y reproducible.
- **Sin modelo GLB propietario:** la escultura se construye a partir de `TorusGeometry`, `TubeGeometry`, `BoxGeometry` y materiales PBR.
- **Sin backend:** las fichas son datos estáticos y el contacto es un enlace `mailto:` de demostración.
- **No se promete pixel-perfect:** la referencia es un video grabado de una web compleja; nuestro diseño tiene identidad propia.
- **Interacción accesible:** navegación nativa, teclas laterales, modal con Escape, focus visible y `prefers-reduced-motion`.

## Criterios mínimos de revisión manual

- [ ] `npm install` se ejecuta en un entorno con acceso a npm.
- [ ] `npm run typecheck` sin errores.
- [ ] `npm run build` sin errores.
- [ ] Hero visible y animado en Chrome, Firefox y Safari con WebGL.
- [ ] Scroll cambia de proyecto exactamente seis veces.
- [ ] Indicadores y flechas llevan al proyecto correcto.
- [ ] Ficha de cada proyecto abre, cierra con Escape y restaura el foco.
- [ ] Vista móvil sin desbordamiento horizontal.
- [ ] Revisión de `prefers-reduced-motion`.
- [ ] Email de `lib/site.ts` sustituido antes de publicar.

> En el entorno de generación no fue posible instalar dependencias desde npm por falta de resolución DNS. Por lo tanto, las pruebas de compilación y navegador quedan pendientes; se comprobó la sintaxis del proyecto y el contenido del ZIP.
