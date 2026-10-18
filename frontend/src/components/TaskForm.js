import { useState } from "react"
import { useTasksContext } from "../hooks/useTasksContext"
import { useAuthContext } from '../hooks/useAuthContext'

const TaskForm = () => {
  const { dispatch } = useTasksContext() // ladnie uzywany tasksContext
  const { user } = useAuthContext()

  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [desc, setDesc] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault() // defaultowa akcja to oswiezenie strony, a my tego nie chcemy

    if (!user) {
      setError('You must be logged in')
      return
    }

    const task = {title, deadline, desc}

    const response = await fetch('/tasks', { // wyslanie taska w jego stringify formie, a wiec mamy JSONowego stringa
      method: 'POST',
      body: JSON.stringify(task),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json() // oczekujemy na zwracanego jsona, ktory nam daje funkcja w kontrolerze taskow

    if (!response.ok) {
      setError(json.error + json.emptyFields) // wartosc error wystepuje tylko gdy response nie jest ok
      setEmptyFields(json.emptyFields)
    }
    if (response.ok) { // jesli wszystko jest git to usuwamy wprowadzone dane, zeby nie zasmiecaly
      setTitle('')
      setDeadline('')
      setDesc('')
      setError(null)
      setEmptyFields([])
      dispatch({type: 'CREATE_TASK', payload: json})  // dispatch wywoluje reducera w odpowiednim kontekscie, czyli tutaj TasksContext, ktory aktualizuje aktualnie pokazywane taski
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Dodaj zadanie:</h3>

      <label>Nazwa:</label>
      <input 
        required
        type="text"
        onChange={(e) => setTitle(e.target.value)} // e.target czyli target zdarzenia (ewentu), ktory sie dzieje, w tym wypadku input z nazwa
        value={title}
        className={emptyFields.includes('nazwa') ? 'error' : ''}
      />

      <label>Opis:</label>
      <textarea 
        required
        rows="8"
        cols="45"
        onChange={(e) => setDesc(e.target.value)}
        value={desc}
        className={emptyFields.includes('opis') ? 'error' : ''}
      />

      <label>Termin:</label>
      <input 
        required
        type="date"
        onChange={(e) => setDeadline(e.target.value)}
        value={deadline}
        className={emptyFields.includes('termin') ? 'error' : ''}
      />

      <button>Dodaj</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default TaskForm