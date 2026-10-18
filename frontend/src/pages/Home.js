import { useEffect }from 'react'
import { useTasksContext } from "../hooks/useTasksContext"
import { useAuthContext } from "../hooks/useAuthContext"

// components
import TaskDetails from '../components/TaskDetails'
import TaskForm from '../components/TaskForm'

const Home = () => {
  const {tasks, dispatch} = useTasksContext()
  const {user} = useAuthContext()

  // funkcja uruchamia sie tylko raz, po wyrenderowaniu, ogarnia fetchowanie wszystkich taskow
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/tasks', { // nie trzeba podawac full adresu bo w proxy juz jest zawarty localhost:4000
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_TASKS', payload: json})
      }
    }
    if (user) {
      fetchTasks()
    }
  }, [dispatch, user])

  return (
    <div className="home">
      <div className="tasks">
        {/* smiszny sposob na sprawdzenie czy taski istnieja przez spojnik AND */}
        {tasks && tasks.map((task) => ( // taski sa pokazywane tutaj, lecimy z sfetchowanymi danymi do TaskDetails, reprezentujacego poszczegolny kafelek z taskiem
          <TaskDetails key={task._id} task={task} />
        ))}
      </div>
      <TaskForm />  {/* i tutaj lecimy do forma zeby byl ten ladny formularz obok */}
    </div>
  )
}

export default Home