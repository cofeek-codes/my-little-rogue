import { Terminal } from '@xterm/xterm'

import './style.css'

// map points enum
enum MapPoint {
    SPACE = '.', // empty space; can move
    WALL = '#', // wall; can't move
    DOOR = '|', // indicating level change
}

let t = new Terminal({ fontSize: 18 })

let map: string[] = new Array(t.rows * t.cols).fill(MapPoint.SPACE)

let lineLength = map.length / t.rows
let linesCount = map.length / lineLength

t.open(document.getElementById('app')!)

// top line
for (let i = lineLength; i <= lineLength * 2; i++) {
    map[i] = MapPoint.WALL
}

// bottom line
for (let i = map.length - 1; i >= map.length - lineLength; i--) {
    map[i] = MapPoint.WALL
}

// side lines
for (let i = 0; i <= linesCount; i++) {
    map[lineLength * i] = MapPoint.WALL
    map[lineLength * i - 1] = MapPoint.WALL
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

    mapReplacePoint(MapPoint.DOOR, MapPoint.WALL)

    mapSetPoint(lineLength - 1, doorPos, MapPoint.DOOR)
}

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
}

function displayCharacter() {
    if (chr.pos.oldX > 0 || chr.pos.oldY > 0)
        mapSetPoint(chr.pos.oldX, chr.pos.oldY, MapPoint.SPACE)

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
        case MapPoint.WALL:
            chr.pos.x = chr.pos.oldX
            chr.pos.y = chr.pos.oldY
            break
        // if door generate new level
        case MapPoint.DOOR:
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
    Object.values(MapPoint).forEach(value => {
        if (value == MapPoint.WALL) {
            return
        } else if (value == MapPoint.DOOR) {
            mapReplacePoint(value, MapPoint.WALL)
        } else {
            mapReplacePoint(value, MapPoint.SPACE)
        }
    })
}

function mapGetPoint(x: number, y: number) {
    return map[x + y * lineLength]
}

function mapSetPoint(x: number, y: number, chr: string) {
    map[x + y * lineLength] = chr
}

function mapReplacePoint(from: MapPoint, to: MapPoint) {
    var idx = map.findIndex(p => p == from)
    if (idx == -1) return

    map[idx] = to
}

function drawMap() {
    t.writeln(map.join(''))
}
