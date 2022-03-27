import React from "react"

export default function Battle({
    deck, setDeck,
    phase,
    subPhase, setSubPhase,
    selected, setSelected,
    targeted, setTargeted,
    throws, setThrows,
    throwDone, setThrowDone,
    succThrows, setSuccThrows
    }) {
    
    function rollD6() {return Math.floor(Math.random()*6)+1}

    let unit = deck[selected]
    let weapon = phase==="shooting" ? deck[selected].rangedSlot : deck[selected].meleeSlot
    let target = deck[targeted]

    let ws = weapon.S //Weapon Strength
    let tt = target.T //Target Toughness

    // for rapid fire and dakka
    let range = distance({x:unit.x, y:unit.y},{x: target.x,y: target.y})
   
    let message = ""
    let subMessage = ""
    let btn = ""

    setText() //

    function distance(p1, p2) {
        let dx = p2.x - p1.x; dx *= dx;
        let dy = p2.y - p1.y; dy *= dy;
        return Math.sqrt( dx + dy );
    }

    function setText() {
        //Button Text
        if (throwDone===0) {btn = "ROLL DICE"}
        if (throwDone===1) {btn = "CONTINUE"}
        if (throwDone===2) {btn = "EXIT"}

        //Other Text
        switch(subPhase) {
            case "hit":
                if(throwDone===0) {
                    message = `Roll ${phase==="shooting" ? unit.BS : unit.WS} or higher to hit the enemy!`
                    subMessage = `Your unit attacks ${(weapon.T==="Rapid Fire" && range < weapon.R/2) ? weapon.A*2 : weapon.A} time(s) with their ${weapon.name}`
                }
                if(throwDone===1) {
                    message = `You hit your target ${succThrows} time(s)!`
                    subMessage = `Enemy succesfully hit`
                }
                if(throwDone===2) {
                    message = `Your attack(s) missed the target!`
                    subMessage = `You needed ${phase==="shooting" ? unit.BS : unit.WS} or higher 🙁`
                }
            break
            case "wound":
                if(throwDone===0) {
                    message = `Roll ${tellWoundTable()} or higher to wound the enemy!`
                    subMessage = `Your unit's attacks attempts to wound ${succThrows} time(s)`
                }
                if(throwDone===1) {
                    message = `You wound your target ${succThrows} time(s)!`
                    subMessage = `Enemy succesfully wounded`
                }
                if(throwDone===2) {
                    message = `Your attack(s) couldn't wound the target!`
                    subMessage = `You needed ${tellWoundTable()} or higher 🙁`
                }
            break
            case "save":
                if(throwDone===0) {
                    message = `Roll ${target.Sv-1-weapon.AP} or lower to damage the enemy!`
                    subMessage = `You wounded the enemy ${succThrows} time(s)`
                }
                if(throwDone===1) {
                    message = `Enemy armor failed, they take ${weapon.D * succThrows} damage!`
                    btn = "FINISH COMBAT"
                    if ((target.W - (weapon.D * succThrows)) <= 0)
                        subMessage = `The enemy unit dies from your attack(s) 💀`
                    else subMessage = `They have ${(target.W - weapon.D * succThrows)} reamaining health left`
                }
                if(throwDone===2) {
                    message = `The enemy's armor saved them from your attack(s)!`
                    subMessage = `You fail to inflict any damage 🙁`
                }
            break
        }
    }

    function tellWoundTable() {
        let woundRoll = 0
        if (ws >= tt*2) {woundRoll = 2 }
        else if (ws > tt) {woundRoll = 3 }
        else if (ws === tt) {woundRoll = 4 }
        else if (ws <= tt/2) {woundRoll = 6 }
        else if (ws < tt) {woundRoll = 5 }
        return woundRoll
    }

    function woundTable(roll) {
        let woundRoll = false
        if (roll !== 1) {
            if (ws >= tt*2) {woundRoll = (roll >= 2) ? true : false; console.log("Tier: 2")}
            else if (ws > tt) {woundRoll = (roll >= 3) ? true : false; console.log("Tier: 3")}
            else if (ws === tt) {woundRoll = (roll >= 4) ? true : false; console.log("Tier: 4")}
            else if (ws <= tt/2) {woundRoll = (roll >= 6) ? true : false; console.log("Tier: 6")}
            else if (ws < tt) {woundRoll = (roll >= 5) ? true : false; console.log("Tier: 5")}
        } else woundRoll = false

        return woundRoll
    }
    
    //To Hit
    function rollToHit() {
        let arr = []
        let total = (weapon.T==="Rapid Fire" && range < weapon.R/2) ? weapon.A*2 : weapon.A 
        for(let i = 0; i < total; i++) {
            arr.push(rollD6())
        }

        let set = 0
        arr.forEach(item=> {
            item >= unit.WS && set++
        })

        setSuccThrows(set)
        setThrows([...arr])
        set!==0 ? setThrowDone(1) : setThrowDone(2)
    }

    //To Wound
    function rollToWound() {
        let arr = []
        for(let i = 0; i < succThrows; i++) {
            arr.push(rollD6())
        }

        let set = 0
        arr.forEach(item=> {
            woundTable(item) && set++
        })

        setSuccThrows(set)
        setThrows([...arr])
        set!==0 ? setThrowDone(1) : setThrowDone(2)
    }

    //To Save
    function rollToSave() {
        let arr = []
        for(let i = 0; i < succThrows; i++) {
            arr.push(rollD6())
        }

        let set = 0
        arr.forEach(item=> {
            item <= target.Sv-1-weapon.AP && set++
        })

        setSuccThrows(set)
        setThrows([...arr])
        set!==0 ? setThrowDone(1) : setThrowDone(2)
    }

    function renderDices() {
        function Dice({value}) {return <div className="roll-dice">{value}</div>}

        return throws.map((item,indx)=> {
            return <Dice key={indx} value={item} />
        })
    }

    //Handle Button Click
    function handleClick() {
        if (subPhase==="hit" && throwDone===0) {rollToHit()}
        if (subPhase==="wound" && throwDone===0) {rollToWound()}
        if (subPhase==="save" && throwDone===0) {rollToSave()}

        if (subPhase==="hit" && throwDone===1) {setSubPhase("wound"); setThrowDone(0)}
        if (subPhase==="wound" && throwDone===1) {setSubPhase("save"); setThrowDone(0)} 
        if (subPhase==="save" && throwDone===1) {
            let arr = [...deck]

            arr[selected] = phase==="shooting" ? {...arr[selected], hasShot: true} : {...arr[selected], hasMeleed: true} //set shot

            for(let i = 0; i < succThrows; i++) {
                arr[targeted] = {...arr[targeted], W: (arr[targeted].W - weapon.D)} //deal damage <-repeat x times
            }
            
            if (arr[targeted].W <= 0) {arr.splice(targeted,1)} //remove dead

            setDeck(arr)
            setSubPhase("none")
            setTargeted(undefined)
            setSelected(undefined)
            setThrowDone(0)
        }

        if (throwDone===2) {
            let arr = [...deck]
            arr[selected] = phase==="shooting" ? {...arr[selected], hasShot: true} : {...arr[selected], hasMeleed: true}
            setDeck(arr)
            setSubPhase("none")
            setTargeted(undefined)
            setSelected(undefined)
            setThrowDone(0)
        }
    }

    //Handle Spacebar
    function handleSpace(event) {
        if (event.keyCode == 32)
            console.log("shiraas")
    }
    
    return (
        <>
        <div className="battle-bck"></div>
        <div className="battle">
            <h1 className="roll-title">Roll to <span>{subPhase}</span></h1>
            <h2 className="roll-rule" style={{color: throwDone===0 && "white" || throwDone===1 && "greenyellow" || throwDone===2 && "red" }}>{message}</h2>
            <h3 className="roll-sub">{subMessage}</h3>
            <div className="roll-dice-wrapper">
                {throwDone!==0 && renderDices()}
            </div>
            <div onClick={handleClick} className="roll-btn">{btn}</div>
            <div className="roll-wrapper left">
                <div className={`flag ${deck[selected].isEnemy ? "flag-red" : "flag-blue"}`}></div>
                <img src={`./images/${unit.sprite}.png`} width="150px" height="auto" className="roll-img" />
            </div>
            <div className="roll-wrapper right">
                <div className={`flag ${deck[targeted].isEnemy ? "flag-red" : "flag-blue"}`}></div>
                <img src={`./images/${target.sprite}.png`} width="150px" height="auto" className="roll-img" />
            </div>
        </div>
        </>
    )
}