// noinspection DuplicatedCode

import {project, world} from "../Furca/src/project.js"
import {ctx, currentCanvas, distToScreen, xToScreen, yToScreen} from "../Furca/src/canvas.js"
import {defaultCanvas, mouse} from "../Furca/src/system.js"
import {Key} from "../Furca/src/key.js"
import {drawArrow, drawDashedRegion, drawShape} from "./draw.js"
import MovePoint from "./move_point.js"
import {findControlPoint, Path, PathPart} from "./path.js"
import {Point} from "../Furca/src/point.js"
import {MoveControlPoint} from "./move_control_point.js"

// settings

const blackOutline = {
    type: "o",
    color: "black",
    size: 7,
}

export const settings = {
    point: {
        type: "o",
        color: "white",
        size: 5,
        diameter: 7,
        outline: blackOutline,
    },
    currentPoint: {
        type: "o",
        color: "green",
        size: 5,
    },
    cPoint: {
        type: "o",
        color: "lightblue",
        size: 5,
        diameter: 7,
        outline: blackOutline,
    },
    cPointLine: {

    }
}

// keys

export const primaryKey = new Key("LMB")
export const newPointKey = new Key("KeyP")
export const addToPathKey = new Key("KeyL")
export const removeFromPathKey = new Key("Escape")
export const endPathKey = new Key("KeyE")

// init

export let pointUnderCursor, currentPath, currentPoint, currentPathPart, controlPointIndex
export let paths = [], points = []

project.init = function() {
    defaultCanvas()
    currentCanvas.background = "rgb(9, 44, 84)"
    //currentCanvas.setZoom(-19)
    //currentCanvas.add(new Pan(), panKey)
    //currentCanvas.add(new Zoom(zoomInKey, zoomOutKey))
    currentCanvas.add(new MovePoint(), primaryKey)
    currentCanvas.add(new MoveControlPoint(), primaryKey)


    const point0 = new Point(-2, -2)
    const point1 = new Point(2, 2)
    points.push(point0, point1)
    const path0 = new Path()
    path0.add(new PathPart(point0, point1))
    paths.push(path0)


    project.update = function() {
        currentCanvas.updateNode()

        pointUnderCursor = undefined
        for(let point of points) {
            if(distToScreen(point.distanceTo(mouse)) <= settings.point.diameter) {
                pointUnderCursor = point
            }
        }

        findControlPoint(settings.cPoint.diameter)

        if(newPointKey.wasPressed) {
            points.push(new Point(mouse.x, mouse.y))
        }

        if(addToPathKey.wasPressed && pointUnderCursor) {
            if(currentPath === undefined) {
                currentPoint = pointUnderCursor
                currentPath = new Path()
                paths.push(currentPath)
            } else {
                currentPath.add(new PathPart(currentPoint, pointUnderCursor))
                currentPoint = pointUnderCursor
            }
        }
    }

    currentCanvas.render = function() {
        for(let path of paths) {
            path.draw()
        }

        for(let point of points) {
            const x = xToScreen(point.x)
            const y = yToScreen(point.y)
            drawShape(x, y, settings.point)

            if(point === currentPoint) {
                drawShape(x, y, settings.currentPoint)
            }

            if(pointUnderCursor === point) {
                drawDashedRegion(x - 6, y - 6, 12, 12, true)
            }
        }
    }
}