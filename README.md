# Crunchyroll Backend

Este es un proyecto backend para una aplicación basada en Crunchyroll, que permite gestionar usuarios, autenticación y perfiles utilizando Node.js, Express y MongoDB.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [MongoDB](https://www.mongodb.com/) (local o en la nube)

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tuusuario/crunchyroll_backend.git
   cd crunchyroll_backend
   ```

2. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

## Configuración

1. Crea un archivo `.env` en el directorio raíz del proyecto con las siguientes variables de entorno:

   ```env
   PORT=5005
   MONGO_URI=tu_uri_de_mongodb
   JWT_SECRET=tu_clave_secreta_para_jwt
   JWT_REFRESH_SECRET=tu_clave_secreta_para_refresh_tokens
   ```

2. Configura la URI de MongoDB (`MONGO_URI`). Puedes usar una base de datos local o un servicio en la nube como [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

## Scripts disponibles

En el archivo `package.json`, se incluyen los siguientes scripts:

- `npm start`: Inicia el servidor en modo de producción.
- `npm run dev`: Inicia el servidor en modo de desarrollo con reinicio automático utilizando Nodemon.

## Librerías utilizadas

## Dependencias principales

El proyecto utiliza las siguientes librerías:

1. **bcrypt / bcryptjs:**

   - Utilizadas para hash y comparación de contraseñas.
   - Instalación:
     ```bash
     npm install bcrypt bcryptjs
     ```

2. **body-parser:**

   - Middleware para analizar el cuerpo de las solicitudes.
   - Instalación:
     ```bash
     npm install body-parser
     ```

3. **cors:**

   - Middleware para habilitar CORS (Cross-Origin Resource Sharing).
   - Instalación:
     ```bash
     npm install cors
     ```

4. **dotenv:**

   - Para manejar variables de entorno.
   - Instalación:
     ```bash
     npm install dotenv
     ```

5. **express:**

   - Framework para construir el servidor web.
   - Instalación:
     ```bash
     npm install express
     ```

6. **jsonwebtoken:**

   - Utilizado para la autenticación mediante JSON Web Tokens (JWT).
   - Instalación:
     ```bash
     npm install jsonwebtoken
     ```

7. **mongoose:**
   - ODM (Object Document Mapper) para interactuar con MongoDB.
   - Instalación:
     ```bash
     npm install mongoose
     ```

## Dependencias de desarrollo

1. **nodemon:**
   - Herramienta que reinicia automáticamente el servidor cuando se detectan cambios en los archivos.
   - Instalación:
     ```bash
     npm install --save-dev nodemon
     ```

## Configuración

1. Crea un archivo `.env` en el directorio raíz con las siguientes variables de entorno:

   ```env
   PORT=5005
   MONGODB_URI=mongodb://localhost:27017/tu_basedatos
   JWT_SECRET=tu_secreto_jwt
   ```

2. Inicia el servidor en modo desarrollo:

   ```bash
   npm run dev
   ```

   O en modo producción:

   ```bash
   npm start
   ```

## Uso

1. Inicia el servidor en modo de desarrollo:

   ```bash
   npm run dev
   ```

2. La API estará disponible en `http://localhost:5005` por defecto.

## Endpoints principales

### Autenticación

- **POST /api/auth/register**: Registro de nuevos usuarios.
- **POST /api/auth/login**: Inicio de sesión y generación de token JWT.
- **POST /api/auth/renew**: Renovación del token JWT.

### Usuarios

- **GET /api/users/profile**: Obtiene el perfil del usuario autenticado.
- **PUT /api/users/profile**: Actualiza el perfil del usuario.

## Contribuciones

Si deseas contribuir al proyecto:

1. Haz un fork del repositorio.
2. Crea una nueva rama para tu funcionalidad o corrección.
3. Realiza un pull request con tus cambios.

## Licencia

Este proyecto está bajo la licencia ISC. Consulta el archivo LICENSE para más información.
