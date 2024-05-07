import React, { useEffect, useState } from "react";

interface Task {
  id: string;
  taskName: string;
  times: number[]; 
  startTime?: number; 
}

function Time() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formData, setFormData] = useState<{ taskName: string }>({
    taskName: '',
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch('http://localhost:8080/user/66389228e21d830197c65b81')
      .then(res => res.json())
      .then(data => setTasks(data.tasks.map((task: Task) => ({ ...task, times: [] }))));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      taskName: formData.taskName,
      times: [] 
    };

    try {
      const response = await fetch('http://localhost:8080/user/66389228e21d830197c65b81/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
      });
      if (response.ok) {
        setTasks(prevTasks => [...prevTasks, newTask]);
        setFormData({ taskName: '' });
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const startTimer = (taskId: string) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, startTime: Date.now() };
      }
      return task;
    }));
  };

  const stopTimer = async (taskId: string) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate || !taskToUpdate.startTime) return;
  
    const elapsedTime = Date.now() - taskToUpdate.startTime;
  
    try {
      const startTimeWithTimezone = new Date(taskToUpdate.startTime).toISOString(); 
  
      const response = await fetch(`http://localhost:8080/user/66389228e21d830197c65b81/task/${taskId}/time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startTime: startTimeWithTimezone, elapsedTime }) 
      });
      if (response.ok) {
        
        const updatedTask = {
          ...taskToUpdate,
          times: [...taskToUpdate.times, elapsedTime], 
          startTime: undefined 
        };
        setTasks(prevTasks =>
          prevTasks.map(task => (task.id === taskId ? updatedTask : task))
        );
      } else {
        console.error('Failed to update time spent for task');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  const ElapsedTimeCounter: React.FC<{ startTime: number }> = ({ startTime }) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);

      return () => clearInterval(interval);
    }, [startTime]);

    const formatTime = (milliseconds: number) => {
      const hours = Math.floor(milliseconds / (1000 * 60 * 60));
      const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
      return `${hours}h ${minutes}m ${seconds}s`;
    };

    return <span>{formatTime(elapsedTime)}</span>;
  };

  return (
    <div>
      <h3>Time Tracker</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="taskName">Task Name:</label>
          <input
            type="text"
            id="taskName"
            name="taskName"
            value={formData.taskName}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Task</button>
      </form>
      <div>
        {tasks.map((task: Task) => (
          <div key={task.id}>
            <p>{task.taskName}</p>
            <p>Times: {task.times.join(', ')}</p>
            {task.startTime && <ElapsedTimeCounter startTime={task.startTime} />}
            <button onClick={() => startTimer(task.id)}>Start Timer</button>
            <button onClick={() => stopTimer(task.id)}>Stop Timer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Time;
