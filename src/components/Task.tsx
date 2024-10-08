import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface FormData {
  taskName: string;
  id: string;
  times: any[];
}

function Task() {
  const [tasks, setTasks] = useState<FormData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    taskName: "",
    id: "",
    times: [],
  });

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("auth_token");
  const url = localStorage.getItem("myUrl");
  useEffect(() => {
    fetchTasks();
  }, []);

  
  const fetchTasks = async () => {
    try {
      const response = await fetch(url + `/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Tasks fetched successfully:", data.tasks);

        setTasks(data.tasks);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(url + `/user/${userId}/task`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Task added");

        fetchTasks();
        setFormData({
          taskName: "",
          id: "",
          times: [],
        });
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteTask = (id: string) => {
    fetch(url + `/user/${userId}/task/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        fetchTasks();
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="taskName">Task</label>
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
        {tasks &&
          tasks.map((task: FormData) => (
            <div key={task.id}>
              <h3>{task.taskName}</h3>
              <button onClick={() => deleteTask(task.id)}>DELETE</button>
            </div>
          ))}
      </div>
    </>
  );
}

export default Task;
