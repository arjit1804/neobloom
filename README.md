# NeoBloom - AI-Powered Futuristic Blogging Platform

NeoBloom is a fully automated, AI-powered blogging platform with a futuristic cyberpunk aesthetic. It features automated blog post generation, trend analysis, SEO optimization, and a dark, neon-accented UI.

## Features

- **AI-Powered Content Generation**: Automatically generate blog posts based on trending topics
- **Trend Analysis**: Analyze trending topics from Reddit, Twitter, and Google Trends
- **SEO Optimization**: Automatically optimize content for search engines
- **User Authentication**: Secure user authentication and authorization
- **Content Management**: Create, edit, and delete blog posts, categories, and tags
- **Comments System**: Interactive commenting system with moderation
- **Responsive Design**: Fully responsive design with a futuristic cyberpunk aesthetic

## Tech Stack

### Backend
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy ORM
- Pydantic
- JWT Authentication
- OpenAI API
- Reddit API
- Twitter API

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- SWR for data fetching
- Zustand for state management

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/neobloom.git
cd neobloom
```

### 2. Set up the backend

```bash
# Navigate to the backend directory
cd blogging/backend

# Run the setup script
./scripts/run.sh
```

This script will:
- Create a virtual environment
- Install the required dependencies
- Set up the database
- Start the FastAPI server

The backend server will be available at http://localhost:8000.

### 3. Set up the frontend

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend server will be available at http://localhost:3000.

## Running Locally

### Starting the Backend Server

To start the backend server manually:

```bash
cd blogging/backend
bash scripts/run.sh
```

You can verify the backend is running by accessing the health check endpoint:
```bash
curl http://localhost:8000/health
```

You should receive a response like:
```json
{"status":"healthy","api_version":"1.0.0","environment":"development"}
```

### Starting the Frontend Server

To start the frontend server manually:

```bash
cd blogging/frontend
npm run dev
```

### Common Issues and Troubleshooting

#### Network Error When Logging In
If you encounter a network error when trying to log in, it's likely that the backend server is not running. Make sure to start the backend server first before using the frontend application.

#### Database Connection Issues
If the backend fails to start due to database connection issues, make sure PostgreSQL is running and the connection details in the `.env` file are correct.

#### Port Conflicts
If either the frontend or backend fails to start due to port conflicts, you can modify the ports:

- For the backend: Edit the command in `scripts/run.sh` to use a different port (e.g., `--port 8001`)
- For the frontend: Add a `-p` flag to the npm command (e.g., `npm run dev -- -p 3001`)

## Environment Variables

### Backend

Create a `.env` file in the `blogging/config` directory with the following variables:

```
# Environment
ENVIRONMENT=development

# API settings
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database settings
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/neobloom

# CORS settings
BACKEND_CORS_ORIGINS=["http://localhost:3000"]

# OpenAI settings
OPENAI_API_KEY=your_openai_api_key_here

# Reddit settings
REDDIT_CLIENT_ID=your_reddit_client_id_here
REDDIT_CLIENT_SECRET=your_reddit_client_secret_here
REDDIT_USER_AGENT=neobloom/1.0
REDDIT_USERNAME=your_reddit_username_here
REDDIT_PASSWORD=your_reddit_password_here

# Twitter settings
TWITTER_API_KEY=your_twitter_api_key_here
TWITTER_API_SECRET=your_twitter_api_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret_here
```

### Frontend

Create a `.env.local` file in the `blogging/frontend` directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## API Documentation

Once the backend server is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

This project is licensed under the MIT License - see the LICENSE file for details. 