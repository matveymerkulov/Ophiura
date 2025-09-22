import {Point} from "../Furca/src/point.js"
import {ctx, currentCanvas, distToScreen, xToScreen, yToScreen} from "../Furca/src/canvas.js"

export class PathPart {
    point0
    point1
    cPoint0
    cPoint1

    constructor(point0, point1) {
        this.point0 = point0
        this.point1 = point1
        this.cPoint0 = new Point()
        this.cPoint0.placeBetweenPoints(point0, point1, 1.0 / 3.0)
        this.cPoint1 = new Point()
        this.cPoint1.placeBetweenPoints(point1, point0, 1.0 / 3.0)
    }

    draw() {
        ctx.beginPath()
        ctx.moveTo(xToScreen(this.point0.x), yToScreen(this.point0.y))
        ctx.lineTo(xToScreen(this.point1.x), yToScreen(this.point1.y))
        ctx.stroke()
    }
}

export class Path {
    parts = []

    add(part) {
        this.parts.push(part)
    }

    draw() {
        for(const part of this.parts) {
            part.draw()
        }
    }
}