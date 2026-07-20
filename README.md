# InnovaTube

Proyecto base con Node.js, Express, Angular y PostgreSQL.

## Descripción

Aplicación web full stack para gestionar contenido y recursos. El backend se ejecuta en Node.js con Express y usa PostgreSQL como base de datos. El frontend está construido con Angular.

## Tecnologías

- Node.js
- Express
- Angular
- PostgreSQL

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd InnovaTube
   ```

2. Instalar dependencias del backend:
   ```bash
   cd backend
   npm install
   ```

3. Instalar dependencias del frontend:
   ```bash
   cd ../frontend
   npm install
   ```

## Configuración

1. Crear la base de datos en PostgreSQL.
2. Configurar la conexión en el archivo de variables de entorno del backend, por ejemplo:
   ```env
   DATABASE_URL=postgres://usuario:contraseña@localhost:5432/nombre_base_datos
   PORT=3000
   ```

## Ejecución

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
ng serve
```

## Estructura recomendada

- `backend/` - servidor Node.js y Express
- `frontend/` - aplicación Angular
- `database/` - scripts o migraciones de PostgreSQL

## Notas

- Asegúrate de tener Node.js y PostgreSQL instalados.
- Verifica que el frontend y el backend usen puertos diferentes.
