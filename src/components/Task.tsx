import { ChangeEvent, FormEvent, useState } from "react";

interface FormData {
  taskName: string;
}

function Task() {
  const[formData, setFormData] = useState<FormData>({
    taskName: ''
  });

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
      const response = await fetch('http://localhost:8080/user/66337761a0ec5e1bd1e1b3cb/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        console.log('Task added ');
        
      } else {
        console.error('Registration failed');
        
      }
    } catch (error) {
      console.error('Error:', error);
      
    }
  };

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="taskName">Task</label>
          <input type="text"
          id="taskName"
          name="taskName"
          value={formData.taskName}
          onChange={handleChange}
          required
          />
        </div>
        <button type="submit">Add Task</button>
      </form>
    );
  }
  
  export default Task;
  
  