import igDataUnits from "./DataUnitsIG"

let DECK = [
	"Sergeant",
	"Guardsman",
	"Guardsman",
	"Guardsman",
	"Guardsman",
	"Guardsman",
	"Guardsman",
	"Guardsman",
]

let DECK_PARSED = DECK.map((item,index)=> {
	let parsedUnit = igDataUnits.find(unit=> unit.name === item)
	return {
		...parsedUnit,
		x: 0,
		y: index,
		hasMoved: false,
		hasShot: false,
		hasCharged: false,
		hasMeleed: false
	}
})

export default DECK_PARSED