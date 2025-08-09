import { Terminal } from '@xterm/xterm'

import './style.css'

import Character, { MoveDirection } from './character/character'
import Point from './types/point'

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

let character = new Character(new Point(3, 3), '@')

// move character

document.onkeydown = function (e) {
    debugger
    switch (e.key) {
        case 'a':
            character.move(MoveDirection.LEFT)
            update()
            break
        case 'd':
            character.move(MoveDirection.RIGHT)
            update()
            break
        case 's':
            character.move(MoveDirection.DOWN)
            update()
            break
        case 'w':
            character.move(MoveDirection.UP)
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

    mapSetPoint(new Point(lineLength - 1, doorPos), MapPoint.DOOR)
}

function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min)
}

function displayCharacter() {
    if (!character.oldPosition.isZero())
        mapSetPoint(character.oldPosition, MapPoint.SPACE)
    mapSetPoint(character.position, character.chr)
}

function update() {
    validateCharacterPosition()
    displayCharacter()
    drawMap()
}

function validateCharacterPosition() {
    let point = mapGetPoint(character.position)
    switch (point) {
        // if wall don't let character move
        case MapPoint.WALL:
            character.revertPosition()
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
    character.position = new Point(rand(3, 6), rand(3, 6))
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

function mapGetPoint(p: Point) {
    return map[p.x + p.y * lineLength]
}

function mapSetPoint(p: Point, chr: string) {
    console.log(p)
    return (map[p.x + p.y * lineLength] = chr)
}

function mapReplacePoint(from: MapPoint, to: MapPoint) {
    var idx = map.findIndex(p => p == from)
    if (idx == -1) return

    map[idx] = to
}

function drawMap() {
    t.writeln(map.join(''))
}
