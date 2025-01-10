import { Terminal } from '@xterm/xterm'

import './style.css'

// map points enum
const MAP_POINT = {
    SPACE: '.', // empty space; can move
    WALL: '#', // wall; can't move
    DOOR: '|', // indicating level change
}

let t = new Terminal({ fontSize: 18 })

let map = new Array(t.rows * t.cols).fill(MAP_POINT.SPACE)

let lineLength = map.length / t.rows
let linesCount = map.length / lineLength

t.open(document.getElementById('app'))

// top line
for (let i = 0; i <= lineLength; i++) {
    map[i] = MAP_POINT.WALL
}


// bottom line
for (let i = map.length - 1; i >= (map.length - lineLength); i--) {
    map[i] = MAP_POINT.WALL
}

// side lines
for (let i = 0; i <= linesCount; i++) {
    map[lineLength * i] = MAP_POINT.WALL
    map[(lineLength * i) - 1] = MAP_POINT.WALL
}

displayDoor()

// cutting map's tail
for (let i = 0; i <= map.length - (linesCount * lineLength); i++) {
    map.pop()
}

let chr = {
    pos: { x: 3, y: 3, oldX: 0, oldY: 0 },
    chr: '@'
}

// display character

displayCharacter()

// move character

document.onkeydown = function (e) {
    switch (e.key) {
        case 'a':
            chr.pos.oldY = chr.pos.y
            chr.pos.oldX = chr.pos.x
            chr.pos.x--
            update()
            break
        case 'd':
            chr.pos.oldY = chr.pos.y
            chr.pos.oldX = chr.pos.x
            chr.pos.x++
            update()
            break
        case 's':
            chr.pos.oldY = chr.pos.y
            chr.pos.oldX = chr.pos.x
            chr.pos.y++
            update()
            break
        case 'w':
            chr.pos.oldY = chr.pos.y
            chr.pos.oldX = chr.pos.x
            chr.pos.y--
            update()
            break


    }
}

drawMap()
console.log(map)

function displayDoor() {
    let doorPos = rand(1, linesCount)
    map[(lineLength * doorPos) - 1] = MAP_POINT.DOOR

}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function displayCharacter() {

    if (typeof map == 'string')
        map = map.split('')

    if (chr.pos.oldX > 0 || chr.pos.oldY > 0)
        mapSetPoint(chr.pos.oldX, chr.pos.oldY, MAP_POINT.SPACE)

    mapSetPoint(chr.pos.x, chr.pos.y, chr.chr)
}

function update() {
    validateCharacterPosition()
    displayCharacter()
    drawMap()
}

function validateCharacterPosition() {
    let point = mapGetPoint(chr.pos.x, chr.pos.y)
    switch (point) {
        // if wall don't let character move
        case MAP_POINT.WALL:
            chr.pos.x = chr.pos.oldX
            chr.pos.y = chr.pos.oldY
            break;
        // if door generate new level
        case MAP_POINT.DOOR:
            generateNewLevel()
            break
    }
}

function generateNewLevel() {
    throw new Error('todo')
}

function mapGetPoint(x, y) {
    return map[x + y * lineLength]
}


function mapSetPoint(x, y, chr) {
    map[x + y * lineLength] = chr
}

function drawMap() {

    map = map.join('')

    t.writeln(map)

}
