import React from "react"

export default function Command({turn, setTurn, phase, setPhase, subPhase, setSelected, setDeck}) {

    //Parse trough deck and reset units
    function resetEndTurn() {
        setDeck(prev=> {
            return prev.map(unit=> {
                return {...unit, hasMoved: false, hasShot: false, hasCharged: false, hasMeleed:false }
            })
        })
    }

    //Handle Btn click
    function handleClick() {
      if (subPhase==="none") {
        if (phase === "movement") setPhase("shooting")
        else if (phase === "shooting") setPhase("charge")
        else if (phase === "charge") setPhase("fight")
        else if (phase === "fight")
        {setTurn(prev=> {return !prev}); setPhase("movement"); resetEndTurn()}
      setSelected(undefined)
      }
    }

    return (
      <div className="cnc">
        {(phase !== "fight") && <button className={turn?"cmd-blue":"cmd-red"} onClick={handleClick}>END <span>{phase}</span> PHASE</button>}
        {(phase === "fight") && <button className={turn?"cmd-blue":"cmd-red"} onClick={handleClick}>END FIGHT PHASE & TURN</button>}
      </div>
    )
  }