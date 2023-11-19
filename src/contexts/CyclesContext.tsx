import { ReactNode, createContext, useState, useReducer } from "react"
import {ActionTypes, Cycle, cyclesReducer} from '../reducers/cycles';

interface CreateCycleData {
  task: string
  minutesAmount: number
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
export function CyclesContextProvider({ children, }: CyclesContextProviderProps) {
  // States
  const [cyclesState, dispatch] = useReducer(cyclesReducer, { cycles: [], activeCycleId: null })
  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0); // Quantidade de segundos passados quando o ciclo foi criado
  const { cycles, activeCycleId } = cyclesState; // Destruturacao
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId); // Show the active cycle

  function markCurrentCycleAsFinished() {
    // Using Reducer
    dispatch({
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
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
      type: ActionTypes.ADD_NEW_CYCLE,
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
      type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
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