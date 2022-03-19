import React from "react"

export default function Grid({x, y, deck, setDeck, board, selected, setSelected, turn, phase}) {

    let overlap = deck.some(item=> item.x === x && item.y ===y )

    let STYLE = {
        top: 60*y,
        left: 60*x,
        display: (x < 0 || x > board.x || y < 0 || y > board.y || overlap) ? "none" : "flex"
    }

    function applyGrid() {
        if (turn)
            switch(phase) {
                case "move":
                    let arr = [...deck]
                    arr[selected] = {...arr[selected], x: x, y: y, hasMoved: true} //avoid mutation
                    setDeck(arr)
                    setSelected(undefined) //end
                break
                case "shoot":
                    //loop trough deck, check for same xy, check for enemy, ...
                    //set shooter's hasShot = true, start combat (display combat window)
                break
            }
    }

    return (
        <button onClick={()=> {applyGrid()}} className="grid" style={STYLE}>
            
        </button>
    )
}