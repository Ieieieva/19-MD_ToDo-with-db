import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Task = {
  _id: string,
  title: String,
  content: String,
  date: Date,
  isDone: Boolean
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  
  console.log(title)

  useEffect(() => {
    axios.get<Task[]>('http://localhost:3004/todo').then(({ data }) => {
      console.log("data", data)
      setTasks(data)
    });
  }, [])

  const handleSubmit = () => {
    console.log({ title })
    const dataToSend = { title };
    mutate(dataToSend)
    window.location.reload();
    setTitle('')
  }

  const handleData = (data: any) => {
    return axios.post('http://localhost:3004/addtask', data)
  }

  const useHandleData = () => {
    const queryClient = useQueryClient()

    return useMutation(handleData, {
      onSuccess: () => {
        queryClient.invalidateQueries(['task'])
      }
    })
  }

  const { mutate } = useHandleData()

  const handleDeleteTask = (id: string) => {
    axios.delete(`http://localhost:3004/todo/${id}`).then(() => {
      const updateTasks = tasks.filter((task) => task._id !== id);
      setTasks(updateTasks);
    });
  };


  return (
    <div className="App">
      <h1>TO - DO list</h1>
      <form 
        className='main__form'
        onSubmit={(e) => {
          e.preventDefault()
        }}>
          <div className='main__input--form'>
            <label className='main__input--label'>
              Add new task: 
              <input 
                className='main__input'
                value={title} 
                onChange={e => setTitle(e.target.value)}
                type='text'>
              </input>
            </label>
            <button 
              className='button btn-add'
              onClick={handleSubmit}
              type='submit'>
                ADD
            </button>
          </div>
      </form>
      {tasks?.map((task) => {
        return (
          <div
            className='task-row' 
            key={task._id}
            >
            <div>{task.title}</div>
            <button
              onClick={() => handleDeleteTask(task._id)}
            >delete</button>
          </div>
        )
      })}
    </div>
  )
}

export default App
