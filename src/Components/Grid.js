import React from "react"

export default function Grid({x, y, deck, setDeck, selected, setSelected, turn, phase, subPhase, setSubPhase, type, setTargetedUnit, setThrows}) {

    //type: action, hollow, rapid
    //action: move,shoot,move for charge, melee

    let STYLE = { top: 60 * y +2, left: 60 * x +2 }

    //This will run when this gets clicked on
    function applyGrid() {
        let arr
        if (type==="action")
            switch(phase) {
                case "charge":
                case "movement":
                    arr = [...deck]
                    arr[selected] = {...arr[selected], x: x, y: y, hasMoved: true} //avoid mutation
                    setDeck(arr)
                    setSelected(undefined) //end
                break
                case "shooting":
                case "fight":
                    deck.forEach((item,ind) => {
                        if (item.x === x && item.y === y) {
                            setSubPhase("hit")
                            setThrows([])
                            setTargetedUnit(ind)
                            //setSelected(undefined)
                        }
                    })
                break
                /*case "charge":
                    //loop trough enemies, check for same xy but in 1 radius
                    //set fight's hasFight = true, start combat
                    //when combat is resolved setSelected undef
                break*/
            }
    }

    return (
        <div className="grid" style={STYLE}>
            <div onClick={()=> {applyGrid()}} className="mask" style={{cursor: type==="action" ? "pointer" : "default" }} ></div>
            <div className={type==="action" ? "grid-action" : "grid-hollow"}></div>
        </div>
    )
}

//{type==="action" ? "grid grid-action" : "grid grid-hollow" }