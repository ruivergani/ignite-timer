// import { createContext, useContext, useState} from "react";
//
// // Armazenar o contexto na variavel
// const CyclesContext = createContext({} as any)
//
// // Component
// function Countdown(){
//   const { activeCycle, setActiveCycle } = useContext(CyclesContext);
//   return <h1>Countdown: {activeCycle} </h1>
// }
// // Component
// function NewCycleForm(){
//   let { activeCycle, setActiveCycle } = useContext(CyclesContext);
//   return(
//     <>
//       <h1>NewCycleForm: {activeCycle}</h1>
//       <button
//         onClick={() => {
//           setActiveCycle(2)
//         }}
//       >
//         Change active cycle
//       </button>
//     </>
//   )
// }
// // Components
// export function Home(){
//   const [activeCycle, setActiveCycle] = useState(0);
//   return(
//     <CyclesContext.Provider value={ {activeCycle, setActiveCycle} }>
//       <Countdown />
//       <NewCycleForm />
//     </CyclesContext.Provider>
//   )
// }