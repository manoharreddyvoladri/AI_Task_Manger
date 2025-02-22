import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks`);
        setTasks(response.data);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Task Manager</h1>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id} className="mt-2">{task.title}</li>
                ))}
            </ul>
        </div>
    );
}