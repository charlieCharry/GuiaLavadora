# Guía de Lavado LG

App web instalable (PWA) para configurar la lavasecadora LG WD14 (WD14WVC4S6 / WD14VVC4S6C / WD14PVC4S6C). Funciona sin internet, sin IA y sin servidor.

## Secciones

- **Asistente**: escribes qué vas a lavar ("4 toallas blancas muy sucias, y secarlas"), te pregunta lo que falte y te dice programa, temperatura, centrifugado, secado, opciones, productos y el paso a paso. También responde preguntas como "¿qué es el candado?" o "error UE".
- **Filtros**: lo mismo, pero eligiendo prendas, color, suciedad, cantidad y secado con botones.
- **Panel**: réplica del panel para practicar. Mantén presionado un botón para ver su función escondida; el modo "¿Qué es esto?" explica cada botón, luz o ícono.
- **Guía**: botones, íconos, mensajes y errores, programas, modos de secado, dispensador, símbolos de etiquetas y mantenimiento, con buscador.

## Archivos

| Archivo | Qué tiene |
|---|---|
| `js/datos-manual.js` | Datos del manual LG: programas, botones, íconos, errores, mantenimiento (con número de página). |
| `js/datos-prendas.js` | Recomendaciones generales por prenda. Aquí se agregan o ajustan prendas y palabras clave. |
| `js/motor.js` | Reglas que leen el texto y arman la configuración. |
| `js/app.js`, `css/app.css`, `index.html` | Interfaz. |
| `sw.js`, `manifest.webmanifest`, `icons/` | Instalación en el celular y funcionamiento sin internet. |

## Publicar e instalar

Para instalarla en el celular, la app tiene que estar en una dirección **https**. Se publica gratis con GitHub Pages:

1. En github.com: **New repository** → nombre `guia-lavado` → **Public** → sin README → Create.
2. Subir esta carpeta (la carpeta `.claude/` queda fuera por `.gitignore`). El primer `git push` abre el navegador para iniciar sesión en GitHub (Git Credential Manager); no hace falta crear tokens.
3. En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save**.
4. En 1–2 minutos queda en `https://USUARIO.github.io/guia-lavado/`.

En el celular (Chrome): abre la dirección → menú ⋮ → **Instalar app** (o "Agregar a pantalla principal"). Queda con su ícono y funciona sin internet.

**Al publicar cambios**, sube el número de `VERSION` en `sw.js` (por ejemplo `lavado-v2`). Si no lo haces, el celular sigue mostrando la versión guardada.

## Probar en el computador

```bash
python -m http.server 8765 --directory D:/ManualLG
```

Luego abre http://localhost:8765.
