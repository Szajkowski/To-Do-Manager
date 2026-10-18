import { TasksContext } from '../context/TasksContext'
import { useContext } from 'react'

// hook zeby sie elegancko uzywalo tego, przez jedna zmienna, np dispatch
export const useTasksContext = () => {
  const context = useContext(TasksContext)
  return context
}