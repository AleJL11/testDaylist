# Daylist - Bitácora diaria

## Descripción

Daylist es una aplicación web sencilla para registrar y listar las actividades diarias de desarrolladores.
Permite ingresar el nombre del desarrollador, la fecha, la actividad realizada y el tiempo invertido, guardando los registros en un backend y mostrando la información en tiempo real en el frontend sin recargar la página.

## Tecnologías utilizadas

- **Frontend**: Next.js (React)

- **Backend**: Node.js + Express

- **Almacenamiento**: Memoria en backend (array)

- **Comunicación**: API REST (fetch desde el frontend)

daylist/
 backend/           # Servidor Express
    server.js       # Endpoints GET y POST /api/daylists
 frontend/          # Cliente Next.js
    pages/
        index.js  # Interfaz del usuario y lógica de fetch

## Flujo de funcionamiento

1. El usuario completa el formulario con:
    - Nombre del desarrollador
    - Fecha
    - Actividad realizada
    - Tiempo invertido (horas)

2. Al enviar el formulario, la función handleSubmit del frontend:
    - Valida que todos los campos estén completos.
    - Convierte el tiempo invertido a número.
    - Envía un **POST** a http://localhost:4000/api/daylists con el JSON.

3. El backend recibe la petición:
    - Guarda el registro en memoria.
    - Devuelve un JSON con el registro creado (incluyendo un `id` único y `createdAt`).

4. El frontend:
    - Actualiza la lista de registros automáticamente con la nueva entrada.
    - Limpia el formulario para un nuevo registro.

> Todos los registros pueden consultarse en tiempo real usando un **GET** a `/api/daylists`.

## Endpoints disponibles

### GET /api/daylists

Retorna todos los registros existentes.

Respuesta:

```json
[
  {
    "id": "uuid",
    "name": "Juan",
    "date": "2025-11-24",
    "activity": "Programación",
    "hours": 3,
    "createdAt": "2025-11-24T16:00:42.340Z"
  }
]
```

#### POST /api/daylists

Recibe un objeto JSON con:
    - name (string)
    - date (YYYY-MM-DD)
    - activity (string)
    - hours (número)

> Responde con el registro creado, incluyendo id y createdAt.


## Notas finales

- La aplicación guarda los datos en memoria; si se reinicia el backend, los registros se pierden.
- La arquitectura separa claramente frontend y backend, usando fetch para la comunicación.
- Se aplicaron buenas prácticas como validación de formulario, manejo de errores y actualización automática de la interfaz.