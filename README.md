Here’s the updated `README.md` file with the video link and image included. I’ve added sections for the **screenshot** and **demo video** to make it visually appealing and informative.

---

# Task Manager with AI-Powered Recommendations

![Task Manager](https://img.shields.io/badge/Status-Active-green) ![License](https://img.shields.io/badge/License-MIT-blue)

A modern task management application built with **Next.js**, **Tailwind CSS**, and a **Go backend**. The app allows users to create, update, delete, and mark tasks as done, with real-time updates via WebSockets. Additionally, it integrates AI-powered task recommendations using Google's Gemini API.

---

## Table of Contents

1. [Features](#features)
2. [Screenshot](#screenshot)
3. [Demo Video](#demo-video)
4. [Tech Stack](#tech-stack)
5. [Installation](#installation)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)

---

## Features

- **Task Management**:
  - Create, read, update, and delete tasks.
  - Mark tasks as "done" with a single click.
- **Real-Time Updates**:
  - WebSocket integration ensures real-time synchronization of tasks across clients.
- **AI-Powered Recommendations**:
  - Get AI-generated task suggestions based on user input.
- **Responsive Design**:
  - Fully responsive UI powered by Tailwind CSS.
- **Authentication (Optional)**:
  - Built-in support for JWT-based authentication (can be extended).

---

## Screenshot

Here’s a preview of the Task Manager application:

![Task Manager Screenshot](https://github.com/user-attachments/assets/23fcd5e4-23c8-461d-92ac-6aa8a65486cc)

---

## Demo Video

Watch a demo of how the Task Manager application works:

[![Task Manager Demo](https://cdn.loom.com/sessions/thumbnails/2f235cb68eae487daab82c265869e7b9-with-play.gif)](https://www.loom.com/share/2f235cb68eae487daab82c265869e7b9?sid=81ba99aa-f8fa-4ef0-81dd-badacc7045a3)

---

## Tech Stack

### Frontend
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (`useState`, `useEffect`)
- **HTTP Requests**: Axios
- **WebSocket**: Real-time updates using WebSockets

### Backend
- **Language**: Go (Golang)
- **Framework**: Gin
- **Database**: MongoDB (with `ObjectID` support)
- **WebSocket**: Gorilla WebSocket
- **Environment Variables**: Managed via `.env`

### AI Integration
- **API**: Google Gemini Pro API for AI-powered task recommendations.

---

## Installation

### Prerequisites
- Node.js (v18 or higher)
- Go (v1.20 or higher)
- MongoDB Atlas account (or a local MongoDB instance)
- Google Gemini API key

### Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/manoharreddyvoladri/AI_Task_Manger.git
cd AI_Task_Manger
```

#### 2. Set Up Environment Variables
Create `.env` files for both frontend and backend:

**Backend (`.env`)**:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.kn641.mongodb.net/task_manager?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Frontend (`.env.local`)**:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

#### 3. Install Dependencies
**Frontend**:
```bash
cd frontend
npm install
```

**Backend**:
```bash
cd backend
go mod tidy
```

#### 4. Start the Servers
**Backend**:
```bash
cd backend
go run main.go
```

**Frontend**:
```bash
cd frontend
npm run dev
```

The app will be available at:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:8080](http://localhost:8080)

---

## Usage

1. **Create a Task**:
   - Enter a title and description in the "Add New Task" form and click "Create Task."

2. **Mark a Task as Done**:
   - Click the "Done" button next to any task to mark it as completed.

3. **Delete a Task**:
   - Click the "Delete" button to remove a task.

4. **AI-Powered Recommendations**:
   - Enter a query in the "Ask AI for task ideas..." input field and click "Get AI Recommendations."
   - Add suggested tasks directly to your task list.

5. **Real-Time Updates**:
   - Any changes made by one client will be reflected in real-time for all connected clients.

---

## API Endpoints

### Base URL: `http://localhost:8080`

| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | `/tasks`               | Fetch all tasks                      |
| POST   | `/tasks`               | Create a new task                    |
| DELETE | `/tasks/:id`           | Delete a task by ID                  |
| PUT    | `/tasks/:id`           | Update a task by ID                  |
| PUT    | `/tasks/:id/done`      | Mark a task as done by ID            |
| GET    | `/ws`                  | WebSocket endpoint for real-time updates |

---

## Deployment

### Frontend
Deploy the frontend to platforms like **Vercel** or **Netlify**:
1. Push your code to GitHub.
2. Connect your repository to Vercel or Netlify.
3. Add environment variables (`NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_GEMINI_API_KEY`) in the platform's dashboard.

### Backend
Deploy the backend to platforms like **Render**, **Heroku**, or **AWS**:
1. Containerize the backend using Docker (optional).
2. Deploy the containerized app to your preferred platform.
3. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`) in the platform's dashboard.

---

## Contributing

We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m "Add YourFeatureName"`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or feedback, feel free to reach out:
- **GitHub**: [@manoharreddyvoladri](https://github.com/manoharreddyvoladri)
- **Email**: [manoharreddy@example.com](mailto:manoharreddy@example.com)

---

Let me know if you need further adjustments!
