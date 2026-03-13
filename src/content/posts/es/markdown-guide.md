---
title: 📝 Guia de estilo Markdown
date: 2026-01-02
category: Tutorial
description: Una guia completa de todas las funcionalidades Markdown soportadas en Astro-Theme-Aither
tags: [Markdown, Guide]
pinned: true
---

Este post demuestra cada funcionalidad Markdown soportada por Astro-Theme-Aither. Usalo como referencia cuando escribas tus propios posts. Guarda esta pagina en favoritos — cubre la gama completa de opciones de formato disponibles.

## Encabezados

Usa `##` para encabezados de seccion, `###` para subsecciones y `####` para sub-subsecciones. Evita `#` en el contenido del post — el titulo del post ya se renderiza como el encabezado de nivel superior.

### Encabezado de tercer nivel

Los encabezados de tercer nivel son ideales para dividir una seccion en temas distintos. Crean jerarquia visual sin ser demasiado prominentes.

#### Encabezado de cuarto nivel

Los encabezados de cuarto nivel funcionan para subsecciones detalladas. Usalos con moderacion — si tu esquema va mas alla de cuatro niveles, considera reestructurar tu contenido.

### Mejores practicas para encabezados

Algunas pautas para el uso efectivo de encabezados:

- **No saltes niveles** — ve de `##` a `###`, nunca de `##` directamente a `####`. Saltar niveles rompe el esquema del documento y puede confundir a los lectores de pantalla.
- **Manten los encabezados descriptivos** — "Configuracion" es mejor que "Cosas de setup." Los lectores escanean los encabezados antes de decidir si leer una seccion.
- **Usa sentence case** — capitaliza solo la primera palabra y los nombres propios.

## Parrafos y saltos de linea

El texto de los parrafos regulares fluye naturalmente. Deja una linea en blanco entre parrafos para separarlos.

Este es un segundo parrafo. Manten los parrafos enfocados en una idea para la mejor experiencia de lectura.

Cuando escribes para la web, parrafos mas cortos tienden a funcionar mejor que bloques largos de texto. Un parrafo de tres a cinco oraciones es una unidad de lectura comoda en pantallas. Si un parrafo supera las seis o siete oraciones, considera dividirlo.

Los saltos de linea simples dentro de un parrafo (sin linea en blanco) se trataran como un espacio, no como una nueva linea. Si necesitas un salto de linea forzado sin iniciar un nuevo parrafo, termina la linea con dos espacios o usa una etiqueta `<br>` — aunque en la practica rara vez es necesario.

## Enfasis

- **Texto en negrita** con `**dobles asteriscos**`
- *Texto en cursiva* con `*asteriscos simples*`
- ***Negrita y cursiva*** con `***triples asteriscos***`
- ~~Tachado~~ con `~~dobles tildes~~`

### Cuando usar cada estilo

La **negrita** funciona mejor para terminos clave, advertencias importantes o definiciones — cualquier cosa que el lector no deberia perderse al escanear. Usala para la frase mas importante de un parrafo, no para oraciones completas.

La *cursiva* es para enfasis dentro de una oracion, titulos de libros y publicaciones, terminos tecnicos en su primer uso y frases extranjeras. Proporciona un enfasis mas ligero que la negrita.

El ~~tachado~~ es util para mostrar correcciones, informacion obsoleta o elementos completados en un changelog. Tiene un conjunto mas reducido de casos de uso pero es valioso cuando lo necesitas.

## Enlaces

[Enlace inline](https://astro.build) con sintaxis `[texto](url)`.

Los enlaces tambien pueden referenciar otros posts en tu sitio usando rutas relativas. Usa texto descriptivo para el enlace — "lee la guia de markdown" es mejor que "haz clic aqui." Un buen texto de enlace ayuda tanto a lectores como a motores de busqueda a entender adonde lleva el enlace.

Tambien puedes crear enlaces que funcionan en contexto escribiendo texto anchor descriptivo que se lea naturalmente dentro de la oracion. Por ejemplo: la [documentacion de Astro](https://docs.astro.build) cubre cada funcionalidad en detalle.

## Listas

Lista desordenada:

- Primer elemento
- Segundo elemento
  - Elemento anidado
  - Otro elemento anidado
- Tercer elemento

Lista ordenada:

1. Primer paso
2. Segundo paso
   1. Sub-paso uno
   2. Sub-paso dos
3. Tercer paso

Lista de tareas:

- [x] Configurar el proyecto
- [x] Escribir tu primer post
- [ ] Desplegar a produccion

### Consejos de formato para listas

Las listas son una de las herramientas mas efectivas en la escritura web. Dividen el texto denso, hacen la informacion escaneable y comunican claramente secuencias o colecciones de elementos.

**Usa listas desordenadas** cuando los elementos no tienen una secuencia inherente — funcionalidades, requisitos, opciones o ejemplos.

**Usa listas ordenadas** cuando la secuencia importa — pasos de un proceso, elementos clasificados o instrucciones que deben seguirse en orden.

**Usa listas de tareas** para seguimiento de progreso, checklists de proyecto o elementos pendientes. Se renderizan como checkboxes interactivos en muchos visores Markdown, aunque en un blog estatico aparecen como indicadores visuales.

Manten los elementos de la lista paralelos en estructura. Si el primer elemento comienza con un verbo, todos los elementos deberian comenzar con un verbo.

## Citas

> El proposito de la abstraccion no es ser vago, sino crear un nuevo nivel semantico en el que se pueda ser absolutamente preciso.
>
> — Edsger W. Dijkstra

Citas anidadas:

> Primer nivel
>
> > Segundo nivel
> >
> > > Tercer nivel

### Uso de citas

Las citas sirven varios propositos mas alla de citar personas famosas:

- **Citar fuentes** — cuando se hace referencia a otro articulo, libro o documento
- **Llamadas de atencion** — resaltar informacion importante o advertencias
- **Cita estilo email** — mostrar lo que alguien dijo en una conversacion a la que estas respondiendo
- **Citas destacadas** — llamar la atencion sobre un pasaje clave de tu propio articulo

Cuando uses citas para atribucion, coloca el nombre del autor en una linea separada precedida por un guion largo, como se muestra en el ejemplo de Dijkstra arriba.

## Codigo

Codigo `inline` con backticks. Usa codigo inline para nombres de funcion como `getPublishedPosts()`, rutas de archivo como `src/content/posts/`, instrucciones de linea de comandos como `pnpm dev` y cualquier valor literal en el texto.

Bloque de codigo con resaltado de sintaxis:

```typescript
interface Post {
  title: string;
  date: Date;
  description?: string;
  tags?: string[];
  draft?: boolean;
}

function getPublishedPosts(posts: Post[]): Post[] {
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
```

```css
@theme {
  --font-sans: 'system-ui', sans-serif;
  --font-serif: 'ui-serif', 'Georgia', serif;
}
```

### Consejos para bloques de codigo

Siempre especifica el identificador del lenguaje despues de los triples backticks de apertura. Esto habilita el resaltado de sintaxis, que mejora dramaticamente la legibilidad. Identificadores comunes incluyen `typescript`, `javascript`, `css`, `html`, `bash`, `json`, `python` y `markdown`.

Para comandos shell, usa `bash` o `sh`:

```bash
# Instalar dependencias
pnpm install

# Iniciar el servidor de desarrollo
pnpm dev

# Construir para produccion
pnpm build
```

Para archivos de configuracion JSON:

```json
{
  "name": "my-blog",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build"
  }
}
```

Manten los bloques de codigo enfocados. Muestra solo las lineas relevantes en lugar de pegar un archivo completo. Si se necesita contexto, agrega un comentario indicando donde se encuentra el codigo.

## Tablas

| Funcionalidad | Estado | Notas |
|---|---|---|
| Modo oscuro | Soportado | Claro / Oscuro / Sistema |
| Feed RSS | Integrado | `/rss.xml` |
| Sitemap | Auto-generado | Via `@astrojs/sitemap` |
| SEO | Integrado | Open Graph + canonico |

Columnas alineadas a la derecha y centradas:

| Izquierda | Centro | Derecha |
|:---|:---:|---:|
| Texto | Texto | Texto |
| Texto mas largo | Texto mas largo | Texto mas largo |

### Pautas para tablas

Las tablas funcionan mejor para datos estructurados con columnas y filas claras. Son ideales para comparaciones de funcionalidades, opciones de configuracion, parametros de API y datos de referencia.

Manten las tablas simples. Si una tabla tiene mas de cinco o seis columnas, se vuelve dificil de leer en dispositivos moviles. Considera dividir tablas complejas en varias mas pequenas, o usa un formato de lista.

La alineacion de columnas se controla con dos puntos en la fila separadora:

- `:---` para alineacion a la izquierda (predeterminado)
- `:---:` para alineacion al centro
- `---:` para alineacion a la derecha

Usa la alineacion a la derecha para datos numericos para que los puntos decimales se alineen visualmente.

## Linea horizontal

Usa `---` para crear una linea horizontal:

---

Contenido despues de la linea.

Las lineas horizontales son utiles para separar secciones principales de un post, indicar un cambio de tema o dividir visualmente articulos muy largos. Usalas con moderacion — si necesitas separadores frecuentes, los encabezados podrian ser una mejor eleccion estructural.

## Imagenes

Las imagenes se soportan con sintaxis Markdown estandar:

```markdown
![Texto alternativo](./image.jpg)
```

Este tema se enfoca en la tipografia, pero las imagenes funcionan cuando las necesitas.

### Mejores practicas para imagenes

- **Siempre incluye texto alternativo** — es esencial para la accesibilidad y tambien aparece cuando las imagenes no cargan
- **Usa nombres de archivo descriptivos** — `dashboard-error-state.png` es mejor que `screenshot-2.png`
- **Optimiza los tamanos de archivo** — comprime las imagenes antes de agregarlas a tu repositorio; imagenes grandes ralentizan la carga de las paginas
- **Considera el flujo de lectura** — coloca las imagenes cerca del texto que las referencia, no a parrafos de distancia

## Poniendo todo junto

Las funcionalidades Markdown descritas en esta guia cubren la gran mayoria de lo que necesitaras para la escritura de blog. La clave para un buen Markdown es usar el elemento correcto para el proposito correcto: encabezados para estructura, enfasis para importancia, listas para colecciones, bloques de codigo para contenido tecnico y parrafos para todo lo demas.

Escribe con claridad, formatea con consistencia y deja que la tipografia haga su trabajo.
