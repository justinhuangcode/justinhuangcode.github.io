---
title: Agentes de IA y uso de herramientas (Ejemplo)
date: 2026-01-09
category: AI
description: Como los modelos de IA van mas alla del chat ejecutando acciones en el mundo real
tags: [AI, Agents]
pinned: false
---

Un agente de IA es un modelo de lenguaje que puede realizar acciones, no solo generar texto. Puede buscar en la web, ejecutar codigo, llamar APIs, leer archivos y tomar decisiones sobre que hacer a continuacion. Este cambio de la generacion pasiva de texto a la resolucion activa de problemas representa uno de los desarrollos mas significativos en la IA aplicada.

## Del chat a la accion

Un chatbot responde preguntas. Un agente resuelve problemas. La diferencia es la autonomia: los agentes deciden que herramientas usar, en que orden y como manejar los errores.

Consideremos la diferencia en la practica. Le preguntas a un chatbot: "Como esta el clima en Tokio?" Podria responder basandose en sus datos de entrenamiento, que tienen meses o anios de antiguedad y casi con seguridad estan equivocados. Le haces la misma pregunta a un agente, y este llama a una API meteorologica, obtiene los datos actuales y devuelve una respuesta precisa y actualizada.

El chatbot genera texto plausible. El agente interactua con el mundo.

### El espectro de la autonomia

No todos los agentes son igualmente autonomos. Existe un espectro:

1. **Chat asistida por herramientas** — el modelo puede llamar herramientas, pero solo en respuesta directa a solicitudes del usuario. Una llamada de herramienta por turno.
2. **Agentes multi-paso** — el modelo puede encadenar multiples llamadas de herramientas para cumplir una tarea, decidiendo la secuencia por si mismo.
3. **Agentes completamente autonomos** — el modelo opera independientemente durante periodos prolongados, tomando decisiones, manejando errores y persiguiendo objetivos con minima supervision humana.

La mayoria de los sistemas en produccion hoy se encuentran en los niveles 1-2. Los agentes completamente autonomos son un area de investigacion activa con desafios de seguridad significativos aun por resolver.

## Uso de herramientas

El uso de herramientas permite que un modelo de IA llame funciones externas. El modelo decide cuando una herramienta es necesaria, genera los parametros correctos e incorpora el resultado en su respuesta. Esto convierte un generador de texto en un asistente capaz.

### Como funciona el uso de herramientas

La mecanica es directa:

1. **Definicion de herramienta** — describes las herramientas disponibles al modelo, incluyendo sus nombres, parametros y lo que hacen. Tipicamente se proporciona como JSON estructurado en el prompt del sistema o mediante un campo API dedicado.
2. **Decision** — al procesar una solicitud del usuario, el modelo decide si una herramienta seria util. De ser asi, genera una llamada con los parametros apropiados.
3. **Ejecucion** — tu aplicacion ejecuta la llamada (el modelo no la ejecuta directamente) y devuelve el resultado.
4. **Integracion** — el modelo incorpora el resultado de la herramienta en su respuesta al usuario.

### Ejemplo de definicion de herramienta

```json
{
  "name": "search_documentation",
  "description": "Search the product documentation for relevant articles",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "The search query"
      },
      "max_results": {
        "type": "integer",
        "description": "Maximum number of results to return",
        "default": 5
      }
    },
    "required": ["query"]
  }
}
```

El modelo ve esta definicion y sabe que puede buscar en la documentacion. Cuando un usuario hace una pregunta sobre el producto, el modelo genera una llamada como `search_documentation(query="como restablecer la contrasenia")`, tu sistema ejecuta la busqueda y el modelo usa los resultados para componer una respuesta precisa.

### Categorias comunes de herramientas

Los sistemas de agentes en produccion tipicamente ofrecen herramientas en varias categorias:

- **Recuperacion de informacion** — busqueda web, consultas a bases de datos, lectura de archivos, llamadas API
- **Ejecucion de codigo** — ejecutar Python, JavaScript o comandos shell en un entorno sandbox
- **Comunicacion** — enviar correos, publicar mensajes, crear tickets
- **Manipulacion de archivos** — crear, editar y organizar archivos
- **Operaciones del sistema** — desplegar codigo, gestionar infraestructura, ejecutar pipelines de CI

Las herramientas que proporcionas definen los limites de lo que el agente puede hacer. Un conjunto de herramientas bien disenado le da al agente suficiente capacidad para ser util sin suficiente poder para ser peligroso.

## Loops agentivos

El patron mas poderoso es el loop agentivo: el modelo planifica un paso, lo ejecuta, observa el resultado y decide el siguiente paso. Este ciclo continua hasta que la tarea se completa o el modelo determina que no puede continuar.

### El loop en la practica

Consideremos un agente encargado de depurar un test que falla:

1. **Planifica** — "Deberia primero leer el archivo de test para entender que esta probando"
2. **Ejecuta** — llama a `read_file("tests/auth.test.ts")`
3. **Observa** — ve que el test espera un estado 200 pero recibe 401
4. **Planifica** — "Deberia revisar el middleware de autenticacion para ver que devuelve 401"
5. **Ejecuta** — llama a `read_file("src/middleware/auth.ts")`
6. **Observa** — encuentra que la logica de validacion del token tiene un bug en la verificacion de expiracion
7. **Planifica** — "Deberia corregir la comparacion de expiracion"
8. **Ejecuta** — llama a `edit_file(...)` con la correccion
9. **Observa** — confirma que la edicion fue realizada
10. **Planifica** — "Deberia ejecutar el test para verificar la correccion"
11. **Ejecuta** — llama a `run_command("pnpm test tests/auth.test.ts")`
12. **Observa** — el test pasa
13. **Completa** — reporta la correccion al usuario

Cada paso implica que el modelo razona sobre el estado actual, decide que hacer a continuacion y se adapta segun lo que descubre. Esto es fundamentalmente diferente de un script lineal: el agente maneja descubrimientos inesperados y cambia de rumbo cuando es necesario.

### Manejo de errores en el loop

Los agentes robustos deben manejar los fallos con elegancia. Una herramienta podria devolver un error, un archivo podria no existir o una API podria estar limitada por tasa. Un buen diseno de agentes incluye:

- **Logica de reintento** — reintentar fallos transitorios con backoff
- **Estrategias alternativas** — si un enfoque falla, intentar otro
- **Degradacion gradual** — si la tarea no puede completarse totalmente, completar lo mas posible y explicar que queda pendiente
- **Limites del loop** — establecer un numero maximo de iteraciones para prevenir loops infinitos cuando el agente se queda atascado

## Disenando herramientas efectivas

La calidad de un sistema de agentes depende en gran medida de la calidad de sus herramientas. Herramientas mal disenadas llevan a agentes confundidos y resultados incorrectos.

### Principios de diseno de herramientas

- **Nombres claros** — `search_users` es mejor que `query_db_1`. El modelo usa el nombre para decidir cuando llamar a la herramienta.
- **Parametros descriptivos** — incluir descripciones para cada parametro. El modelo lee estas descripciones para determinar que valores pasar.
- **Alcance enfocado** — cada herramienta deberia hacer una cosa bien. Una herramienta `read_file` y una `write_file` son mejores que una herramienta `file_operations` con un parametro de modo.
- **Errores utiles** — devolver mensajes de error claros que ayuden al modelo a entender que salio mal y que intentar en su lugar.
- **Idempotentes cuando sea posible** — herramientas que pueden reintentarse de forma segura simplifican el manejo de errores.

## Riesgos

Los agentes que pueden tomar acciones pueden tomar acciones equivocadas. El sandboxing, los pasos de confirmacion y las revisiones human-in-the-loop son medidas de seguridad esenciales para cualquier sistema de agentes en produccion.

### Categorias de riesgo

- **Acciones destructivas** — un agente con acceso al sistema de archivos podria eliminar archivos importantes. Un agente con acceso a la base de datos podria eliminar tablas. Los entornos sandbox y los limites de permisos son esenciales.
- **Exfiltracion de datos** — un agente que puede leer datos sensibles y hacer solicitudes de red podria inadvertidamente (o mediante inyeccion de prompt) filtrar informacion.
- **Costos desbocados** — un agente en un loop llamando APIs costosas puede acumular costos significativos rapidamente. Los limites de presupuesto y el rate limiting son necesidades practicas.
- **Acciones incorrectas tomadas con confianza** — el agente podria malinterpretar una solicitud y tomar una accion irreversible. Para operaciones de alto riesgo, siempre requiere confirmacion humana.

### Patrones de seguridad

Los sistemas de agentes en produccion deberian implementar varios patrones de seguridad:

1. **Privilegio minimo** — dar al agente solo las herramientas que necesita para su tarea especifica, nada mas
2. **Sandboxing** — ejecutar codigo y operaciones de archivos en entornos aislados
3. **Puertas de confirmacion** — requerir aprobacion humana para acciones destructivas o irreversibles
4. **Registro de auditoria** — registrar cada llamada de herramienta y su resultado para revision
5. **Interruptores de emergencia** — proporcionar mecanismos para detener inmediatamente un agente en ejecucion
6. **Limites de presupuesto** — establecer topes estrictos en llamadas API, uso de tokens y tiempo de computo

El objetivo no es impedir que los agentes sean utiles, sino asegurar que sean utiles dentro de limites bien definidos.
