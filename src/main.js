import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import { ImageAddon } from '@xterm/addon-image'
import { AttachAddon } from '@xterm/addon-attach'
import './style.css'

let t = new Terminal({ fontSize: 18 })

let map = new Array(t.rows * t.cols).fill('.')

let lineLength = map.length / t.rows

t.open(document.getElementById('app'))

// top line
for (let i = 0; i <= lineLength; i++) {
    map[i] = '#'
}

// bottom line
for (let i = map.length - 1; i >= (map.length - lineLength); i--) {
    map[i] = '#'
}

for (let i = 0; i <= t.rows; i++) {
    map[lineLength * i] = '#'
}


let chr = {
    pos: { x: 3, y: 3, oldX: 0, oldY: 0 },
    chr: '@'
}
// display character
// map[chr.pos.x + chr.pos.y * lineLength] = chr.chr
displayCharacter()

// move character

document.onkeydown = function (e) {
    switch (e.key) {
        case 'a':
            chr.pos.oldY = chr.pos.y
            chr.pos.oldX = chr.pos.x
            chr.pos.x--
            validateCharacterPosition()
            displayCharacter()
            drawMap()
            break;
        case 'd':
            chr.pos.oldY = chr.pos.y
            chr.pos.oldX = chr.pos.x
            chr.pos.x++
            validateCharacterPosition()
            displayCharacter()
            drawMap()
            break;
        case 's':
            chr.pos.oldY = chr.pos.y
            chr.pos.oldX = chr.pos.x
            chr.pos.y++
            validateCharacterPosition()
            displayCharacter()
            drawMap()
            break;
        case 'w':
            chr.pos.oldY = chr.pos.y
            chr.pos.oldX = chr.pos.x
            chr.pos.y--
            validateCharacterPosition()
            displayCharacter()
            drawMap()
            break;


    }
}

// map points enum
const MAP_POINT = {
    SPACE: '.', // empty space; can move
    WALL: '#' // wall; can't move
}

drawMap()

function displayCharacter() {

    if (typeof map == 'string')
        map = map.split('')

    mapSetPoint(chr.pos.oldX, chr.pos.oldY, '.')

    mapSetPoint(chr.pos.x, chr.pos.y, chr.chr)
}

function validateCharacterPosition() {
    let point = mapGetPoint(chr.pos.x, chr.pos.y)
    // if wall don't let character move
    if (point == MAP_POINT.WALL) {
        chr.pos.x = chr.pos.oldX
        chr.pos.y = chr.pos.oldY
    }
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
