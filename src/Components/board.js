// 15x10
let arr = []

for(let i=0; i < 10; i++) {
    for(let h=0; h < 15; h++) {
        arr.push([h, i, {status: "empty"}])
    }
}

export default arr