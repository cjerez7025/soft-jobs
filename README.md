# Soft Jobs

Plataforma para desarrolladores junior. Autenticación y autorización con JWT.

- `apoyo-desafio-soft-jobs-master/`: cliente React (Vite).
- `backend/`: servidor Express + PostgreSQL.

## Backend
1. Crear la base de datos con `apoyo-desafio-soft-jobs-master/database/DDL.sql`.
2. Copiar `backend/.env.example` a `backend/.env` y completar los valores.
3. `cd backend && npm install && npm run dev` (puerto 3000).

## Rutas
- `POST /usuarios`: registra un usuario (contraseña encriptada con bcrypt).
- `POST /login`: devuelve un token JWT con el email en el payload.
- `GET /usuarios`: devuelve el usuario autenticado (cabecera `Authorization: Bearer <token>`).
