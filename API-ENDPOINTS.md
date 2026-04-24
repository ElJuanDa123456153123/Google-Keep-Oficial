# Google Keep Team Babilonicos - API Endpoints

Base URL: `http://localhost:3000/api/v1`

## 📝 NOTES (Notas)

### Obtener todas las notas
```
POST /api/v1/note/getall
```

### Obtener una nota por ID
```
POST /api/v1/note/getbyid/:id
```

### Obtener notas por usuario
```
POST /api/v1/note/getbyuser/:userId
```

### Crear nueva nota
```
POST /api/v1/note/save
Body: {
  title?: string,
  content?: string,
  color?: string,
  is_pinned?: boolean,
  image_url?: string,
  reminder_date?: Date,
  is_archived?: boolean,
  user_id?: number
}
```

### Actualizar nota
```
POST /api/v1/note/update/:id
Body: {
  title?: string,
  content?: string,
  color?: string,
  is_pinned?: boolean,
  image_url?: string,
  reminder_date?: Date,
  is_archived?: boolean
}
```

### Eliminar nota (soft delete)
```
POST /api/v1/note/delete/:id
```

### Fijar/Desfijar nota
```
POST /api/v1/note/toggle-pin/:id
```

### Archivar/Desarchivar nota
```
POST /api/v1/note/archive/:id
```

---

## ✅ CHECKLIST ITEMS (Items de lista)

### Obtener items de una nota
```
GET /api/v1/checklist-item/by-note/:noteId
```

### Crear item
```
POST /api/v1/checklist-item/save
Body: {
  note_id: number,
  content: string,
  is_checked?: boolean,
  position?: number
}
```

### Actualizar item
```
POST /api/v1/checklist-item/update/:id
Body: {
  content?: string,
  is_checked?: boolean,
  position?: number
}
```

### Marcar/Desmarcar item
```
POST /api/v1/checklist-item/toggle-check/:id
```

### Eliminar item
```
DELETE /api/v1/checklist-item/delete/:id
```

### Eliminar todos los items de una nota
```
DELETE /api/v1/checklist-item/delete-by-note/:noteId
```

---

## 🏷️ LABELS (Etiquetas)

### Obtener todas las etiquetas
```
GET /api/v1/label/getall
```

### Obtener etiqueta por ID
```
GET /api/v1/label/getbyid/:id
```

### Obtener etiquetas por usuario
```
GET /api/v1/label/getbyuser/:userId
```

### Obtener etiquetas de una nota
```
GET /api/v1/label/by-note/:noteId
```

### Crear etiqueta
```
POST /api/v1/label/save
Body: {
  name: string,
  user_id?: number
}
```

### Actualizar etiqueta
```
POST /api/v1/label/update/:id
Body: {
  name?: string,
  user_id?: number
}
```

### Añadir etiqueta a nota
```
POST /api/v1/label/add-to-note
Body: {
  note_id: number,
  label_id: number
}
```

### Remover etiqueta de nota
```
DELETE /api/v1/label/remove-from-note/:noteId/:labelId
```

### Eliminar etiqueta
```
DELETE /api/v1/label/delete/:id
```

---

## 👥 USERS (Usuarios)

### Obtener todos los usuarios
```
GET /api/v1/user/getall
```

### Obtener usuario por ID
```
GET /api/v1/user/getbyid/:id
```

### Obtener usuario por email
```
GET /api/v1/user/by-email/:email
```

### Registrar usuario
```
POST /api/v1/user/register
Body: {
  email: string,
  password: string,
  name?: string,
  avatar_url?: string
}
```

### Login
```
POST /api/v1/user/login
Body: {
  email: string,
  password: string
}
```

### Actualizar usuario
```
PUT /api/v1/user/update/:id
Body: {
  name?: string,
  avatar_url?: string
}
```

### Eliminar usuario
```
DELETE /api/v1/user/delete/:id
```

---

## 🤝 COLLABORATORS (Colaboradores)

### Obtener colaboradores de una nota
```
GET /api/v1/collaborator/by-note/:noteId
```

### Obtener notas compartidas con usuario
```
GET /api/v1/collaborator/by-user/:userId
```

### Añadir colaborador
```
POST /api/v1/collaborator/add
Body: {
  note_id: number,
  user_id: number,
  permission: 'edit' | 'view'
}
```

### Actualizar permisos
```
PUT /api/v1/collaborator/update-permission/:id
Body: {
  permission: 'edit' | 'view'
}
```

### Remover colaborador
```
DELETE /api/v1/collaborator/remove/:noteId/:userId
```

### Eliminar colaborador
```
DELETE /api/v1/collaborator/delete/:id
```

---

## 🎨 COLORES DISPONIBLES

Los colores se representan como strings:
- `"default"` - Blanco (sin color)
- `"red"` - Rojo/Tomate
- `"orange"` - Naranja
- `"yellow"` - Amarillo
- `"green"` - Verde salvia
- `"teal"` - Turquesa
- `"blue"` - Azul claro
- `"dark-blue"` - Azul índigo
- `"purple"` - Lavanda
- `"pink"` - Rosa
- `"gray"` - Gris

## 📊 RESPUESTAS TÍPICAS

### Success Response
```json
{
  "id": 1,
  "title": "Mi nota",
  "content": "Contenido de la nota",
  "color": "yellow",
  "is_pinned": false,
  "is_archived": false,
  "created_at": "2026-04-24T10:00:00.000Z",
  "updated_at": "2026-04-24T10:00:00.000Z"
}
```

### Error Response
```json
{
  "statusCode": 404,
  "message": "Note not found",
  "error": "Not Found"
}
```

---

**Última actualización:** Abril 24, 2026
