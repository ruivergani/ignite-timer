import { HandPalm, Play } from "phosphor-react";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton
}
  from "./styles";

import { createContext, useState } from "react";

import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { zodResolver } from "@hookform/resolvers/zod"; // integrate with ZOD
import { FormProvider, useForm } from "react-hook-form";
import * as zod from 'zod';

interface Cycle {
  id: string,
  task: string,
  minutesAmount: number,
  startDate: Date, // data ou horario
  interruptedDate?: Date, // data opcional
  finishedDate?: Date,
}
interface CycleContextData {
  activeCycle: Cycle | undefined // quando nao tiver cycle ativo vai ser undefined
  activeCycleId: String | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void // funcao sem retorno
  setSecondsPassed: (seconds: number) => void
}
// Criar Context (share values between components)
export const CyclesContext = createContext({} as CycleContextData) // export para o Countdown accesar o contexto

// Zod Schema
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Write Your Task'), // string, min 1 char, message: Write Your Task
  minutesAmount: zod.number().min(5).max(60),
})
// Type useForm
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema> // Same as creating Interface => infer from the zod schema automatically the types (extract inferred type)

export function Home() {
  // States
  const [cycles, setCycles] = useState<Cycle[]>([]); // array of Cycle
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null); // cycle active or not
  // Quantidade de segundos passados quando o ciclo foi criado
  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0);

  // React Hook Form + Zod Validation
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  });
  const {handleSubmit, watch, reset} = newCycleForm; // Desestruturar variavel acima

  // Show the active cycle
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()), // date to milliseconds (always different IDs)
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(), // data atual
    }

    setCycles((state) => [...state, newCycle]); // add new cycle to array
    setActiveCycleId(newCycle.id); // set ID of active cycle
    setAmountSecondsPassed(0);

    reset(); // clear and reset all inputs after form submitted (based on defaultValues)
  }
  function handleInterruptCycle() {
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

  // Disable Submit button
  const taskSize = watch('task'); // Observe the field
  const isSubmitDisabled = !taskSize;

  /* 
    Prop Drilling => Quando a gente tem MUITAS propriedades APENAS para comunicacao entre componentes
    Context API => Permite compartilharmos informacoes entre VARIOS componentes ao mesmo tempo
  */

  return (
    <HomeContainer>
      {/* Form */}
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        {/* Context Provider */}
        <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed }}>
          <FormProvider {...newCycleForm}> {/* Passa as propriedades como uma propriedade para o formProvider */}
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>
        {/* Button */}
        {
          activeCycle ? (
            <StopCountdownButton type="button" onClick={handleInterruptCycle}>
              <HandPalm size={24} />
              Stop
            </StopCountdownButton>
          ) : (
            <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
              <Play size={24} />
              Start
            </StartCountdownButton>
          )
        }
      </form>
    </HomeContainer>
  )
}