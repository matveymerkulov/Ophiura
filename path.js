import {Point} from "../Furca/src/point.js"
import {ctx, currentCanvas, distToScreen, xToScreen, yToScreen} from "../Furca/src/canvas.js"
import {drawDashedRegion, drawShape} from "./draw.js"
import {paths, pointUnderCursor, settings} from "./main.js"
import {mouse} from "../Furca/src/system.js"
import {dist} from "../Furca/src/functions.js"

export let pathUnderCursor, pathPartUnderCursor, controlPointUnderCursorIndex

export class PathPart {
    point0
    point1
    cPoint0
    cPoint1
    prevPart
    nextPart

    constructor(point0, point1) {
        this.point0 = point0
        this.point1 = point1
        this.cPoint0 = new Point()
        this.cPoint0.setPosition(0.3 * (point1.x - point0.x), 0.3 * (point1.y - point0.y))
        this.cPoint1 = new Point()
        this.cPoint1.setPosition(0.3 * (point0.x - point1.x), 0.3 * (point0.y - point1.y))
    }

    getX(t0) {
        const x0 = this.point0.x
        const x3 = this.point1.x
        const x1 = x0 + this.cPoint0.x
        const x2 = x3 + this.cPoint1.x

        const t1 = 1.0 - t0

        return t1 * t1 * (t1 * x0 + 3.0 * t0 * x1) + t0 * t0 * (3.0 * t1 * x2 + t0 * x3)
    }

    getY(t0) {
        const y0 = this.point0.y
        const y3 = this.point1.y
        const y1 = y0 + this.cPoint0.y
        const y2 = y3 + this.cPoint1.y

        const t1 = 1.0 - t0

        return t1 * t1 * (t1 * y0 + 3.0 * t0 * y1) + t0 * t0 * (3.0 * t1 * y2 + t0 * y3)
    }

    draw() {
        const x0 = xToScreen(this.point0.x)
        const y0 = yToScreen(this.point0.y)
        const x1 = xToScreen(this.point1.x)
        const y1 = yToScreen(this.point1.y)
        const cx0 = xToScreen(this.point0.x + this.cPoint0.x)
        const cy0 = yToScreen(this.point0.y + this.cPoint0.y)
        const cx1 = xToScreen(this.point1.x + this.cPoint1.x)
        const cy1 = yToScreen(this.point1.y + this.cPoint1.y)

        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.bezierCurveTo(cx0, cy0, cx1, cy1, x1, y1)
        ctx.stroke()

        ctx.strokeStyle = settings.cPoint.color
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(cx0, cy0)
        ctx.moveTo(x1, y1)
        ctx.lineTo(cx1, cy1)
        ctx.stroke()

        drawShape(cx0, cy0, settings.cPoint)
        drawShape(cx1, cy1, settings.cPoint)

        for(let t = 0; t <= 1.0; t += 0.25) {
            drawShape(xToScreen(this.getX(t)), yToScreen(this.getY(t)), settings.cPoint)
        }

        if(pathPartUnderCursor !== this) return

        const x = controlPointUnderCursorIndex === 0 ? cx0 : cx1
        const y = controlPointUnderCursorIndex === 0 ? cy0 : cy1
        drawDashedRegion( x - 6, y - 6, 12, 12, true)
    }
}

export class Path {
    firstPart
    lastPart

    add(part) {
        if(this.firstPart === undefined) {
            this.firstPart = part
            this.lastPart = part
        } else {
            this.lastPart.nextPart = part
            part.prevPart = this.lastPart
            this.lastPart = part
        }
    }

    draw() {
        let part = this.firstPart
        while(part !== undefined) {
            part.draw()
            part = part.nextPart
        }
    }

}

function distanceToMouse(point, cPoint) {
    return distToScreen(dist(point.x + cPoint.x - mouse.x, point.y + cPoint.y - mouse.y))
}

export function findControlPoint(diameter) {
    for(pathUnderCursor of paths) {
        pathPartUnderCursor = pathUnderCursor.firstPart
        while(pathPartUnderCursor !== undefined) {
            if(distanceToMouse(pathPartUnderCursor.point0, pathPartUnderCursor.cPoint0) <= diameter) {
                controlPointUnderCursorIndex = 0
                return
            }
            if(distanceToMouse(pathPartUnderCursor.point1, pathPartUnderCursor.cPoint1) <= diameter) {
                controlPointUnderCursorIndex = 1
                return
            }
            pathPartUnderCursor = pathPartUnderCursor.nextPart
        }
    }
    controlPointUnderCursorIndex = undefined
    pathUnderCursor = undefined
    pathPartUnderCursor = undefined
}
