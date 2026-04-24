# 📝 Google Keep Clone - Team Babilonicos

Aplicación web clon de Google Keep desarrollada con **Angular 21** (frontend) y **NestJS** (backend).

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Angular](https://img.shields.io/badge/Angular-21-red)
![NestJS](https://img.shields.io/badge/NestJS-11-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación Paso a Paso](#instalación-paso-a-paso)
- [Configuración de Base de Datos](#configuración-de-base-de-datos)
- [Ejecutar el Proyecto](#ejecutar-el-proyecto)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

---

## ✨ Características

### ✅ Funcionalidades Implementadas

- **📝 Gestión de Notas**
  - Crear notas con título y contenido
  - Editar y eliminar notas
  - Fijar notas (pin) para que aparezcan primero
  - Archivar notas
  - Papelera (soft delete)

- **🎨 Personalización**
  - 11 colores de fondo para notas
  - Los colores se aplican en tiempo real

- **✅ Listas de Verificación (Checklists)**
  - Crear notas como lista de tareas
  - Marcar/desmarcar elementos
  - Agregar y eliminar elementos de la lista

- **🏷️ Etiquetas (Labels)**
  - Crear etiquetas personalizadas
  - Filtrar notas por etiquetas
  - Sidebar dinámico con etiquetas del usuario

- **📷 Imágenes**
  - Subir imágenes a las notas
  - Las imágenes se guardan en carpeta `uploads/`
  - Límite de 5MB por imagen
  - Formatos: JPG, PNG, GIF, WebP

- **🔔 Vistas de Navegación**
  - **Notas**: Todas las notas activas
  - **Recordatorios**: Notas con recordatorio
  - **Etiquetas**: Filtrar por etiqueta específica
  - **Papelera**: Notas eliminadas

- **🔍 Búsqueda**
  - Barra de búsqueda en tiempo real

---

## 🛠 Tecnologías

### Frontend
- **Angular 21** - Framework de TypeScript
- **PrimeNG** - Componentes UI
- **RxJS** - Programación reactiva
- **SCSS** - Estilos

### Backend
- **NestJS 11** - Framework de Node.js
- **TypeORM** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **Multer** - Subida de archivos
- **UUID** - Generación de nombres únicos

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### 1. **Node.js** (v20 o superior)
```bash
node --version  # Debe ser v20.x.x o superior
```
**Descargar:** https://nodejs.org/

### 2. **npm** (viene con Node.js)
```bash
npm --version
```

### 3. **PostgreSQL** (v15 o superior)
```bash
psql --version
```
**Descargar:** https://www.postgresql.org/download/

### 4. **Git** (opcional, para clonar el repositorio)
```bash
git --version
```

---

## 🚀 Instalación Paso a Paso

### Paso 1: Clonar el Repositorio

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd GoogleKeepTeamBabilonicos
```

### Paso 2: Instalar Dependencias

El proyecto tiene un script que instala todas las dependencias automáticamente:

```bash
# Instala dependencias de backend y frontend
npm install
npm run install:all
```

**Si falla el script, instala manualmente:**

```bash
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

---

## 🗄️ Configuración de Base de Datos

### Opción 1: Usar PostgreSQL Existente

Si ya tienes PostgreSQL instalado:

#### 1. Crear la Base de Datos

Abre **pgAdmin** o usa la terminal:

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear usuario y base de datos
CREATE USER babilonicos WITH PASSWORD 'babilonicos123';
CREATE DATABASE "GoogleKeepTeamBabilonicos" OWNER babilonicos;
GRANT ALL PRIVILEGES ON DATABASE "GoogleKeepTeamBabilonicos" TO babilonicos;
\q
```

#### 2. Configurar Puerto (si es diferente)

Si tu PostgreSQL está en un puerto diferente al **8001**, edita:

**Archivo:** `backend/src/config/orm.config.ts`

```typescript
export default registerAs(
    'orm.config',
    (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: '127.0.0.1',
        port: 5432,  // ← Cambiar 8001 por 5432 (puerto default)
        username: 'babilonicos',
        password: 'babilonicos123',
        database: 'GoogleKeepTeamBabilonicos',
        entities: [Note, ChecklistItem, Label, NoteLabel, User, Collaborator],
        synchronize: true,
    }),
);
```

### Opción 2: Usar Docker (Recomendado)

Si prefieres usar Docker para la base de datos:

```bash
# Crear contenedor de PostgreSQL
docker run --name googlekeep-db \
  -e POSTGRES_USER=babilonicos \
  -e POSTGRES_PASSWORD=babilonicos123 \
  -e POSTGRES_DB=GoogleKeepTeamBabilonicos \
  -p 8001:5432 \
  -d postgres:15
```

---

## ▶️ Ejecutar el Proyecto

### Opción 1: Ejecutar Todo Junto (Recomendado)

```bash
# Desde la raíz del proyecto
npm run start:dev
```

Esto iniciará:
- **Backend** en http://localhost:3001
- **Frontend** en http://localhost:4200

### Opción 2: Ejecutar por Separado

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```
Backend corriendo en: http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run start
```
Frontend corriendo en: http://localhost:4200

### Abrir la Aplicación

Una vez ambos servicios estén corriendo, abre tu navegador en:

**http://localhost:4200**

---

## 📁 Estructura del Proyecto

```
GoogleKeepTeamBabilonicos/
├── backend/                      # Backend NestJS
│   ├── src/
│   │   ├── uploads/              # Carpeta de imágenes subidas
│   │   ├── auth/                 # Autenticación
│   │   ├── collaborator/         # Colaboradores
│   │   ├── config/               # Configuración (DB, etc.)
│   │   ├── label/                # Etiquetas
│   │   ├── note/                 # Notas y checklist
│   │   ├── note-label/           # Relación nota-etiqueta
│   │   ├── user/                 # Usuarios
│   │   ├── uploads/              # Subida de archivos
│   │   ├── app.module.ts
│   │   └── main.ts               # Punto de entrada
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                     # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   └── services/     # Servicios API
│   │   │   ├── shared/
│   │   │   │   ├── components/   # Componentes reutilizables
│   │   │   │   ├── models/       # Modelos de datos
│   │   │   │   └── pipes/        # Pipes de Angular
│   │   │   ├── app.ts            # Componente principal
│   │   │   └── app.html
│   │   ├── styles.scss           # Estilos globales
│   │   └── main.ts
│   ├── angular.json
│   └── package.json
│
├── API-ENDPOINTS.md              # Documentación de API
├── package.json                  # Scripts raíz
└── README.md                     # Este archivo
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3001/api/v1
```

### Principales Endpoints

#### Notas
```
POST   /api/v1/note/getall           # Obtener todas las notas
POST   /api/v1/note/getbyid/:id      # Obtener nota por ID
POST   /api/v1/note/getbyuser/:id    # Obtener notas por usuario
POST   /api/v1/note/save             # Crear nota
POST   /api/v1/note/update/:id       # Actualizar nota
POST   /api/v1/note/delete/:id       # Eliminar nota (soft delete)
POST   /api/v1/note/toggle-pin/:id   # Fijar/Desfijar nota
POST   /api/v1/note/archive/:id      # Archivar/Desarchivar
```

#### Checklist Items
```
POST   /api/v1/note/checklist/save          # Crear item
POST   /api/v1/note/checklist/update/:id    # Actualizar item
POST   /api/v1/note/checklist/toggle/:id    # Marcar/Desmarcar
DELETE /api/v1/note/checklist/delete/:id    # Eliminar item
```

#### Etiquetas
```
GET    /api/v1/label/getall             # Obtener todas
GET    /api/v1/label/getbyuser/:userId  # Por usuario
POST   /api/v1/label/save               # Crear etiqueta
POST   /api/v1/label/update/:id         # Actualizar
DELETE /api/v1/label/delete/:id         # Eliminar
```

#### Subida de Imágenes
```
POST   /api/v1/uploads/image            # Subir imagen
```
**Respuesta:**
```json
{
  "message": "Image uploaded successfully",
  "url": "http://localhost:3001/uploads/uuid-filename.jpg",
  "filename": "uuid-filename.jpg",
  "originalName": "mi-foto.jpg",
  "size": 123456
}
```

📄 **Documentación completa:** Ver `API-ENDPOINTS.md`

---

## ❓ Troubleshooting

### Problema: "Port 4200 is already in use"

**Solución:**
```bash
# Matar el proceso en el puerto 4200
npx kill-port 4200

# O usar un puerto diferente
cd frontend
ng serve --port 4300
```

### Problema: "Port 3001 is already in use"

**Solución:**
```bash
# Windows (PowerShell)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Problema: "Connection refused" o "ECONNREFUSED"

**Causa:** Backend no está corriendo.

**Solución:**
```bash
cd backend
npm run start:dev
```

### Problema: "password authentication failed for user"

**Causa:** Credenciales de PostgreSQL incorrectas.

**Solución:** Verifica las credenciales en `backend/src/config/orm.config.ts`:

```typescript
username: 'babilonicos',      // ← Tu usuario de PostgreSQL
password: 'babilonicos123',   // ← Tu contraseña
```

### Problema: Las imágenes no se muestran

**Causa:** Carpeta `uploads/` no existe o no tiene permisos.

**Solución:**
```bash
# Crear carpeta uploads
mkdir backend/uploads

# Dar permisos (Linux/Mac)
chmod 755 backend/uploads
```

### Problema: "Cannot find module" o módulos faltantes

**Solución:**
```bash
# Limpiar node_modules y reinstalar
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Problema: CORS errors

**Causa:** El frontend intenta conectar al backend incorrecto.

**Solución:** Verifica que el backend esté en `http://localhost:3001`

**Archivo:** `backend/src/main.ts`
```typescript
app.enableCors({
  origin: 'http://localhost:4200',  // ← Debe coincidir con el puerto del frontend
  credentials: true,
});
```

### Problema: Error NG0303 - "ngIf not recognized"

**Solución:** Asegúrate de importar `CommonModule` en los componentes de Angular.

```typescript
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, ...],
  ...
})
```

---

## 👥 Team Babilonicos

Este proyecto fue desarrollado como parte del curso **"Taller de Aplicaciones de Internet"** - 7mo Semestre.

---

## 📝 Licencia

Este proyecto es de uso educativo.

---

## 🤝 Contribuciones

Para contribuir a este proyecto:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📧 Contacto

Para preguntas o sugerencias, abre un **issue** en el repositorio.

---

**¡Disfruta usando Google Keep Clone! 🚀**
