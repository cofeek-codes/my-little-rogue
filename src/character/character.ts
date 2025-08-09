import Point from '../types/point'

export enum MoveDirection {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

class Character {
    private _position: Point
    private _oldPosition: Point = new Point(0, 0)
    private _chr: string

    constructor(position: Point, chr: string) {
        this._position = position
        this._chr = chr
    }

    public get position() {
        return this._position
    }

    public set position(value: Point) {
        this.updatePosition()
        this._position = value
    }

    public get oldPosition() {
        return this._oldPosition
    }

    public set oldPosition(value: Point) {
        this._oldPosition = value
    }

    public get chr() {
        return this._chr
    }

    public set chr(value: string) {
        this._chr = value
    }

    public move(direction: MoveDirection) {
        switch (direction) {
            case MoveDirection.LEFT:
                this._position.x--
                break
            case MoveDirection.RIGHT:
                this._position.x++
                break
            case MoveDirection.DOWN:
                this._position.y++
                break
            case MoveDirection.UP:
                this._position.y--
                break
        }
    }

    private updatePosition() {
        this._oldPosition = this._position
    }

    public revertPosition() {
        this._position = this._oldPosition
    }
}

export default Character
