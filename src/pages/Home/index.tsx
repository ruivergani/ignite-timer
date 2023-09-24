import { Play } from "phosphor-react";
import { HomeContainer, CountdownContainer, FormContainer, Separator, StartCountdownButton, TaskInput, MinutesAmountInput} from "./styles";

export function Home() {
  return(
    <HomeContainer>
      {/* Form */}
      <form action="">
        {/* Labels / Input */}
        <FormContainer>
          <label htmlFor="task">I will work with</label>
          <TaskInput 
            type="text" 
            id="task" 
            placeholder="Give a name to your project"
            list="taskSuggestions"
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
        <StartCountdownButton type="submit">
          <Play size={24}/>
          Start
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}