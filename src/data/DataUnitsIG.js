import igDataWeapons from "./DataWeaponsIG"

let LIST = [
    {
        name: "Guardsman",
        M: 3,
        WS: 4, //+
        BS: 4, //+
        S: 3,
        T: 3,
        W: 1,
        A: 1,
        Sv: 5, //+
        B: 1,
        rangedSlot: "Lasgun",
        meleeSlot: "Basic Melee",
        grenadeSlot: "Frag Grenade",
        sprite: "igGuard",
	    scale: 65, //px
        originX: "57%",
	    originY: "-65%",
    },
    {
        name: "Sergeant",
        M: 3,
        WS: 4, //+
        BS: 4, //+
        S: 3,
        T: 3,
        W: 1,
        A: 2,
        Sv: 5, //+
        B: 1,
        rangedSlot: "Laspistol",
        meleeSlot: "Power Sword",
        grenadeSlot: "Frag Grenade",
        sprite: "igSergeant",
	    scale: 70, //px
        originX: "54%",
	    originY: "-65%",
    },
]

//Replace strings with weapon objects
let LIST_PARSED = LIST.map(unit=> {
	let rangedSlotParsed = igDataWeapons.find(weapon=> unit.rangedSlot === weapon.name)
    let meleeSlotParsed = igDataWeapons.find(weapon=> unit.meleeSlot === weapon.name)
    return {...unit,
    rangedSlot: rangedSlotParsed,
    meleeSlot: meleeSlotParsed
    }
})

export default LIST_PARSED