import React from "react"

import Grid from "./Grid"

export default function Unit({
    id, x, y, selected, deck, board, setDeck, setSelected,
    turn, phase,
    hasMoved, hasShot, hasCharged, hasMeleed,
    name, M, WS, BS, S, T, W, A, Sv, rangedSlot, meleeSlot,
    sprite, scale, originX, originY
    }) {

    function parseWeapons() {
        meleeSlot.R = 1;
        if (meleeSlot.A === "User") {meleeSlot.A = A}
        if (meleeSlot.S === "User") {meleeSlot.S = S}
        if (typeof meleeSlot.S === "string")
            if (meleeSlot.S.includes("User+"))
                meleeSlot.S = S + parseInt(meleeSlot.S[5])
    }

    parseWeapons()

    let propWrapper = {setSelected: setSelected, selected: selected, board:board, setDeck: setDeck, deck: deck, turn: turn, phase: phase}

    let STYLE = {
        top: 60 * y,
        left: 60 * x,
        backgroundColor: selected === id && "greenyellow",
        backgroundColor: hasMoved && "transparent",
        cursor: !hasMoved && "pointer"
    }

    function distance(p1, p2)
    {
    let dx = p2.x - p1.x; dx *= dx;
    let dy = p2.y - p1.y; dy *= dy;
    return Math.sqrt( dx + dy );
    }

    function drawAOE(x, y, r)
    {
        let ret = []
        let count = 0
        for (let j=x-r; j<=x+r; j++)
        for (let k=y-r; k<=y+r; k++)
            if (distance({x:j,y:k},{x:x,y:y}) <= r)
                {ret.push(<Grid key={count} x={j} y={k} {...propWrapper}/>); count++}
        return ret
    }

    function handleClick() {

        function canSelect() {
            setSelected(selected === id ? undefined : id)
        }

        if (turn)
            switch(phase) {
                case 'move': !hasMoved && canSelect()
                break
                case 'shoot': (!hasShot && !hasMoved) && canSelect() //tiedup,assault,pistol-tiedup
                break
                case 'charge': (!hasCharged && !hasShot) && canSelect() //tiedup
                break
                case 'fight': !hasMeleed && canSelect()
                break
            }
    }

    function gridRender() {
        if (id===selected)
            switch(phase) {
                case "move":
                    return drawAOE(x,y,M)
                case "shoot":
                    return !hasMoved && drawAOE(x,y,rangedSlot.R) //tiedup, pistol-tied
                case "charge":
                    return !hasShot && drawAOE(x,y,M) //tiedup
                case "fight":
                    return drawAOE(x,y,meleeSlot.R)
            }
        
    }

    return (
        <>
        {gridRender()}
        <button onClick={handleClick} className="unit" style={STYLE}>
            <img style={{transform: `translate(${originX},${originY})`}} src={`./images/${sprite}.png`} width={scale} height="auto" />
            <div className="hover-table">
                <table>
                    <tr>
                        <th>Unit</th><th>M</th><th>WS</th><th>BS</th><th>S</th><th>T</th><th>W</th><th>A</th><th>Sv</th>
                    </tr>
                    <tr>
                        <td>{name}</td><td>{M}</td><td>{WS}+</td><td>{BS}+</td><td>{S}</td><td>{T}</td><td>{W}</td><td>{A}</td><td>{Sv}+</td>
                    </tr>
                </table>
                <table>
                    <tr>
                        <th>Ranged</th><th>R</th><th>Type</th><th>A</th><th>S</th><th>AP</th><th>D</th>
                    </tr>
                    <tr>
                        <td>{rangedSlot.name}</td><td>{rangedSlot.R}</td><td>{rangedSlot.T}</td><td>{rangedSlot.A}</td><td>{rangedSlot.S}</td><td>{rangedSlot.AP}</td><td>{rangedSlot.D}</td>
                    </tr>
                </table>
                <table>
                    <tr>
                        <th>Melee</th><th>R</th><th>Type</th><th>A</th><th>S</th><th>AP</th><th>D</th>
                    </tr>
                    <tr>
                        <td>{meleeSlot.name}</td><td>{meleeSlot.R}</td><td>{meleeSlot.T}</td><td>{meleeSlot.A}</td><td>{meleeSlot.S}</td><td>{meleeSlot.AP}</td><td>{meleeSlot.D}</td>
                    </tr>
                </table>
            </div>
        </button>
        </>
    )
}