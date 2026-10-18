# Soft Jobs

Plataforma para que desarrolladores junior consigan trabajos cortos y acumulen experiencia. Este proyecto corresponde al **Desafío Soft Jobs** (Desafío Latam, módulo Backend con Node y Express): un servidor para la **autenticación y autorización de usuarios con JWT**, consumido por un cliente React.

## Contenido del repositorio

| Carpeta | Descripción |
|---|---|
| `backend/` | Servidor Express + PostgreSQL (lo desarrollado en este desafío) |
| `apoyo-desafio-soft-jobs-master/` | Cliente React + Vite entregado como material de apoyo, sin modificar. Incluye el script SQL en `database/DDL.sql` |

## Tecnologías

- Node.js (ES Modules) y Express 5
- PostgreSQL con el paquete `pg`
- `jsonwebtoken` para firmar, verificar y decodificar tokens JWT
- `bcryptjs` para encriptar contraseñas
- `cors` y `dotenv`
- Cliente: React 18, Vite, Axios, Bootstrap

## Requisitos previos

- Node.js 18 o superior
- PostgreSQL instalado y en ejecución
- npm

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/cjerez7025/soft-jobs.git
cd soft-jobs
```

### 2. Crear la base de datos

Abre `psql` y ejecuta el contenido de `apoyo-desafio-soft-jobs-master/database/DDL.sql`:

```sql
CREATE DATABASE softjobs;

\c softjobs;

CREATE TABLE usuarios (
  id        SERIAL        NOT NULL,
  email     VARCHAR(50)   NOT NULL  UNIQUE,
  password  VARCHAR(60)   NOT NULL,
  rol       VARCHAR(25)   NOT NULL,
  lenguage  VARCHAR(20)   NOT NULL,
  PRIMARY KEY (id)
);
```

La columna se llama `lenguage` (con esa grafía) porque así la usa el cliente. `password` tiene 60 caracteres, el largo exacto de un hash bcrypt.

### 3. Configurar y levantar el backend

```bash
cd backend
cp .env.example .env
```

Edita `backend/.env` con tus datos:

| Variable | Descripción | Valor de ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor (el cliente espera el 3000) | `3000` |
| `DB_HOST` | Host de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de tu PostgreSQL | `tu_contraseña` |
| `DB_NAME` | Nombre de la base de datos | `softjobs` |
| `JWT_SECRET` | Clave secreta para firmar los tokens | `una_clave_larga_y_secreta` |

Luego instala y ejecuta:

```bash
npm install
npm run dev
```

Debe mostrar `Servidor encendido en http://localhost:3000`. El archivo `.env` no se sube al repositorio.

### 4. Levantar el cliente (en otra terminal)

```bash
cd apoyo-desafio-soft-jobs-master
npm install
npm run dev
```

Abre en el navegador la URL que muestre Vite, normalmente **http://localhost:5173**.

### 5. Flujo de prueba

1. Entra a **Registrarse**, completa email, contraseña, rol y lenguaje.
2. Entra a **Iniciar Sesión** con esas credenciales.
3. Entra a **Mi Perfil**: se muestra el email, rol y lenguaje del usuario autenticado.
4. Pulsa **Salir** para cerrar sesión.

## Estructura del backend

```
backend/
├── .env.example               Variables de entorno de ejemplo
├── package.json
└── src/
    ├── index.js               Servidor, rutas y orden de middlewares
    ├── controllers.js         Lógica de registro, login y consulta de usuario
    ├── config/
    │   └── db.js              Conexión a PostgreSQL (Pool)
    └── middlewares/
        ├── logger.js              Reporta por terminal cada consulta recibida
        ├── checkCredentials.js    Verifica que existan credenciales en el body
        ├── verifyToken.js         Valida el token JWT de la cabecera Authorization
        └── errorHandler.js        Rutas inexistentes y captura global de errores
```

## API

### `POST /usuarios` — Registrar usuario

Middlewares: `checkCredentials`, `checkRegisterFields`.

Body:

```json
{
  "email": "docente@desafiolatam.com",
  "password": "123456",
  "rol": "Full Stack Developer",
  "lenguage": "JavaScript"
}
```

| Código | Respuesta |
|---|---|
| `201` | `{ "message": "Usuario registrado con éxito" }` |
| `400` | Falta email, password, rol o lenguage |
| `409` | `{ "message": "El email ya se encuentra registrado" }` |
| `500` | Error interno del servidor |

La contraseña se encripta con `bcrypt` (10 rondas de sal) **antes** de guardarse. Nunca se almacena en texto plano.

### `POST /login` — Iniciar sesión

Middleware: `checkCredentials`.

Body:

```json
{ "email": "docente@desafiolatam.com", "password": "123456" }
```

| Código | Respuesta |
|---|---|
| `200` | `{ "token": "<JWT>" }` |
| `400` | Falta email o password |
| `401` | `{ "message": "Email o contraseña incorrecta" }` |

El token se firma con `JWT_SECRET`, lleva el **email** del usuario en el payload y expira en **1 hora**.

### `GET /usuarios` — Datos del usuario autenticado

Middleware: `verifyToken`.

Cabecera requerida:

```
Authorization: Bearer <token>
```

Pasos que ejecuta el servidor:

1. Extrae el token de la cabecera `Authorization`.
2. Verifica su validez con la misma clave secreta usada al firmarlo.
3. Decodifica el token para obtener el email del payload.
4. Busca y devuelve el registro del usuario (sin la contraseña).

| Código | Respuesta |
|---|---|
| `200` | `[ { "id": 1, "email": "...", "rol": "...", "lenguage": "..." } ]` |
| `401` | `{ "message": "Token no proporcionado" }` o `{ "message": "Token inválido o expirado" }` |

La respuesta es un arreglo porque así lo espera el cliente (`data: [user]`).

## Cumplimiento de los requerimientos del desafío

| # | Requerimiento | Dónde se resuelve |
|---|---|---|
| 1 | Registrar y obtener usuarios de la base de datos | `registerUser` y `getUser` en `src/controllers.js` |
| 2a | Middleware: verificar existencia de credenciales | `src/middlewares/checkCredentials.js` |
| 2b | Middleware: validar el token de las cabeceras | `src/middlewares/verifyToken.js` |
| 2c | Middleware: reportar por terminal las consultas recibidas | `src/middlewares/logger.js` |
| 3 | Firmar, verificar y decodificar tokens JWT | `jwt.sign` en `loginUser`; `jwt.verify` y `jwt.decode` en `verifyToken.js` |
| 4 | Capturar y devolver los errores del servidor | `try/catch` con `next(error)` en cada controlador y `src/middlewares/errorHandler.js` |
| 5 | Encriptar contraseñas al registrar | `bcrypt.hashSync` en `registerUser`; comparación con `bcrypt.compareSync` en `loginUser` |

## Pruebas rápidas con curl

```bash
# Registrar
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{"email":"docente@desafiolatam.com","password":"123456","rol":"Full Stack Developer","lenguage":"JavaScript"}'

# Login (devuelve el token)
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"docente@desafiolatam.com","password":"123456"}'

# Consultar usuario autenticado (reemplaza <token>)
curl http://localhost:3000/usuarios -H "Authorization: Bearer <token>"
```

## Solución de problemas

| Síntoma | Causa probable |
|---|---|
| `ERR_CONNECTION_REFUSED` en el navegador | El cliente no está corriendo: ejecuta `npm run dev` en `apoyo-desafio-soft-jobs-master` |
| Error al registrar o iniciar sesión | Revisa `DB_PASSWORD` en `.env` y que la base `softjobs` y la tabla `usuarios` existan |
| `EADDRINUSE` | El puerto 3000 ya está ocupado por otro proceso |
| "Token inválido o expirado" | El token venció (1 hora) o `JWT_SECRET` cambió: vuelve a iniciar sesión |

## Autor

Carlos Jerez — Desafío Latam, Fullstack Backend con Node y Express.
