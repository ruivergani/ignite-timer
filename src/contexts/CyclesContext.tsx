import { ReactNode, createContext, useState, useReducer, useEffect } from "react"
import { Cycle, cyclesReducer} from '../reducers/cycles/reducer';
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

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
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    { cycles: [], activeCycleId: null },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')
      if(storedStateAsJSON){
        return JSON.parse(storedStateAsJSON)
      }
      return initialState
    }
  ) // Reducer
  const { cycles, activeCycleId } = cyclesState; // Destruturacao
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId); // Show the active cycle

  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(() => {
    if(activeCycle){
      return  differenceInSeconds(new Date(), new Date(activeCycle.startDate),);
    }
    return 0
  }); // Quantidade de segundos passados quando o ciclo foi criado

  // Toda vez que o cyclesState modificar => salvar no localStorage
  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState]);

  function markCurrentCycleAsFinished() {
    // Using Reducer
    dispatch(markCurrentCycleAsFinishedAction())
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
    dispatch(addNewCycleAction(newCycle))

    // setCycles((state) => [...state, newCycle]); // add new cycle to array
    setAmountSecondsPassed(0);

    //reset(); // clear and reset all inputs after form submitted (based on defaultValues)
  }
  function interruptCurrentCycle() {
    // Using Reducer
    dispatch(interruptCurrentCycleAction())
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