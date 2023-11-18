import { HandPalm, Play } from "phosphor-react";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton
}
  from "./styles";
import { useContext } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { zodResolver } from "@hookform/resolvers/zod"; // integrate with ZOD
import { FormProvider, useForm } from "react-hook-form";
import * as zod from 'zod';
import { CyclesContext } from "../../contexts/CyclesContext";

// Zod Schema
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Write Your Task'), // string, min 1 char, message: Write Your Task
  minutesAmount: zod.number().min(5).max(60),
})
// Type useForm
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema> // Same as creating Interface => infer from the zod schema automatically the types (extract inferred type)

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)
  // React Hook Form + Zod Validation
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  });
  const {handleSubmit, watch, reset} = newCycleForm; // Desestruturar variavel acima

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
      <form action="" onSubmit={handleSubmit(createNewCycle)}>
          <FormProvider {...newCycleForm}> {/* Passa as propriedades como uma propriedade para o formProvider */}
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        {/* Button */}
        {
          activeCycle ? (
            <StopCountdownButton type="button" onClick={interruptCurrentCycle}>
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