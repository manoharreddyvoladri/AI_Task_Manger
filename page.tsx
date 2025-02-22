"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [newTask, setNewTask] = useState({ title: "", description: "" });
    const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
    const [chatInput, setChatInput] = useState("");

    // Fetch tasks on component mount and set up WebSocket for real-time updates
    useEffect(() => {
        fetchTasks();

        // WebSocket setup for real-time updates
        const socket = new WebSocket("ws://localhost:8080/ws");

        socket.onmessage = () => {
            fetchTasks();
        };

        return () => socket.close();
    }, []);

    // Fetch all tasks from the backend
    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks`);
            setTasks(response.data || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Create a new task
    const createTask = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks`, newTask);
            setNewTask({ title: "", description: "" });
            fetchTasks();
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    // Delete a task by ID
    const deleteTask = async (id: string) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Mark a task as done by ID
    const markAsDone = async (id: string) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/${id}`, { done: true });
            fetchTasks();
        } catch (error) {
            console.error("Error marking task as done:", error);
        }
    };

    // Get AI-powered task recommendations
    const getAiRecommendations = async () => {
        if (!chatInput.trim()) {
            alert("Please enter a query for AI recommendations.");
            return;
        }

        try {
            const response = await axios.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
                    process.env.NEXT_PUBLIC_GEMINI_API_KEY,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Suggest tasks related to: ${chatInput}`,
                                },
                            ],
                        },
                    ],
                }
            );

            // Extract suggestions from the response
            const suggestions = response.data.candidates[0].content.parts.map(
                (part: any) => part.text
            );
            setAiRecommendations(suggestions);
        } catch (error: any) {
            console.error(
                "Error fetching AI recommendations:",
                error.response?.data || error.message
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 text-white p-8">
            {/* Header */}
            <header className="text-center mb-12">
                <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Task Manager
                </h1>
                <p className="mt-2 text-lg text-gray-300">
                    Effortlessly manage your tasks with AI-powered recommendations.
                </p>
            </header>

            {/* Two-Panel Layout */}
            <div className="flex gap-8 max-w-7xl mx-auto">
                {/* Left Panel */}
                <div className="w-1/2 space-y-12">
                    {/* Task Creation Form */}
                    <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700">
                        <h2 className="text-2xl font-semibold mb-6 text-purple-300">Add New Task</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="w-full p-4 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                className="w-full p-4 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                            />
                            <button
                                onClick={createTask}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300"
                            >
                                Create Task
                            </button>
                        </div>
                    </div>

                    {/* AI-Powered Chat for Task Recommendations */}
                    <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700">
                        <h2 className="text-2xl font-semibold mb-6 text-purple-300">
                            AI-Powered Task Suggestions
                        </h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Ask AI for task ideas..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                className="w-full p-4 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                            />
                            <button
                                onClick={getAiRecommendations}
                                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 px-6 rounded-lg hover:from-green-600 hover:to-teal-600 transition duration-300"
                            >
                                Get AI Recommendations
                            </button>
                            <ul className="space-y-4 mt-4">
                                {aiRecommendations.length > 0 ? (
                                    aiRecommendations.map((suggestion, index) => (
                                        <li key={index} className="p-4 bg-gray-700 rounded-lg">
                                            <strong>{suggestion.split(":")[0]}:</strong> {suggestion.split(":")[1]}
                                            <button
                                                onClick={() =>
                                                    setNewTask({
                                                        title: suggestion.split(":")[0],
                                                        description: suggestion.split(":")[1],
                                                    })
                                                }
                                                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                            >
                                                Add to Tasks
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-400">No recommendations yet.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-1/2 space-y-12">
                    {/* Task List */}
                    <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-700">
                        <h2 className="text-2xl font-semibold mb-6 text-purple-300">Your Tasks</h2>
                        <ul className="space-y-4">
                            {tasks.length > 0 ? (
                                tasks.map((task: any) => (
                                    <li
                                        key={task._id}
                                        className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                                    >
                                        <div>
                                            <strong className="text-lg">{task.title}</strong>: {task.description}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => markAsDone(task._id)}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                                            >
                                                Done
                                            </button>
                                            <button
                                                onClick={() => deleteTask(task._id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-400">No tasks yet. Add one!</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-center mt-12 text-gray-400">
                <p>
                    Created by{" "}
                    <strong>Voladri Manohar Reddy</strong>. Source code available on{" "}
                    <a
                        href="https://github.com/manoharreddyvoladri/AI_Task_Manger"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-500 transition duration-300"
                    >
                        GitHub
                    </a>
                    .
                </p>
            </footer>
        </div>
    );
}