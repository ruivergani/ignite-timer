import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../..";

export function Countdown() {
  // Context
  const { activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed } = useContext(CyclesContext);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0; // if ternario (se tiver ciclo ativo multiplica por 60 senao e 0)

  // Convert minutes to seconds (calculations section)
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60); // arredonda para baixo (minutos em segundos)
  const secondsAmount = currentSeconds % 60; // segundos restantes 

  const minutes = String(minutesAmount).padStart(2, '0'); // padStart preenche a variavel com algum character
  const seconds = String(secondsAmount).padStart(2, '0');

  // Update Title of the window
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`;
    }
  }, [minutes, seconds, activeCycle])

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
          markCurrentCycleAsFinished()
          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        }
        else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }
    // Delete previous interval used
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished, setSecondsPassed]) // sempre que usar uma variavel externa tem que passar a variavel como dependencia do useEffect (toda vez que activeCycle mudar o codigo renderiza novamente)

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}