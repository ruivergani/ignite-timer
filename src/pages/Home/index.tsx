import { Play } from "phosphor-react";
import {
  HomeContainer,
  CountdownContainer,
  FormContainer,
  Separator,
  StartCountdownButton,
  TaskInput,
  MinutesAmountInput
}
  from "./styles";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // integrate with ZOD
import * as zod from 'zod';
import { useState } from "react";

// Zod Schema
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Write Your Task'), // string, min 1 char, message: Write Your Task
  minutesAmount: zod.number().min(5).max(60),
})
// Type useForm
type NewCycleFormData =  zod.infer<typeof newCycleFormValidationSchema> // Same as creating Interface => infer from the zod schema automatically the types (extract inferred type)

interface Cycle{
  id: string,
  task: string,
  minutesAmount: number,
  
}

export function Home() {
  // States
  const [cycles, setCycles] = useState<Cycle[]>([]); // array of Cycle
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null) // cycle active or not
  
  // React Hook Form + Zod Validation
  const {register, handleSubmit, watch, formState, reset} = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues:{
      task: '',
      minutesAmount: 0,
    }
  });

  function handleCreateNewCycle(data: NewCycleFormData){
    const newCycle: Cycle = {
      id: String(new Date().getTime()), // date to milliseconds (always different IDs)
      task: data.task,
      minutesAmount: data.minutesAmount
    }

    setCycles((state) => [...state, newCycle]); // add new cycle to array
    setActiveCycleId(newCycle.id); // set ID of active cycle

    reset(); // clear and reset all inputs after form submitted (based on defaultValues)
  }

  // Show the active cycle
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

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
            {...register('minutesAmount', {valueAsNumber: true})}
          />
          <span>minutes.</span>
        </FormContainer>
        {/* Countdown */}
        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>
        {/* Button */}
        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24} />
          Start
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}