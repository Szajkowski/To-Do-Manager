import { createContext, useReducer } from 'react'

export const TasksContext = createContext()

// payload jest ladunkiem przekazywanym do reducera, w przypadku tej aplikacji bedzie to lista taskow
// state jest stanem przetrzymywanym w konteksie zanim ulegl on zmianie
// action przetrzymuje type oraz payload czyli rzeczy wyslane przez dispatch
export const tasksReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS': 
    // return zwraca to jaki chcielibysmy zeby nowy state byl, czyli w tym wypadku po prostu ustalamy taski na takie jakie byly w paylodzie
    // to sie dzieje na poczatku ladowania strony
      return {
        tasks: action.payload
      }
      // tutaj dodajemy sobie kolejny task do taskow (action.payload) bo tam jest tylko jeden + "rozpraszamy" taski przetrzymywane w starym state aby no ich nie usuwac
    case 'CREATE_TASK':
      return {
        tasks: [action.payload, ...state.tasks]
      }
      // bierzemy stary staty i wywalamy z niego przekazany payload po id
    case 'DELETE_TASK':
      return {
        tasks: state.tasks.filter((w) => w._id !== action.payload._id)
      }
    default:
      return state
  }
}

export const TasksContextProvider = ({ children }) => { // children oznacza w tym wypadku komponenty, ktore zostaly tym owiniete, czyli tutaj to bedzie App
  // dziala podobnie jak state przy normalnych zmiennych, nawet ma default value tasks: null. Dispatch natomiast jest komunikatem zawierajacym co zrobic z danymi + same dane
  const [state, dispatch] = useReducer(tasksReducer, { 
    tasks: null
  })

  return (
    // tutaj tak jakby mechanicznie jest to robione, tzn provider wrapuje appa, co sprowadza sie do tego ze wrapuje wszystko w srodku + mamy tu zmienne 
    // state i dispatch do przetrzymywania aktualnego stanu i uzywania dispatcha w celu przekazywania rzeczy
    <TasksContext.Provider value={{...state, dispatch}}> 
      { children }
    </TasksContext.Provider>
  )
}