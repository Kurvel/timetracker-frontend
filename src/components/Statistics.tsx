import React, { useEffect, useState } from "react";

interface TimeEntry {
  id: string;
  startTime: any;
  endTime: any;
  elapsedTime: number;
}

interface Task {
  id: string;
  taskName: string;
  times: TimeEntry[];
}

function CombinedTime() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch('http://localhost:8080/user/66389228e21d830197c65b81')
      .then(res => res.json())
      .then(data => {
        if (data && data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks);
        } else {
          console.error("No tasks data found.");
        }
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
      });
  };

 
  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  
  const getTotalTimeSpent = () => {
    let totalTime = 0;
    tasks.forEach(task => {
      task.times.forEach(timeEntry => {
        totalTime += timeEntry.elapsedTime;
      });
    });
    return totalTime;
  };

  return (
    <div>
      <h3>Combined Time Spent</h3>
      <p>Total Time Spent: {formatTime(getTotalTimeSpent())}</p>
      <ul>
        {tasks.map((task: Task) => (
          <li key={task.id}>
            {task.taskName}: {formatTime(task.times.reduce((acc, timeEntry) => acc + timeEntry.elapsedTime, 0))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CombinedTime;
