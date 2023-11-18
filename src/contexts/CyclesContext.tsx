import { ReactNode, createContext, useState } from "react"

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
export function CyclesContextProvider({children, } : CyclesContextProviderProps){
    // States
    const [cycles, setCycles] = useState<Cycle[]>([]); // array of Cycle
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null); // cycle active or not
    // Quantidade de segundos passados quando o ciclo foi criado
    const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0);

    // Show the active cycle
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    function markCurrentCycleAsFinished() {
      setCycles((state) =>
        state.map((cycle) => {
          if (cycle.id === activeCycleId) {
            return { ...cycle, finishedDate: new Date() }
          }
          else {
            return cycle
          }
        }),
      )
    }
    function setSecondsPassed(seconds: number){
      setAmountSecondsPassed(seconds)
    }
    function createNewCycle(data: CreateCycleData) {
      const newCycle: Cycle = {
        id: String(new Date().getTime()), // date to milliseconds (always different IDs)
        task: data.task,
        minutesAmount: data.minutesAmount,
        startDate: new Date(), // data atual
      }
  
      setCycles((state) => [...state, newCycle]); // add new cycle to array
      setActiveCycleId(newCycle.id); // set ID of active cycle
      setAmountSecondsPassed(0);
  
      //reset(); // clear and reset all inputs after form submitted (based on defaultValues)
    }
    function interruptCurrentCycle() {
      // Anotar dentro do ciclo se ele foi interrompido ou nao
      setCycles((state) =>
        state.map((cycle) => {
          if (cycle.id === activeCycleId) {
            return { ...cycle, interruptedDate: new Date() }
          }
          else {
            return cycle
          }
        }),
      )
      setActiveCycleId(null) // reset activeCycle
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