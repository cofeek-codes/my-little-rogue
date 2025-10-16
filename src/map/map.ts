import { Vector2 } from '../math/vector2'

export enum MapCell {
    SPACE = '.',
    WALL = '#',
    DOOR = '|',
}

// Map is builtin, i forgot)
export class GameMap {
    private ctx: CanvasRenderingContext2D
    private map: string[] = []

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx
        this.initMap()
    }

    private initMap() {
        this.map = new Array(
            this.ctx.canvas.width * this.ctx.canvas.height
        ).fill(MapCell.SPACE)
        // top line
        for (let i = 0; i < this.ctx.canvas.width; i++) {
            this.map[i] = MapCell.WALL
        }

        // bottom line
        for (
            let i = this.map.length - 1;
            i >= this.map.length - this.ctx.canvas.width;
            i--
        ) {
            this.map[i] = MapCell.WALL
        }

        // side lines
        for (let i = 0; i <= this.ctx.canvas.height; i++) {
            this.map[this.ctx.canvas.width * i] = MapCell.WALL
            this.map[this.ctx.canvas.width * i - 1] = MapCell.WALL
        }
    }

    draw() {
        this.ctx.font = '12px monospace'
        this.ctx.fillStyle = '#fff'

        // TODO: better way to draw a map

        // top line
        for (let i = 0; i < this.ctx.canvas.width; i++) {
            let charSize = this.getCharSize(this.map[i])
            this.ctx.fillText(this.map[i], charSize.x * i, charSize.y)
        }

        // bottom line
        for (let i = 0; i < this.ctx.canvas.width; i++) {
            let charSize = this.getCharSize(this.map[i])
            this.ctx.fillText(
                this.map[i],
                charSize.x * i,
                this.ctx.canvas.height
            )
        }
        // side lines
        for (let i = 0; i <= this.ctx.canvas.height; i++) {
            let charSize = this.getCharSize(this.map[i])
            this.ctx.fillText(this.map[i], 0, charSize.y * i)
            this.ctx.fillText(
                this.map[i],
                this.ctx.canvas.width - charSize.x,
                charSize.y * i
            )
        }
    }

    private getCharSize(char: string): Vector2 {
        let charInfo = this.ctx.measureText(char)
        let w = charInfo.width
        let h = charInfo.actualBoundingBoxAscent

        return new Vector2(w, h)
    }
}
