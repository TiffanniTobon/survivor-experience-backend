# Survivor Experience — Backend

API REST para la gestión de reservas de clases grupales con selección de posiciones, desarrollada con Node.js + Express + MySQL.

---

## Tecnologías

| Tecnología           | Versión | Uso                              |
| -------------------- | ------- | -------------------------------- |
| Node.js              | >= 18   | Entorno de ejecución             |
| Express              | 4       | Framework para API REST          |
| Sequelize            | 6       | ORM para consultas SQL           |
| MySQL2               | 3       | Driver de base de datos          |
| JSON Web Token (JWT) | 9       | Autenticación y autorización     |
| bcryptjs             | 2       | Encriptación de contraseñas      |
| dotenv               | 16      | Variables de entorno             |
| cors                 | 2       | Habilitación de CORS             |
| nodemon              | 3       | Recarga automática en desarrollo |

---

## Requisitos previos

- Node.js >= 18
- npm >= 9
- MySQL >= 8.0 corriendo localmente

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/TiffanniTobon/survivor-experience-backend.git
cd survivor-experience-backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=survivor_experience
DB_USER=root
DB_PASSWORD=contraseña
JWT_SECRET=clave_secreta
```

---

## Base de datos

Crea la base de datos en MySQL antes de correr el proyecto:

```sql
CREATE DATABASE survivor_experience;
```

El esquema de tablas debe crearse manualmente ejecutando los scripts SQL del proyecto. Las tablas principales son:

| Tabla          | Descripción                                             |
| -------------- | ------------------------------------------------------- |
| `users`        | Usuarios del sistema con roles `user` y `admin`         |
| `rooms`        | Salones del gimnasio (Cycling, Cardio Step, Multiclase) |
| `positions`    | Posiciones numeradas por salón                          |
| `classes`      | Clases programadas con fecha, hora e instructor         |
| `class_types`  | Catálogo de tipos de clase disponibles                  |
| `instructors`  | Catálogo de instructores                                |
| `reservations` | Reservas de posiciones por usuario y clase              |

---

## Correr el proyecto

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor quedará disponible en: `http://localhost:3000`

---

## Estructura de carpetas

```
src/
├── config/
│   └── database.js              # Conexión a MySQL con Sequelize
├── controllers/
│   ├── auth.controller.js       # Lógica de login y registro
│   ├── class.controller.js      # Lógica CRUD de clases
│   ├── catalog.controller.js    # Lógica de tipos de clase e instructores
│   ├── position.controller.js   # Lógica de posiciones por salón y clase
│   └── reservation.controller.js # Lógica de reservas
├── middlewares/
│   ├── auth.middleware.js       # Verificación de token JWT
│   └── role.middleware.js       # Verificación de rol de usuario
├── models/
│   ├── user.model.js            # Queries de usuarios
│   ├── class.model.js           # Queries de clases + validación de salón
│   ├── catalog.model.js         # Queries de catálogos
│   ├── position.model.js        # Queries de posiciones con estado de reserva
│   └── reservation.model.js     # Queries de reservas
├── routes/
│   ├── auth.routes.js           # POST /auth/login, POST /auth/register
│   ├── class.routes.js          # GET/POST/PUT/DELETE /classes
│   ├── catalog.routes.js        # GET /catalogs/class-types, /catalogs/instructors
│   ├── position.routes.js       # GET /positions/:roomId
│   └── reservation.routes.js    # GET/POST/DELETE /reservations
├── services/
│   └── auth.service.js          # Funciones auxiliares de autenticación
├── app.js                       # Configuración de Express y rutas
└── server.js                    # Punto de entrada del servidor
```

---

## Endpoints principales

### Autenticación

| Método | Ruta             | Descripción         | Acceso  |
| ------ | ---------------- | ------------------- | ------- |
| POST   | `/auth/register` | Registro de usuario | Público |
| POST   | `/auth/login`    | Inicio de sesión    | Público |

### Clases

| Método | Ruta                       | Descripción         | Acceso      |
| ------ | -------------------------- | ------------------- | ----------- |
| GET    | `/classes?date=YYYY-MM-DD` | Clases de la semana | Autenticado |
| POST   | `/classes`                 | Crear clase         | Admin       |
| PUT    | `/classes/:id`             | Editar clase        | Admin       |
| DELETE | `/classes/:id`             | Eliminar clase      | Admin       |

### Catálogos

| Método | Ruta                    | Descripción    | Acceso      |
| ------ | ----------------------- | -------------- | ----------- |
| GET    | `/catalogs/class-types` | Tipos de clase | Autenticado |
| GET    | `/catalogs/instructors` | Instructores   | Autenticado |

### Posiciones

| Método | Ruta                          | Descripción                         | Acceso      |
| ------ | ----------------------------- | ----------------------------------- | ----------- |
| GET    | `/positions/:roomId?classId=` | Posiciones con estado libre/ocupado | Autenticado |

### Reservas

| Método | Ruta                | Descripción                  | Acceso      |
| ------ | ------------------- | ---------------------------- | ----------- |
| GET    | `/reservations/my`  | Reservas activas del usuario | Autenticado |
| POST   | `/reservations`     | Crear reserva                | Autenticado |
| DELETE | `/reservations/:id` | Cancelar reserva             | Autenticado |

---

## Seguridad

- Las contraseñas se encriptan con **bcryptjs** antes de almacenarse.
- Los endpoints protegidos requieren el header: `Authorization: Bearer <token>`
- El control de acceso por rol se aplica mediante el middleware `requireRole('admin')`.

---

## Ramas del repositorio

```
main        → código estable aprobado
develop     → integración de features
feature/*   → desarrollo de funcionalidades específicas
```

---
