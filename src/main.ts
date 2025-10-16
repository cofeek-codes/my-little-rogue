import { GameMap } from './map/map'
import './style.css'

const canvas: HTMLCanvasElement = document.querySelector('#canvas')!
const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!

// background

ctx.fillStyle = '#181818'
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

// map

const map = new GameMap(ctx)

map.draw()
