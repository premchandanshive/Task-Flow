# TaskFlow – Personal Task Manager

## Stack
- Frontend: React, Vite, Tailwind CSS 4, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, HTTP-only cookies, bcryptjs

## Project structure

```text
taskflow-integrated/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── token.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── task.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   └── task.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── task.routes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── PublicRoute.jsx
    │   │   ├── TaskCard.jsx
    │   │   └── TaskForm.jsx
    │   ├── context/
    │   │   └── UserContext.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   └── SignUp.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Requirements
- Node.js 22 or newer recommended
- MongoDB local service or MongoDB Atlas connection string

## Setup

Start the backend:

```powershell
npm run dev
```

The API runs at `http://localhost:5000`.



Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Environment variables

`backend/.env`:

## API endpoints

### Authentication
- `POST /api/signup`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`

### Tasks (all require authentication)
- `POST /api/tasks`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `DELETE /api/tasks/:id`

Task queries always include the authenticated user's ID. The frontend never chooses the owner ID.
