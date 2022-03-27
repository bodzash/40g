//Import Weapons
import igWeapons from "./DataWeaponsIG"
import orkWeapons from "./DataWeaponsOrks"

//Import Units
import igUnits from "./DataUnitsIG"
import orkUnits from "./DataUnitsOrks"


let weapons = []
let units = []
let parsedUnits = []

weapons = [...igWeapons, ...orkWeapons]
units = [...igUnits, ...orkUnits]

weapons.push({
    name: "Basic Melee",
    R: "Melee",
    T: "Melee",
    A: "User",
    S: "User",
    AP: 0,
    D: 1,
})

//Replace strings with actual weapon objects
parsedUnits = units.map(unit=> {
	let rangedSlotParsed = weapons.find(weapon=> unit.rangedSlot === weapon.name)
    let meleeSlotParsed = weapons.find(weapon=> unit.meleeSlot === weapon.name)
    return {...unit,
    rangedSlot: rangedSlotParsed,
    meleeSlot: meleeSlotParsed
    }
})

export default parsedUnits