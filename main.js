// noinspection DuplicatedCode

import {project, world} from "../Furca/src/project.js"
import {ctx, currentCanvas, distToScreen, xToScreen, yToScreen} from "../Furca/src/canvas.js"
import {defaultCanvas, mouse} from "../Furca/src/system.js"
import {Key} from "../Furca/src/key.js"
import {Pivot} from "../Furca/src/pivot.js"
import {drawArrow, drawDashedRegion, drawShape} from "./draw.js"
import {dist, rad} from "../Furca/src/functions.js"
import MovePoint from "./move_point.js"
import {Path, PathPart} from "./path.js"

// settings

const settings = {
    pivot: {
        type: "o",
        color: "white",
        size: 5,
        diameter: 7,
        outline: {
            type: "o",
            color: "black",
            size: 7,
        },
    }
}

// keys

export const primaryKey = new Key("LMB")
export const newPivotKey = new Key("KeyP")
export const addToPathKey = new Key("KeyL")
export const removeFromPathKey = new Key("Escape")
export const endPathKey = new Key("KeyE")

// init

export let pivotUnderCursor, currentPath, currentPivot

project.init = function() {
    defaultCanvas()
    currentCanvas.background = "rgb(9, 44, 84)"
    //currentCanvas.setZoom(-19)
    //currentCanvas.add(new Pan(), panKey)
    //currentCanvas.add(new Zoom(zoomInKey, zoomOutKey))
    currentCanvas.add(new MovePoint(), primaryKey)

    project.update = function() {
        currentCanvas.updateNode()

        pivotUnderCursor = undefined
        for(let object of world.items) {
            if(object instanceof Pivot) {
                if(distToScreen(dist(object.x - mouse.x, object.y - mouse.y)) <= settings.pivot.diameter) {
                    pivotUnderCursor = object
                }
            }
        }

        if(newPivotKey.wasPressed) {
            world.add(new Pivot(mouse.x, mouse.y))
        }

        if(addToPathKey.wasPressed && pivotUnderCursor) {
            if(currentPath === undefined) {
                currentPivot = pivotUnderCursor
                currentPath = new Path()
                world.add(currentPath)
            } else {
                currentPath.add(new PathPart(currentPivot, pivotUnderCursor))
                currentPivot = pivotUnderCursor
            }
        }
    }

    currentCanvas.render = function() {
        for(let object of world.items) {
            object.draw()
            if(object instanceof Pivot) {
                const x = xToScreen(object.x)
                const y = yToScreen(object.y)
                drawShape(x, y, settings.pivot)

                if(pivotUnderCursor === object) {
                    drawDashedRegion(x - 6, y - 6, 12, 12, true)
                }
            }
        }
    }
}