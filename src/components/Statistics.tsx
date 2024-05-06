import React, { useEffect, useState } from "react";

interface TimeEntry {
  id: string;
  startTime: string; 
  endTime: string; 
  elapsedTime: number;
}

interface Task {
  id: string;
  taskName: string;
  times: TimeEntry[];
}

function Statistics() {
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

  const getTimeSpentPerWeek = () => {
    const timeSpentPerWeek: { [key: string]: { [key: string]: number } } = {}; 

    tasks.forEach(task => {
      timeSpentPerWeek[task.taskName] = {}; 
      task.times.forEach(timeEntry => {
        const startDate = new Date(timeEntry.startTime);
        const weekStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - startDate.getDay()); 
        const weekStartDateString = weekStart.toISOString().split('T')[0]; 

        if (!timeSpentPerWeek[task.taskName][weekStartDateString]) {
          timeSpentPerWeek[task.taskName][weekStartDateString] = 0;
        }
        timeSpentPerWeek[task.taskName][weekStartDateString] += timeEntry.elapsedTime;
      });
    });

    return timeSpentPerWeek;
  };

  return (
    <div>
      <h3>Time Spent Per Week on Different Tasks</h3>
      <ul>
        {Object.entries(getTimeSpentPerWeek()).map(([taskName, timeSpentPerWeek]) => (
          <li key={taskName}>
            <h4>{taskName}</h4>
            <ul>
              {Object.entries(timeSpentPerWeek).map(([weekStart, totalTime]) => (
                <li key={weekStart}>
                  Week of {weekStart}: {formatTime(totalTime)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Statistics;
