# NeoBloom - Modern Blogging Platform

NeoBloom is a modern blogging platform built with Next.js, TypeScript, and Tailwind CSS for the frontend, and FastAPI with PostgreSQL for the backend.

## Features

- User authentication (register, login, logout)
- Create, edit, and delete blog posts
- Comment on posts
- Like posts
- Categories and tags for organizing content
- User dashboard for managing posts
- Responsive design with light theme
- SEO-friendly

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Context API for state management

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- Python (v3.9 or later)
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone https://github.com/arjit1804/neobloom.git
cd neobloom
```

2. Set up the backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend
```bash
cd frontend
npm install
```

4. Create a `.env` file in the config directory based on the `.env.example` template

5. Start the development servers
```bash
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev
```

## License

This project is licensed under the MIT License. 