import { Play } from "phosphor-react";
import { HomeContainer, CountdownContainer, FormContainer,Separator } from "./styles";


export function Home() {
  return(
    <HomeContainer>
      {/* Form */}
      <form action="">
        {/* Labels / Input */}
        <FormContainer>
          <label htmlFor="task">I will work with</label>
          <input type="text" id="task" />

          <label htmlFor="minutesAmount">while</label>
          <input type="number" id="minutesAmount" />

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
        <button type="submit">
          <Play size={24}/>
          Start
        </button>
      </form>
    </HomeContainer>
  )
}