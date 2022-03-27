import React from "react"
import Grid from "./Grid"

export default function Unit({
    id, x, y, selected, deck, board, setDeck, setSelected,
    turn, phase, subPhase, setSubPhase, setThrows, setTargetedUnit,
    hasMoved, hasShot, hasCharged, hasMeleed, isEnemy,
    name, M, WS, BS, S, T, W, A, Sv, rangedSlot, meleeSlot,
    sprite,
    }) {

    let propWrapper = {setSelected: setSelected, selected: selected, board:board, setDeck: setDeck, deck: deck, turn: turn, phase: phase, subPhase: subPhase, setSubPhase: setSubPhase, setTargetedUnit:setTargetedUnit, setThrows: setThrows}
    let STYLE = {top: 60 * y +2, left: 60 * x +2}
    let isTied = false
    let unitClass;
    checkTie()
    parseWeapons()
    parseStyle()

    //Check if the Unit is in CQC
    function checkTie() {
        //parse trough all enemy units and set it isTied to true if enemies around
        for(let j = -1; j <= 1; j++)
            for(let k = -1; k <= 1; k++)
                !(k===0 && j===0) &&
                    deck.forEach(unit=> {
                        if (unit.isEnemy !== isEnemy) {
                            if (unit.x===x+j && unit.y===y+k)
                            isTied =
                            (rangedSlot.T === "Pistol"&&phase==="shooting") ? false : true
                        }
                    })
        
    }

    //Parses the weapons and turns text > integer
    function parseWeapons() {
        meleeSlot.R = 1;
        if (meleeSlot.A === "User") {meleeSlot.A = A}
        if (meleeSlot.S === "User") {meleeSlot.S = S}
        if (typeof meleeSlot.S === "string") {
            if (meleeSlot.S.includes("User+"))
                meleeSlot.S = S + parseInt(meleeSlot.S[5])
            else if (meleeSlot.S.includes("UserX"))
                meleeSlot.S = S * parseInt(meleeSlot.S[5])
        }
    }

    //Set the className according to status
    function parseStyle() {
        unitClass = isEnemy ? "enemy-inactive" : "friend-inactive";
            switch(phase) {
                case 'movement': (!hasMoved && !isTied) && (unitClass = isEnemy ? "enemy-active" : "friend-active")
                break
                case 'shooting': (!hasShot && (!hasMoved || rangedSlot.T==="Assault") && !isTied) && (unitClass = isEnemy ? "enemy-active" : "friend-active") //assault,pistol-tied
                break
                case 'charge': (!hasCharged && !hasShot && !isTied) && (unitClass = isEnemy ? "enemy-active" : "friend-active")
                break
                case 'fight': !hasMeleed && (unitClass = isEnemy ? "enemy-active" : "friend-active")
                break
        }
        (isEnemy && turn) && (unitClass = "enemy-inactive")
        selected===id && (unitClass = isEnemy ? "enemy-selected" : "friend-selected")
        !isEnemy && !turn && (unitClass="friend-inactive")
    }

    //Calculate the distance between 2 points {x,y} {z,w}
    function distance(p1, p2) {
        let dx = p2.x - p1.x; dx *= dx;
        let dy = p2.y - p1.y; dy *= dy;
        return Math.sqrt( dx + dy );
    }    

    function drawAOE(x, y, r) {
        let ret = []
        let count = 0
        for (let j=x-r; j<=x+r; j++)
            for (let k=y-r; k<=y+r; k++) {
                let range = distance({x:j,y:k},{x:x,y:y})
                if (range <= r) {
                    checkOverlapAll(j,k) && ret.push(<Grid key={count} x={j} y={k} type="action" {...propWrapper}/>)
                    count++
                }
            }
        return ret
    }

    //Draws Action Grids for Movement
    function drawMovement(x,y,r) {
        let ret = []
        let count = 0
        for (let j=x-r; j<=x+r; j++)
            for (let k=y-r; k<=y+r; k++) {
                let range = distance({x:j,y:k},{x:x,y:y})
                if (range <= r) {
                    (!checkOOB(j,k) && checkOverlapAll(j,k)) && ret.push(<Grid key={count} x={j} y={k} type="action" {...propWrapper}/>)
                    count++
                }
            }
        return ret
    }

    //Draws Action Grids for Shooting
    function drawShooting(x,y,r) {
        let ret = []
        let count = 0
        for (let j=x-r; j<=x+r; j++)
            for (let k=y-r; k<=y+r; k++) {
                let range = distance({x:j,y:k},{x:x,y:y})
                if (range <= r) {
                    (!checkOOB(j,k) && checkOverlapAll(j,k)) && ret.push(<Grid key={count} x={j} y={k} type="hollow" {...propWrapper}/>)
                    count++
                }
            }
        ret = [ ...ret, populateOverlapEnemy(x,y,r)]
        return ret
    }

    //Draws Action Grids for Charging
    function drawCharge(x,y,r) {
        //check all enemy & distance
        //draw active: create array place indistance enemys grids in a + pattern
        //(check with previous entries oob and alloverlap )

        //draw hollows: draw aoe and check for active entires and oob and overlap
    }

    //Draws Action Grids for Fighting
    function drawFight(x,y) {
        let ret = []
        let count = 0
        for(let j = -1; j <= 1; j++)
            for(let k = -1; k <= 1; k++) {
                count ++
                if (!(k===0 && j===0)) {
                    if (!checkOOB(x+j,y+k) && checkOverlapAll(x+j,y+k))
                        ret.push(<Grid key={count} x={x+j} y={y+k} type={"hollow"} {...propWrapper}/>)
                    
                    //
                    deck.forEach(item=> {
                        (item.x === x+j && item.y ===y+k) && item.isEnemy !== isEnemy
                        && ret.push(<Grid key={count} x={item.x} y={item.y} type={"action"} {...propWrapper}/>)
                    })
                }
            }
        

        return ret
    }

    function checkOOB(x,y) {
        return (x < 0 || x > board.x || y < 0 || y > board.y) //returns true if oob
    }

    //Check if Grid Overlaps with an other Unit(any Unit)
    function checkOverlapAll(x,y) {
        return !deck.some(item=> item.x === x && item.y ===y)
    }

    //Check if Grids Overlap with an ENEMY UNIT (returns false if empty, returns true if enemy unit)
    function populateOverlapEnemy(x,y,r) {
        let ret = []
        let count = 0
        deck.forEach(item=> {
            count++
            (distance({x:x,y:y},{x:item.x,y:item.y}) <= r ) && item.isEnemy !== isEnemy //!==
            && ret.push(<Grid key={count} x={item.x} y={item.y} type={"action"} {...propWrapper}/>)
        })
        return ret
    }

    //Resolve what happens when you select the Unit
    function handleClick() {
        function canSelect(){setSelected(selected === id ? undefined : id)}
        if (turn!==isEnemy && subPhase==="none")
            switch(phase) {
                case 'movement': (!hasMoved && !isTied) && canSelect()
                break
                case 'shooting': (!hasShot && (!hasMoved || rangedSlot.T==="Assault") && !isTied) && canSelect() //assault
                break
                case 'charge': (!hasCharged && !hasShot && !isTied) && canSelect()
                break
                case 'fight': !hasMeleed && canSelect()
                break
            }
    }

    //Render Action Grids around Unit
    function gridRender() {
        if (id===selected)
            switch(phase) {
                case "movement":
                    return drawMovement(x,y,M)
                case "shooting":
                    return drawShooting(x,y,rangedSlot.R)
                case "charge":
                    return drawMovement(x,y,M) //drawCharge(x,y,M-1)
                case "fight":
                    return drawFight(x,y)
            }
    }

    return (
        <>
        {gridRender()}
        <div onClick={handleClick} className="unit" style={STYLE}>
            <img src={sprite} width="90px" height="auto" />
            <div className={unitClass}></div>
            <div className="hover-table" style={x < 8 ? {left: "60px"} : {right: "60px"}}>
                <table>
                    <tbody>
                    <tr>
                        <th>Unit</th><th>M</th><th>WS</th><th>BS</th><th>S</th><th>T</th><th>W</th><th>A</th><th>Sv</th>
                    </tr>
                    <tr>
                        <td>{name}</td><td>{M}</td><td>{WS}+</td><td>{BS}+</td><td>{S}</td><td>{T}</td><td>{W}</td><td>{A}</td><td>{Sv}+</td>
                    </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                    <tr>
                        <th>Ranged</th><th>R</th><th>Type</th><th>A</th><th>S</th><th>AP</th><th>D</th>
                    </tr>
                    <tr>
                        <td>{rangedSlot.name}</td><td>{rangedSlot.R}</td><td>{rangedSlot.T}</td><td>{rangedSlot.A}</td><td>{rangedSlot.S}</td><td>{rangedSlot.AP}</td><td>{rangedSlot.D}</td>
                    </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                    <tr>
                        <th>Melee</th><th>R</th><th>Type</th><th>A</th><th>S</th><th>AP</th><th>D</th>
                    </tr>
                    <tr>
                        <td>{meleeSlot.name}</td><td>{meleeSlot.R}</td><td>{meleeSlot.T}</td><td>{meleeSlot.A}</td><td>{meleeSlot.S}</td><td>{meleeSlot.AP}</td><td>{meleeSlot.D}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </>
    )
}

//<img src={`./images/${sprite}.png`} width="90px" height="auto" />