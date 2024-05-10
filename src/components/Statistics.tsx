import { useEffect, useState } from "react";

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
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('auth_token');
  const url = localStorage.getItem('myUrl');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
  try {
    const response = await fetch(url +`/user/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Tasks fetched successfully:', data.tasks);
      // Handle the fetched tasks here
      setTasks(data.tasks);
    } else {
      console.error('Failed to fetch tasks');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const handleDeleteTime = (taskId: string, timeId: string) => {
    fetch(url +`/user/${userId}/task/${taskId}/time/${timeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json' }
    })
      .then(response => {
        if (response.ok) {
          
          setTasks(prevTasks =>
            prevTasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    times: task.times.filter(timeEntry => timeEntry.id !== timeId)
                  }
                : task
            )
          );
        } else {
          console.error('Failed to delete time entry');
        }
      })
      .catch(error => {
        console.error('Error deleting time entry:', error);
      });
  };

  const getTimeSpentPerWeek = () => {
    const timeSpentPerWeek: { [key: string]: { [key: string]: number } } = {}; 

    tasks.forEach(task => {
      timeSpentPerWeek[task.taskName] = {}; 
      task.times.forEach(timeEntry => {
        const startDate = new Date(timeEntry.startTime);
        const weekNumber = getWeekNumber(startDate);
        const weekStartString = `Week ${weekNumber}`;
        
        if (!timeSpentPerWeek[task.taskName][weekStartString]) {
          timeSpentPerWeek[task.taskName][weekStartString] = 0;
        }
        timeSpentPerWeek[task.taskName][weekStartString] += timeEntry.elapsedTime;
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
                  {weekStart}: {formatTime(totalTime)}
                </li>
              ))}
            </ul>
            <ul>
              {tasks.map(task => (
                task.taskName === taskName &&
                task.times.map(timeEntry => (
                  <li key={timeEntry.id}>
                    {timeEntry.startTime} - {timeEntry.endTime} ({formatTime(timeEntry.elapsedTime)})
                    <button onClick={() => handleDeleteTime(task.id, timeEntry.id)}>Delete Time</button>
                  </li>
                ))
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Statistics;
