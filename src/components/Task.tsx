import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface FormData {
  taskName: string;
  id: string;
  times: any[];
}

function Task() {
  const [tasks, setTasks] = useState<FormData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    taskName: '',
    id: '',
    times: []
  });

  useEffect(() => {
    fetchTasks(); 
  }, []);

  const fetchTasks = () => {
    fetch('http://localhost:8080/user/66389228e21d830197c65b81')
      .then(res => res.json())
      .then(data => setTasks(data.tasks));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/user/66389228e21d830197c65b81/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        console.log('Task added');
        
        fetchTasks();
      } else {
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteTask = (id: string) => {
    fetch(`http://localhost:8080/user/66389228e21d830197c65b81/task/${id}`, {
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      
      fetchTasks();
    }
    )
  }

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
        {tasks && tasks.map((task: FormData) => (
          <div key={task.id}>
            
            <p>{task.taskName}</p>
            <button onClick={() => deleteTask(task.id)}>DELETE</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Task;
