import { HandPalm, Play } from "phosphor-react";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton
}
  from "./styles";

import { createContext, useEffect, useState } from "react";
import { differenceInSeconds } from 'date-fns';
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

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
  markCurrentCycleAsFinished: () => void // funcao sem retorno
}
// Criar Context (share values between components)
export const CyclesContext = createContext({} as CycleContextData) // export para o Countdown accesar o contexto

export function Home() {
  // States
  const [cycles, setCycles] = useState<Cycle[]>([]); // array of Cycle
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null); // cycle active or not

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

  // Disable Submit button
  const taskSize = watch('task'); // Observe the field
  const isSubmitDisabled = !taskSize;

  // Manipulate form errors
  console.log(formState.errors);

  /* 
    Prop Drilling => Quando a gente tem MUITAS propriedades APENAS para comunicacao entre componentes
    Context API => Permite compartilharmos informacoes entre VARIOS componentes ao mesmo tempo
  */

  return (
    <HomeContainer>
      {/* Form */}
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        {/* Context Provider */}
        <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished}}>
          <NewCycleForm />
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