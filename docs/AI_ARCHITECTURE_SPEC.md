# Spec de Arquitectura para IA

## Objetivo

Este documento define cómo está organizado el frontend y dónde debe vivir cada pieza nueva para que futuras prompts de IA generen componentes, hooks, tipos y cambios sin romper el patrón actual del proyecto.

El proyecto es un frontend en React + TypeScript centrado en el flujo `context-builder`, cuyo objetivo es transformar texto libre en formularios estructurados por tipo de documento.

## Stack actual

- Vite
- React 19
- TypeScript
- React Router
- Redux Toolkit + React Redux
- Axios
- Tailwind CSS

## Estructura general

La arquitectura actual sigue un patrón modular: una capa de aplicación muy delgada y un módulo de negocio principal.

### Shell de aplicación

- `src/main.tsx`: monta React e inyecta el store global.
- `src/App.tsx`: delega directamente al sistema de rutas.
- `src/routes/AppRoutes.tsx`: envuelve el router con `BrowserRouter`.
- `src/routes/routes.tsx`: define las rutas y carga el módulo principal con lazy loading.

Regla: la capa de aplicación no debe contener lógica de negocio. Solo debe montar providers, router, rutas, guards y boundaries de carga.

### Módulo principal

El módulo actual vive en `src/modules/context-builder`.

Su organización es esta:

- `pages/`: composición de la pantalla
- `components/`: piezas visuales reutilizables del módulo
- `components/forms/`: formularios específicos por tipo de documento
- `hooks/`: lógica de orquestación del flujo
- `interfaces/`: contratos, enums y tipos del dominio
- `templates/`: fábricas, defaults, merge y fallback de datos

Regla: cualquier funcionalidad nueva debe ubicarse primero según esta separación antes de escribir código.

## Dónde va cada cosa nueva

### Si es una pantalla completa

Debe ir en `pages/` dentro del módulo correspondiente.

Responsabilidades:

- componer layout
- conectar selectores del store
- usar hooks del módulo
- pasar props a componentes hijos

No debe hacer:

- llamadas HTTP directas
- normalización compleja de datos
- lógica de negocio distribuida entre handlers grandes

### Si es una pieza visual reutilizable

Debe ir en `components/`.

Ejemplos:

- selectores
- tablas
- paneles
- inputs compuestos
- bloques de feedback

Regla: si una pieza recibe props y solo representa o emite cambios, es un componente.

### Si es un formulario específico de un tipo de documento

Debe ir en `components/forms/`.

Regla:

- un tipo de documento = un formulario especializado
- el formulario recibe datos ya normalizados
- el formulario no debe llamar servicios
- el formulario no debe decidir qué tipo renderizar

La selección del formulario correcto ocurre en `DynamicFormRenderer.tsx`.

### Si coordina estado, flujo y acciones

Debe ir en `hooks/`.

Referencia actual: `useContextBuilder.ts`.

Este hook concentra hoy:

- tipo seleccionado
- texto libre
- draft estructurado
- modo crear o editar
- origen IA o manual
- loading de generación
- mensajes de feedback
- acciones de guardar, resetear, editar, eliminar y crear nuevo draft

Regla: si una lógica conecta varios componentes, controla transiciones de estado o combina UI + async + negocio, debe vivir en un hook del módulo.

### Si es un contrato o tipo de dominio

Debe ir en `interfaces/`.

Incluye:

- interfaces base
- interfaces por tipo de documento
- enums
- type guards
- unions

Regla: no usar strings sueltos para tipos de documento si ya existe enum o unión tipada.

### Si crea datos base, hace merge o fallback

Debe ir en `templates/`.

Referencia actual: `documentTemplates.ts`.

Aquí vive:

- creación de documentos vacíos por tipo
- construcción de fallback local si falla IA
- merge seguro de respuestas parciales de IA
- derivación de metadatos simples como título o tags

Regla: la normalización no debe quedar dentro de componentes ni dentro de formularios.

### Si consume API

Debe ir en `src/services/`.

Referencia actual: `DocumentService.ts`.

Regla:

- componentes y páginas no llaman Axios directo
- servicios exponen funciones pequeñas y tipadas
- las rutas HTTP deben quedar aisladas en esta capa

### Si es estado compartido o persistido dentro de la app

Debe ir en Redux, dentro de `src/store/slices/`.

Referencia actual: `documentsSlice.ts`.

Regla:

- Redux guarda colecciones o estado compartido entre pantallas
- el estado transitorio del formulario debe quedarse en el hook del módulo salvo que realmente se comparta

## Flujo actual del módulo

El flujo real del `context-builder` es este:

1. El usuario selecciona un tipo de documento.
2. El usuario pega texto libre o decide iniciar un borrador manual.
3. Si usa IA, el hook llama `mapWithAI(rawText, tipo)`.
4. La respuesta se normaliza con `mergeAiResult`.
5. Si falla la IA, se crea un fallback con `createFallbackFromRawText`.
6. El resultado se muestra en el formulario tipado correcto.
7. Al guardar, se hace `upsert` en Redux con id, tipo, origen y data.

Regla: la IA es una ayuda, no la fuente de verdad. Siempre debe existir fallback y normalización antes de renderizar el formulario.

## Modelo de dominio

Todos los documentos comparten una base común:

- `id?`
- `titulo`
- `contenido`
- `proyectoId`
- `estado`
- `tags?`
- `createdAt?`
- `updatedAt?`

Los tipos soportados actualmente están definidos en `DocumentTipoEnum`:

- `DDL`
- `NEGOCIO`
- `SISTEMA`
- `LINEAMIENTO`

La unión principal del dominio es `DocumentUnionType`.

Regla: cualquier nuevo tipo de documento debe integrarse en toda la cadena de tipado, no solo en la UI.

## Contrato para agregar un nuevo tipo de documento

Si la IA crea un nuevo tipo, debe actualizar todos estos puntos:

1. `interfaces/DocumentTipoEnum.ts`
2. la nueva interface del documento
3. `interfaces/DocumentUnionType.ts`
4. `templates/documentTemplates.ts` en la creación vacía
5. `templates/documentTemplates.ts` en el merge de IA
6. `templates/documentTemplates.ts` en el fallback local
7. `components/forms/<NuevoTipo>Form.tsx`
8. `components/DynamicFormRenderer.tsx`

Regla: si falta uno de esos puntos, el tipo nuevo está incompleto.

## Reglas de composición UI

La pantalla actual está separada en dos zonas:

- zona de control: selector, texto libre, acciones, feedback y tabla CRUD
- zona de edición: formulario estructurado tipado

Regla: futuras pantallas o mejoras del builder deben mantener esta separación entre control del flujo y superficie de edición.

## Reglas de render dinámico

`DynamicFormRenderer.tsx` es el punto único donde se decide qué formulario mostrar.

Reglas:

- el branching por tipo debe vivir ahí
- los formularios deben recibir datos ya listos para editar
- cada formulario debe propagar un objeto tipado completo por `onChange`
- no repartir lógica de selección de tipo entre varios componentes

## Reglas de diseño visual

La UI actual usa:

- layout por paneles
- contraste alto
- acento naranja
- separación clara entre acciones primarias y secundarias
- estilo dashboard para la cabecera del módulo

Regla: si la IA crea nuevos componentes visuales, debe mantener esa línea y no introducir layouts genéricos sin jerarquía.

## Reglas de nombres

- componentes React: PascalCase
- hooks: prefijo `use`
- interfaces y enums: nombres explícitos de dominio
- servicios: funciones con verbo al inicio

## Reglas para futuras prompts de IA

La IA debe respetar estas decisiones:

- no meter lógica de negocio en `App.tsx`
- no meter llamadas HTTP dentro de componentes o formularios
- no guardar todo en Redux por defecto
- no usar respuestas crudas de IA sin normalización
- no crear tipos nuevos sin actualizar enum, union, templates y renderer
- no hacer páginas gigantes si la lógica puede separarse en hook + componentes

## Resumen corto para reutilizar en prompts

```text
Este frontend usa Vite + React 19 + TypeScript + Redux Toolkit + React Router + Tailwind.
La app shell es delgada: main -> App -> AppRoutes -> routes.
La lógica de negocio vive en hooks del módulo, no en páginas ni en App.
El módulo principal es src/modules/context-builder.
pages compone la pantalla, components renderiza piezas UI, components/forms contiene formularios tipados, hooks orquesta el flujo, interfaces define contratos del dominio, templates crea defaults y normaliza datos, services encapsula API y store guarda estado compartido.
Si agregas un componente visual reutilizable, va en components.
Si agregas una pantalla, va en pages.
Si agregas lógica de flujo o coordinación, va en hooks.
Si agregas tipos o contratos, va en interfaces.
Si agregas factories, merge o fallback, va en templates.
Si agregas llamadas HTTP, va en services.
Si agregas un nuevo tipo de documento, debes actualizar enum, interface, union, templates, formulario y DynamicFormRenderer.
```