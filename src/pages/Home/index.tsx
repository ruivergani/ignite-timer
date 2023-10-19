import { HandPalm, Play } from "phosphor-react";
import {
  HomeContainer,
  CountdownContainer,
  FormContainer,
  Separator,
  StartCountdownButton,
  TaskInput,
  MinutesAmountInput,
  StopCountdownButton
}
  from "./styles";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // integrate with ZOD
import * as zod from 'zod';
import { useEffect, useState } from "react";
import { differenceInSeconds } from 'date-fns';

// Zod Schema
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Write Your Task'), // string, min 1 char, message: Write Your Task
  minutesAmount: zod.number().min(5).max(60),
})
// Type useForm
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema> // Same as creating Interface => infer from the zod schema automatically the types (extract inferred type)

interface Cycle {
  id: string,
  task: string,
  minutesAmount: number,
  startDate: Date, // data ou horario
  interruptedDate?: Date, // data opcional
  finishedDate?: Date,
}

export function Home() {
  // States
  const [cycles, setCycles] = useState<Cycle[]>([]); // array of Cycle
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null); // cycle active or not
  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0); // quantidade de segundos passados quando o ciclo foi criado

  // React Hook Form + Zod Validation
  const { register, handleSubmit, watch, formState, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  });

  // Show the active cycle
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  // Convert minutes to seconds (calculations section)
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0; // if ternario (se tiver ciclo ativo multiplica por 60 senao e 0)
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60); // arredonda para baixo (minutos em segundos)
  const secondsAmount = currentSeconds % 60; // segundos restantes 

  const minutes = String(minutesAmount).padStart(2, '0'); // padStart preenche a variavel com algum character
  const seconds = String(secondsAmount).padStart(2, '0');

  useEffect(() => {
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => { // Do something every 1000 milliseconds (1 second)
        // Date FNS Library (Actual Date - Start Date)
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );
        // Total de segundos maior ou igual numero de tempo que o ciclo tem
        if (secondsDifference >= totalSeconds) {
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
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        }
        else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }
    // Delete previous interval used
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId]) // sempre que usar uma variavel externa tem que passar a variavel como dependencia do useEffect (toda vez que activeCycle mudar o codigo renderiza novamente)

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

  // Update Title of the window
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle])

  // Disable Submit button
  const taskSize = watch('task'); // Observe the field
  const isSubmitDisabled = !taskSize;

  // Manipulate form errors
  console.log(formState.errors);

  return (
    <HomeContainer>
      {/* Form */}
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        {/* Labels / Input */}
        <FormContainer>
          <label htmlFor="task">I will work with</label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Give a name to your project"
            list="taskSuggestions"
            disabled={!!activeCycle}
            {...register('task')}
          />
          <datalist id="taskSuggestions">
            <option value="Project 01"></option>
            <option value="Project 02"></option>
            <option value="Project 03"></option>
          </datalist>
          <label htmlFor="minutesAmount">while</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutes.</span>
        </FormContainer>
        {/* Countdown */}
        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>
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