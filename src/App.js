import React from "react"

//COMPONENTS
import Unit from "./Components/Unit"
import Grid from "./Components/Grid"
import Board from "./Components/board.js"

//Data
import igDataUnits from "./data/DataUnitsIG"
import igDataWeapons from "./data/DataWeaponsIG"

import igList from "./data/DataListIG"

//CSS
import './Styles/style.css'

export default function App() {

  const [menuState, setMenuState] = React.useState("title") //title, lobby, game
  const [selfDeck, setSelfDeck] = React.useState([])
  const [units, setUnits] = React.useState([]) //objects with vars
  const [grids, setGrids] = React.useState([]) //Board
  const [board, setBoard] = React.useState({x: 14, y:9}) //y:7
  const [selectedUnit, setSelectedUnit] = React.useState()

  const [myTurn, setMyTurn] = React.useState(true) //bool
  const [phase, setPhase] = React.useState("move") //move,shoot,charge,fight

  //console.log(selfDeck)

  //Draw all Units
  function renderUnits() {
    return selfDeck.map((i,index) => {
      return <Unit
        key={index}
        id={index}
        board={board}
        turn={myTurn}
        phase={phase}
        deck={selfDeck}
        setDeck={setSelfDeck}
        selected={selectedUnit}
        setSelected={setSelectedUnit}
        {...i} />
    })
  }
  //Draw C&C window
  function renderCommand() {

    function handler() {
      if (myTurn)
        if (phase === "move")
          setPhase("shoot")
        else if (phase === "shoot")
          setPhase("charge")
        else if (phase === "charge")
          setPhase("fight")
        else if (phase === "fight")
          setMyTurn(false)
      setSelectedUnit(undefined)
    }

    return (
      <div className="cnc">
        {(myTurn && phase !== "fight") && <button onClick={handler}>
          END <span>{phase}</span> PHASE
        </button>}
        {(myTurn && phase === "fight") && <button onClick={handler}>
          END TURN
        </button>}
        {!myTurn && <button style={{background: "gray"}}>
          OPPONENT'S TURN
        </button>}
      </div>
    )
  }

  function renderCombatWindow() {

  }

  return (
    <div className="app">
      <div className="menu">
            {menuState === "title" && 
            <>
                <h1>Select List:</h1>
                <div className="list-wrapper">
                    <button onClick={()=>{setSelfDeck(igList); setMenuState("game")}}>IG</button>
                </div>
            </>
            }
            {menuState === "lobby" && 
            <>
                <h1>Waiting for opponent...</h1>
            </>
            }
            {menuState === "game" && 
            <div className="game">
                {renderUnits()}
                {renderCommand()}
            </div>
            }
        </div>
    </div>
  )
}