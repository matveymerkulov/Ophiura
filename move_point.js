// noinspection DuplicatedCode

import {canvasMouse} from "../Furca/src/system.js"
import {distFromScreen} from "../Furca/src/canvas.js"
import {Drag} from "../Furca/src/drag.js"
import {pointUnderCursor} from "./main.js"

export default class MovePoint extends Drag {
    constructor(direction = 1) {
        super()
        this.direction = direction
    }

    conditions() {
        return this.getObject() !== undefined
    }

    getObject() {
        return pointUnderCursor
    }

    start() {
        this.object = this.getObject()
        this.mouseX0 = canvasMouse.x
        this.mouseY0 = canvasMouse.y
        this.objectX0 = this.object.x
        this.objectY0 = this.object.y
    }

    process() {
        this.object.x = this.objectX0 + this.direction * distFromScreen(canvasMouse.x - this.mouseX0)
        this.object.y = this.objectY0 + this.direction * distFromScreen(canvasMouse.y - this.mouseY0)
    }
}