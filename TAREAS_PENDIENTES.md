# ⚠️ TAREAS PENDIENTES - Google Keep Clone

Este documento lista todas las funcionalidades que **FALTAN IMPLEMENTAR** en el proyecto actual.

---

## 🔴 CRÍTICAS - Funcionalidades Principales

### 1. ❌ Subida de Imágenes (Backend)
**Estado:** Frontend implementado, backend falta conectar
- **Problema:** El endpoint `/api/v1/uploads/image` existe pero NO se llama al crear nota
- **Solución:** En `note-modal.component.ts`, método `onSave()`, subir la imagen ANTES de crear la nota
- **Ubicación:** `frontend/src/app/shared/components/note-modal/note-modal.component.ts:98`

### 2. ❌ Botón de Lista (Checklist) en Modal de Crear
**Estado:** El botón existe pero no funciona correctamente
- **Problema:** Al hacer clic en el ícono de checklist (☐), no muestra la lista de verificación
- **Solución:** El botón debe cambiar el modo del textarea a checklist y agregar el primer elemento automáticamente
- **Ubicación:** `frontend/src/app/shared/components/note-modal/note-modal.component.html`

### 3. ❌ Funcionalidad de Colaboradores
**Estado:** Solo frontend visual, sin backend
- **Falta:**
  - Backend: Implementar lógica para añadir colaboradores
  - Frontend: Modal para seleccionar usuarios y asignar permisos
  - Mostrar avatares de colaboradores en la nota
- **Referencia:** `API-ENDPOINTS.md` - Sección Collaborators

### 4. ❌ Funcionalidad de Recordatorios
**Estado:** Solo popup visual, sin funcionalidad real
- **Falta:**
  - Backend: Guardar `reminder_date` en la nota
  - Frontend: Date picker para seleccionar fecha y hora
  - Mostrar recordatorios en la vista "Recordatorios"
  - Notificaciones cuando llega el recordatorio
- **Ubicación:** `frontend/src/app/shared/components/note-modal/note-modal.component.ts:136`

---

## 🟡 IMPORTANTES - Experiencia de Usuario

### 5. ❌ Validación al Crear Nota
**Problema:** Se pueden crear notas vacías
- **Qué debe pasar:**
  - Si no hay título, contenido, ni checklist → NO crear nota, solo cerrar modal
  - Ya está implementado parcialmente en `onSave()` pero no funciona bien
- **Ubicación:** `frontend/src/app/shared/components/note-modal/note-modal.component.ts:75`

### 6. ❌ Elegir Tipo de Nota con Imagen
**Problema:** Cuando se sube una imagen, no se puede elegir entre texto o checklist
- **Qué falta:**
  - Después de subir imagen, permitir elegir entre:
    - Nota de texto normal
    - Nota con checklist
  - Mostrar ambos inputs (textarea O checklist) según selección
- **Ubicación:** `frontend/src/app/shared/components/note-modal/note-modal.component.html:32`

### 7. ❌ Asignar Etiquetas al Crear/Editar Nota
**Problema:** No se pueden seleccionar etiquetas en el modal
- **Qué falta:**
  - Botón o dropdown para mostrar lista de etiquetas disponibles
  - Checkbox o multi-select para elegir etiquetas
  - Mostrar etiquetas seleccionadas en la nota
  - Guardar relación nota-etiqueta en backend
- **Ubicación:** `frontend/src/app/shared/components/note-modal/note-modal.component.html`

### 8. ❌ Editar Nota Existente
**Problema:** Al hacer clic en una nota creada, no se abre para editar
- **Qué falta:**
  - Click en nota debe abrir modal con datos cargados
  - Botón "Listo" debe guardar cambios (no crear nueva nota)
  - Diferenciar entre "Crear" y "Editar"
- **Ubicación:** `frontend/src/app/shared/components/note-card/note-card.component.ts`

---

## 🟠 MEDIO - Botones y Acciones en Nota Creada

### 9. ❌ Botones en Tarjeta de Nota
**Problema:** Los botones de la nota (recordatorio, colaborar, color, imagen, checklist, más) no hacen nada
- **Qué falta:**
  - Botón de campana (recordatorio) → Abrir modal de recordatorio
  - Botón de usuario+ (colaborar) → Abrir modal de colaboradores
  - Botón de paleta (color) → Abrir selector de color
  - Botón de imagen → Subir imagen
  - Botón de checklist → Convertir a checklist
  - Botón de 3 puntos (⋮) → Menú con más opciones (archivar, eliminar)
- **Ubicación:** `frontend/src/app/shared/components/note-card/note-card.component.html:76`

---

## 🔵 LOW - Autenticación y Usuarios

### 10. ❌ Login y Registro
**Estado:** Backend existe, frontend no implementado
- **Falta:**
  - Pantalla de Login
  - Pantalla de Registro
  - Botón Login/Registro en el header
  - Guardar token en localStorage
  - Rutas protegidas (guards)
- **Ubicación:** `frontend/src/app/shared/components/topbar/` debe tener botones de login

---

## 🐛 BUGS CONOCIDOS

### 11. 🐛 Sidebar: Sección Etiquetas Oculta
**Severidad:** ALTA
**Problema:** Las etiquetas solo aparecen después de hacer clic en "Notas" o "Recordatorios"
- **Comportamiento actual:**
  - Al cargar la página, las etiquetas NO se ven
  - Al hacer clic en "Notas", aparecen las etiquetas
- **Comportamiento esperado:**
  - Las etiquetas deben verse INMEDIATAMENTE al cargar la página
- **Causa:** Probablemente un problema con `ngIf` o carga asíncrona de labels
- **Ubicación:** `frontend/src/app/shared/components/sidebar/sidebar.component.html:17`

---

## 📋 ORDEN RECOMENDADO DE IMPLEMENTACIÓN

### Prioridad 1 - Funcionalidad Básica
1. ✅ Arreglar bug de etiquetas en sidebar
2. ✅ Validación de notas vacías
3. ✅ Botón de checklist funcional en modal crear
4. ✅ Editar notas existentes

### Prioridad 2 - Imágenes
5. ✅ Conectar subida de imagen con backend
6. ✅ Elegir tipo de nota (texto/checklist) con imagen

### Prioridad 3 - Etiquetas
7. ✅ Seleccionar etiquetas al crear/editar nota
8. ✅ Mostrar etiquetas en la tarjeta de nota

### Prioridad 4 - Botones de Nota
9. ✅ Funcionalidad completa de botones en nota creada
10. ✅ Menú de 3 puntos con opciones

### Prioridad 5 - Características Avanzadas
11. ✅ Colaboradores completos
12. ✅ Recordatorios completos
13. ✅ Login y registro

---

## 💡 NOTAS IMPORTANTES

### Sobre el Backend
- Todos los endpoints YA ESTÁN CREADOS (ver `API-ENDPOINTS.md`)
- Lo que falta es principalmente **FRONTEND** y **conexión frontend-backend**

### Sobre la Base de Datos
- PostgreSQL configurado en puerto **8001** (o 5432 default)
- Credenciales: usuario `babilonicos`, password `babilonicos123`
- Base de datos: `GoogleKeepTeamBabilonicos`
- TypeORM con `synchronize: true` crea tablas automáticamente

### Sobre las Imágenes
- Las imágenes se guardan en: `backend/uploads/`
- Endpoint: `POST /api/v1/uploads/image`
- Respuesta incluye URL para usar en `note.image_url`
- Límite: 5MB por imagen

### Sobre los Colores
- 11 colores disponibles ya implementados
- Se guardan como string: `'red'`, `'blue'`, `'yellow'`, etc.
- Funciona correctamente, NO tocar

---

## 🔗 ARCHIVOS CLAVE PARA MODIFICAR

### Frontend
- **Modal crear nota:** `frontend/src/app/shared/components/note-modal/`
  - `note-modal.component.ts` - Lógica del modal
  - `note-modal.component.html` - HTML del modal
  - `note-modal.component.scss` - Estilos del modal

- **Tarjeta de nota:** `frontend/src/app/shared/components/note-card/`
  - `note-card.component.ts` - Lógica de la tarjeta
  - `note-card.component.html` - HTML de la tarjeta

- **Sidebar:** `frontend/src/app/shared/components/sidebar/`
  - `sidebar.component.ts` - Lógica del sidebar
  - `sidebar.component.html` - HTML del sidebar (BUG de etiquetas aquí)

- **Topbar:** `frontend/src/app/shared/components/topbar/`
  - `topbar.component.html` - Agregar botones Login/Registro aquí

- **Servicios:** `frontend/src/app/core/services/`
  - `note.service.ts` - Servicio de notas
  - `label.service.ts` - Servicio de etiquetas
  - `collaborator.service.ts` - Servicio de colaboradores

### Backend
- ** uploads:** `backend/src/uploads/` - Subida de imágenes (YA IMPLEMENTADO)
- **Notas:** `backend/src/note/` - CRUD de notas
- **Etiquetas:** `backend/src/label/` - CRUD de etiquetas
- **Colaboradores:** `backend/src/collaborator/` - CRUD de colaboradores

---

## 📞 DUDAS O PROBLEMAS

Si encuentras algún problema:
1. Revisa el `README.md` - tiene sección de Troubleshooting
2. Revisa `API-ENDPOINTS.md` - documentación completa de la API
3. Abre un **issue** en GitHub

---

**Última actualización:** Abril 24, 2026
**Estado del proyecto:** 60% completado
