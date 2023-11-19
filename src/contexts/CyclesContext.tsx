import { ReactNode, createContext, useState, useReducer } from "react"

interface CreateCycleData {
  task: string
  minutesAmount: number
}
interface Cycle {
  id: string,
  task: string,
  minutesAmount: number,
  startDate: Date, // data ou horario
  interruptedDate?: Date, // data opcional
  finishedDate?: Date,
}
interface CycleContextData {
  cycles: Cycle[]
  activeCycle: Cycle | undefined // quando nao tiver cycle ativo vai ser undefined
  activeCycleId: String | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void // funcao sem retorno
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}
// Criar Context (share values between components)
export const CyclesContext = createContext({} as CycleContextData) // export para o Countdown accesar o contexto

interface CyclesContextProviderProps {
  children: ReactNode // qualquer jsx valido
}
interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}
export function CyclesContextProvider({ children, }: CyclesContextProviderProps) {
  // States
  const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => {
    //console.log(state);
    //console.log(action);
    switch (action.type) {
      case 'ADD_NEW_CYCLE':
        return {
          ...state,
          cycles: [...state.cycles, action.payload.newCycle],
          activeCycleId: action.payload.newCycle.id,
        }
      case 'INTERRUPT_CURRENT_CYCLE':
        return {
          ...state,
          cycles: [
            state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, interruptedDate: new Date() }
              }
              else {
                return cycle
              }
            }),],
          activeCycleId: null,
        }
      case 'MARK_CURRENT_CYCLE_AS_FINISHED':
        return {
          ...state,
          cycles: [
            state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              }
              else {
                return cycle
              }
            }),],
          activeCycleId: null,
        }
      default:
        return state
    }
  }, { // initial values
    cycles: [],
    activeCycleId: null
  })
  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0); // Quantidade de segundos passados quando o ciclo foi criado
  const { cycles, activeCycleId } = cyclesState; // Destruturacao
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId); // Show the active cycle

  function markCurrentCycleAsFinished() {
    // Using Reducer
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    })
  }
  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }
  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()), // date to milliseconds (always different IDs)
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(), // data atual
    }
    // Using Reducer
    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })

    // setCycles((state) => [...state, newCycle]); // add new cycle to array
    setAmountSecondsPassed(0);

    //reset(); // clear and reset all inputs after form submitted (based on defaultValues)
  }
  function interruptCurrentCycle() {
    // Using Reducer
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    })
  }
  return (
    <CyclesContext.Provider value={
      {
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle
      }}>
      {children}
    </CyclesContext.Provider>
  )
}