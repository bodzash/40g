import React from "react"

//COMPONENTS
import Unit from "./Components/Unit"
import Battle from "./Components/Battle"
import Command from "./Components/Command"

//Data
import DATA from "./data/DataSheetAll"

//Deck/list
import igList from "./data/ListIG"
import orkList from "./data/ListOrk"

//CSS
import './Styles/style.css'

export default function App() {

  const [menuState, setMenuState] = React.useState("title") //title, lobby, game
  const [menuSelect, setMenuSelect] = React.useState(false)
  const [selfDeck, setSelfDeck] = React.useState([])
  const [otherDeck, setOtherDeck] = React.useState([])
  const [units, setUnits] = React.useState([])
  const [board, setBoard] = React.useState({x: 14, y:7}) //y:7
  const [selectedUnit, setSelectedUnit] = React.useState()

  const [myTurn, setMyTurn] = React.useState(true) //bool
  const [phase, setPhase] = React.useState("movement") //movement,shooting,charge,fight
  const [subPhase, setSubPhase] = React.useState("none") //none, hit, wound, save

  const [targetedUnit, setTargetedUnit] = React.useState(undefined)
  const [throws, setThrows] = React.useState([]) //all throws
  const [succThrows, setSuccThrows] = React.useState([]) //succesful throws
  const [throwDone, setThrowDone] = React.useState(0) // 0-canClickBtn 1-continue 2-exit

  React.useEffect(()=> {
    setUnits([...selfDeck, ...otherDeck])
  }, [selfDeck, otherDeck])

  //Draw all Units
  function renderUnits() {
    return units.map((i,index) => {
      return <Unit
        key={index}
        id={index}
        board={board}
        turn={myTurn}
        phase={phase}
        subPhase={subPhase}
        setSubPhase={setSubPhase}
        deck={units}
        setDeck={setUnits}
        selected={selectedUnit}
        setSelected={setSelectedUnit}
        setTargetedUnit={setTargetedUnit}
        setThrows={setThrows}
        {...i} />
    })
  }

  //Parse the List/Deck
  function parseList(deckArg,isHostile) {
    let DECK_PARSED = deckArg.map((item,index)=> {
      let parsedUnit = DATA.find(unit=> unit.name === item)
      return {
        ...parsedUnit,
        x: !isHostile ? 0 : 14,
        y: index,
        isEnemy: isHostile,
        hasMoved: false,
        hasShot: false,
        hasCharged: false,
        hasMeleed: false
      }
    })
    if(!isHostile) {setSelfDeck(DECK_PARSED)} else {setOtherDeck(DECK_PARSED)}
  }

  //Menu Component (local)
  function Menu() {
    return (<div></div>)
  }

  function handleClick(list,enemy) {
    parseList(list,enemy)
    menuSelect && setMenuState("game")
    setMenuSelect(true)
  }

  return (
    <div className="app">
      <div className="menu">
            {menuState === "title" && 
            <>
                <h1 style={{color: !menuSelect ? "blue" : "red"}}>{!menuSelect ? "Blue Player" : "Red Player" }!</h1>
                <h1>Select An Army...</h1>
                <div className="list-wrapper">
                    <button onClick={()=> handleClick(igList, menuSelect)}>Guards</button>
                    <button onClick={()=> handleClick(orkList, menuSelect)}>Orcs</button>
                </div>
            </>
            }
            {menuState === "game" && 
            <div className="game">
                {renderUnits()}
                <Command turn={myTurn} setTurn={setMyTurn} phase={phase} setPhase={setPhase} subPhase={subPhase} setSelected={setSelectedUnit} setDeck={setUnits} />
                {subPhase !== "none" &&
                <Battle
                  phase={phase}
                  throws={throws} setThrows={setThrows}
                  deck={units} setDeck={setUnits}
                  subPhase={subPhase} setSubPhase={setSubPhase}
                  selected={selectedUnit} setSelected={setSelectedUnit}
                  targeted={targetedUnit} setTargeted={setTargetedUnit}
                  throwDone={throwDone} setThrowDone={setThrowDone}
                  succThrows={succThrows} setSuccThrows={setSuccThrows}
                />}
            </div>
            }
        </div>
    </div>
  )
}