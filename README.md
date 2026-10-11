# AETHER® — Portafolio 3 inmersivo

Una experiencia web **original y experimental** inspirada en el lenguaje visual del video de referencia: un emblema dorado, partículas, tarjetas suspendidas en 3D y navegación cinematográfica con scroll.

> **Aviso de portafolio:** AETHER es un estudio ficticio. Los seis proyectos, sus nombres y descripciones son **conceptos originales**, no encargos de clientes. No se atribuyen premios, resultados comerciales ni relaciones con marcas reales. Esta implementación es una reinterpretación técnica y artística, **no una copia del sitio de referencia**.

🔗 **Demo en vivo:** [https://portafolio-aether.vercel.app/](https://portafolio-aether.vercel.app/)

## Tecnologías

- **Next.js 15** con App Router, **React 19** y **TypeScript**.
- **Three.js**, **React Three Fiber** y **Drei** para geometría, materiales, luces y cámara.
- **GSAP / ScrollTrigger** para interacción con scroll y entradas editoriales.
- CSS responsive sin framework de estilos.
- Texturas de tarjetas dibujadas por código con **Canvas 2D**, sin bancos de imágenes ni API externa.

## Inicio rápido

Requisitos: **Node.js 20.9 o posterior** y npm.

```bash
npm install
npm run dev
```

Abre **http://localhost:3000**.

Para generar la versión optimizada:

```bash
npm run build
npm start
```

Comprobar tipos:

```bash
npm run typecheck
```

## Recorrido

1. **INTRO**: escultura metálica con dos listones curvos y partículas luminosas, con respuesta sutil al cursor.
2. **WORK**: seis proyectos en tarjetas 3D con cambios de posición, escala, rotación y profundidad basados en el scroll.
3. **PROJECT DETAILS**: abre la ficha del proyecto pulsando "EXPLORE THIS PROJECT" o la tarjeta activa.
4. **MANIFESTO**: manifiesto tipográfico entre las secciones oscuras.
5. **CONTACT**: escena final con anillos decorativos y enlace de correo editable.

### Controles

- Usa la rueda del mouse / trackpad para recorrer la galería.
- Usa los números, las flechas visibles o las teclas **← / →** cuando estés en la sección de proyectos.
- Pulsa **Esc** para cerrar una ficha de proyecto.
- Usa **MOTION ON/OFF** para pausar o activar el movimiento ambiental.
- Si tu sistema tiene «Reducir movimiento», el sitio lo respeta al abrirse.

## Personalizarlo

| Qué cambiar                                        | Archivo                                                 |
| -------------------------------------------------- | ------------------------------------------------------- |
| Nombre y email de contacto                         | `lib/site.ts` (y textos en `components/Experience.tsx`) |
| Nombres, textos, colores y años de los 6 proyectos | `lib/projects.ts`                                       |
| Estética generativa de cada tarjeta                | `lib/artwork.ts`                                        |
| Emblema y partículas doradas                       | `components/scenes/HeroScene.tsx`                       |
| Objetos 3D y animaciones de galería                | `components/scenes/WorkScene.tsx`                       |
| Transiciones, interacciones y componentes          | `components/Experience.tsx`                             |
| Diseño responsive                                  | `app/globals.css`                                       |
| Título y metadatos SEO                             | `app/layout.tsx`                                        |

**Importante:** el contacto usa `you@example.com` como marcador de posición. **Modifícalo en `lib/site.ts` antes de publicar.**

## Notas de rendimiento

- El hero y la galería no mantienen dos escenas WebGL activas durante toda la navegación: se montan cerca de su sección mediante `IntersectionObserver`.
- DPR acotado, partículas con `BufferGeometry`, texturas generadas localmente y geometrías reutilizables.
- En dispositivos sin WebGL se renderiza un fondo alternativo (no interactivo).
- Se recomienda verificar el comportamiento en iPhone/Android reales y ejecutar Lighthouse después del despliegue.

## Créditos y licencia

Concepto original de aprendizaje y portafolio. Referencia visual proporcionada por el usuario: video mostrando la web de Active Theory; no se incluyen sus logotipos, capturas, modelos ni recursos propietarios. Código de la demo: MIT (ver `LICENSE`).
