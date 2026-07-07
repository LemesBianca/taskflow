# TaskFlow

TaskFlow is a full-stack Kanban application inspired by tools like Jira and Trello. It was built as a personal project to practice modern web development, focusing on scalable architecture, clean code, and user experience.

## Features

- Kanban board with drag-and-drop
- Project management
- Task creation and editing
- Task priorities
- Persistent database storage
- Responsive interface
- Modern UI built with Tailwind CSS

## Tech Stack

### Frontend

- React
- Next.js
- TypeScript
- Tailwind CSS

### Backend

- Next.js API Routes
- Prisma ORM
- PostgreSQL

### Tools

- Git
- GitHub

## Project Structure

```
src/
 ├── app/
 ├── components/
 ├── hooks/
 ├── lib/
 ├── services/
 ├── types/
 └── utils/
```

## Goals

This project was created to improve my skills in:

- Full-stack development
- Component architecture
- REST API development
- Database modeling
- State management
- Clean UI design
- Building production-like applications

## Future Improvements

- User authentication
- Team collaboration
- Comments
- Labels
- Due dates
- File attachments
- Notifications
- Activity history
- Dashboard
- Search and filters
- Vercel deploy

## Running Locally

Clone the repository

```bash
git clone https://github.com/LemesBianca/taskflow.git
```

Install dependencies

```bash
npm install
```

Configure your environment variables

```env
DATABASE_URL=...
```

Run migrations

```bash
npx prisma migrate dev
```

Start the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

## Author

Bianca Lemes

Portfolio:
https://portfolio-six-psi-h81ubitqb7.vercel.app

LinkedIn:
https://linkedin.com/in/bianca-lemess
