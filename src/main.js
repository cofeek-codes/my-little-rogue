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
for (let i = lineLength; i <= lineLength * 2; i++) {
    map[i] = MAP_POINT.WALL
}

// bottom line
for (let i = map.length - 1; i >= map.length - lineLength; i--) {
    map[i] = MAP_POINT.WALL
}

// side lines
for (let i = 0; i <= linesCount; i++) {
    map[lineLength * i] = MAP_POINT.WALL
    map[lineLength * i - 1] = MAP_POINT.WALL
}

// cutting map's tail
for (let i = 0; i <= map.length - linesCount * lineLength; i++) {
    map.pop()
}

let chr = {
    pos: { x: 3, y: 3, oldX: 0, oldY: 0 },
    chr: '@',
}

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

generateNewLevel()

function displayDoor() {
    // use linesCount + 1 here
    // because top line is actually second now
    let doorPos = rand(1, linesCount + 1)

    mapToArray()

    mapReplacePoint(MAP_POINT.DOOR, MAP_POINT.WALL)

    mapSetPoint(lineLength - 1, doorPos, MAP_POINT.DOOR)
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function displayCharacter() {
    mapToArray()

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
            break
        // if door generate new level
        case MAP_POINT.DOOR:
            generateNewLevel()
            break
    }
}

function generateNewLevel() {
    // debugger
    clearMap()
    t.clear() // clear buffer on level change
    chr.pos.x = rand(3, 6)
    chr.pos.y = rand(3, 6)
    displayDoor()
    update()
}

function clearMap() {
    mapToString()

    Object.keys(MAP_POINT).forEach(key => {
        if (key == MAP_POINT.WALL) {
            return
        } else if (key == MAP_POINT.DOOR) {
            map.replace(key, MAP_POINT.WALL)
        } else {
            map.replace(key, MAP_POINT.SPACE)
        }
    })
}

function mapToArray() {
    if (typeof map != 'object') map = map.split('')
}

function mapToString() {
    if (typeof map != 'string') map = map.join('')
}

function mapGetPoint(x, y) {
    return map[x + y * lineLength]
}

function mapSetPoint(x, y, chr) {
    map[x + y * lineLength] = chr
}

function mapReplacePoint(from, to) {
    var idx = map.findIndex(p => p == from)
    if (idx == -1) return

    map[idx] = to
}

function drawMap() {
    mapToString()

    t.writeln(map)
}
