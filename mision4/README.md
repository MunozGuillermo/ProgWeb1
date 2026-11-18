# M4 · Full Contact Forms: Inscripción a torneo
## Guillermo Muñoz Carmona

## Qué es
App React + TypeScript con formulario de inscripción a un torneo de videojuegos
(React Hook Form + Zod) y listado de inscritos (TanStack Query v5) sobre json-server.

## Cómo arrancarlo
npm install
npm run server      # API en http://localhost:3001
npm run dev         # en otra terminal
npm run server:corrupt   # demo del bonus (dato corrupto)

## Decisiones tomadas
- Un único esquema Zod (`src/schemas/registration.ts`) como fuente de verdad; el tipo sale de `z.infer`.
- Query key `['registrations']`, invalidada tras la mutation.
- Formulario no controlado (register) con errores accesibles (aria-invalid, aria-describedby, role="alert").
- Bonus: la respuesta del GET se valida con `safeParse` y falla con un mensaje claro.

## Uso de IA

**Herramienta:** Claude (Anthropic), a través de claude.ai.

**Qué hice con IA:**
- Planteamiento de la estructura del proyecto (carpetas `api/`, `schemas/`, `hooks/`, `components/`) y del plan de commits a partir del enunciado.
- Generación del código base: esquema Zod, hooks de TanStack Query, capa de API contra json-server, estilos CSS y la validación bonus con `safeParse`.
- Ayuda para resolver errores de configuración (PowerShell, plantilla de Vite, listado vacío).

**Cómo lo verifiqué:**
- Ejecuté cada commit en local con `npm run dev` y `npm run server` antes de subirlo.
- Probé el formulario enviándolo vacío, eligiendo "Por equipos" sin nombre de equipo, y con datos válidos.
- Probé el estado de error apagando json-server, y el bonus arrancando `npm run server:corrupt`.

## Autopsia

**1. Comprobación de nick duplicado en el cliente (`createRegistration`).**
Antes de hacer el POST hago un GET filtrando por `nickname` y lanzo un error si ya existe. Es sencillo y da un mensaje claro al usuario, pero no es robusto: dos peticiones simultáneas podrían pasar la comprobación a la vez (condición de carrera) y además hace dos peticiones por cada alta. **Alternativa descartada:** que el servidor garantice la unicidad (restricción única en base de datos y respuesta 409 que el cliente traduce a un mensaje). La descarté porque json-server no permite restricciones y era mucho más trabajo para esta misión.

**2. Esquema de la respuesta del API duplicado en vez de derivado del esquema del formulario.**
Para el bonus definí `registrationRecordSchema` en `api/registrations.ts` repitiendo los campos, lo que va contra la idea de "única fuente de verdad": si cambio un campo, hay que tocarlo en dos sitios. **Alternativa descartada:** derivarlo del esquema del formulario con `.extend({ id, createdAt })`. No lo hice porque el esquema del formulario lleva validaciones de entrada (edad mínima, refinamiento de equipo) que no tiene sentido exigir a datos que ya vienen del servidor, y el `.refine` sobre el objeto complica reutilizarlo. Prefería un esquema de respuesta más laxo (solo tipos) y aceptar la duplicación.