import { useEffect, useState } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  login: string;
  tasks: Task[];
  role: string;
}

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

function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const token = localStorage.getItem("auth_token");
  const url = localStorage.getItem("myUrl");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(url + `/users`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Users fetched successfully:", data);

        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div>
      <h3>ADMIN</h3>
      {users.map((user) => (
        <div key={user.id}>
          <h4>{`${user.firstName} ${user.lastName}`}</h4>
          {user.tasks.map((task) => (
            <div key={task.id}>
              <h5>{task.taskName}</h5>
              <ul>
                {task.times.map((timeEntry) => (
                  <li key={timeEntry.id}>
                    {timeEntry.startTime} - {timeEntry.endTime} (
                    {formatTime(timeEntry.elapsedTime)})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Admin;
