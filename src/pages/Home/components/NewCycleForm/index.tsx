import { zodResolver } from "@hookform/resolvers/zod"; // integrate with ZOD
import { useForm } from "react-hook-form";
import { FormContainer, TaskInput, MinutesAmountInput } from "./styles";
import * as zod from 'zod';

// Zod Schema
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Write Your Task'), // string, min 1 char, message: Write Your Task
  minutesAmount: zod.number().min(5).max(60),
})
// Type useForm
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema> // Same as creating Interface => infer from the zod schema automatically the types (extract inferred type)

export function NewCycleForm() {
  // React Hook Form + Zod Validation
  const { register, handleSubmit, watch, formState, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  });

  return (
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
  )
}