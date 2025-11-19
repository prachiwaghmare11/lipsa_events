# Copilot Instructions for Lipsa Events MERN App

## Project Overview
This is a MERN stack application for event management, split into two main folders:
- `frontend/`: React app (Create React App)
- `backend/`: Node.js/Express API with MongoDB

## Architecture & Data Flow
- **Frontend** communicates with the backend via REST API endpoints (e.g., `/api/bookings`, `/api/portfolio`, `/api/testimonials`).
- **Backend** exposes these endpoints and uses Mongoose models for data persistence. Some endpoints use placeholder data for demo purposes.
- **Booking submissions**: Frontend `ContactForm.js` posts to `/api/bookings` (see backend `Booking.js` schema).
- **Portfolio/Testimonials**: Fetched via GET requests; currently served from hardcoded arrays in `server.js`.

## Developer Workflows
- **Frontend**:
  - Start: `npm start` (runs on port 3000)
  - Test: `npm test`
  - Build: `npm run build`
- **Backend**:
  - Start: `npm start` (runs on port 5000)
  - Dev mode (auto-reload): `npm run dev` (uses nodemon)
- **Environment Variables**: Backend expects `.env` with `MONGODB_URI` and optionally `PORT`.

## Key Patterns & Conventions
- **API URLs**: Use absolute URLs (`http://localhost:5000/api/...`) for local dev in frontend fetch calls.
- **Frontend Components**: Located in `src/components/`, each major UI section is a separate file (e.g., `Hero.js`, `Portfolio.js`).
- **Backend Models**: All Mongoose schemas are in `backend/models/`.
- **Error Handling**: Backend returns JSON error messages with status codes; frontend displays user-friendly messages.
- **Data Validation**: Backend validates required fields for bookings; see `Booking.js` and POST handler in `server.js`.

## Integration Points
- **MongoDB**: Used for bookings (see `Booking.js`). Portfolio/testimonials are currently static.
- **CORS**: Enabled in backend for local frontend-backend communication.
- **Dotenv**: Used for environment config in backend.

## Examples
- **Booking POST**: See `ContactForm.js` (frontend) and `/api/bookings` route in `server.js` (backend).
- **Portfolio GET**: See `/api/portfolio` route in `server.js`.

## Tips for AI Agents
- Always check both frontend and backend for data flow changes.
- When adding new API endpoints, update both backend routes and frontend fetch logic.
- Use project-specific conventions for error messages and field validation.
- Reference key files for patterns: `ContactForm.js`, `server.js`, `Booking.js`.

---
For more details, see `frontend/README.md` and backend source files.
