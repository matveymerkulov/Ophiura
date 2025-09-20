// noinspection DuplicatedCode

import {project, world} from "../Furca/src/project.js"
import {ctx, currentCanvas, distToScreen, xToScreen, yToScreen} from "../Furca/src/canvas.js"
import {defaultCanvas, mouse} from "../Furca/src/system.js"
import {Key} from "../Furca/src/key.js"
import {Pivot} from "../Furca/src/pivot.js"
import {drawArrow, drawDashedRegion, drawShape} from "./draw.js"
import {dist, rad} from "../Furca/src/functions.js"
import MovePoint from "./move_point.js"

// settings

const settings = {
    pivot: {
        type: "o",
        color: "white",
        size: 4,
        diameter: 7,
        outline: {
            color: "black",
            size: 7,
        },
        arrow: {
            lineWidth: 2,
            pointerLength: 9,
            angle: rad(150),
        }
    }
}

// keys

export const newPivotKey = new Key("KeyP")
export const movePivotKey = new Key("LMB")

// init

export let objectUnderCursor

project.init = function() {
    defaultCanvas()
    currentCanvas.background = "rgb(9, 44, 84)"
    //currentCanvas.setZoom(-19)
    //currentCanvas.add(new Pan(), panKey)
    //currentCanvas.add(new Zoom(zoomInKey, zoomOutKey))
    currentCanvas.add(new MovePoint(), movePivotKey)

    project.update = function() {
        currentCanvas.updateNode()

        objectUnderCursor = undefined
        for(let object of world.items) {
            if(object instanceof Pivot) {
                if(distToScreen(dist(object.x - mouse.x, object.y - mouse.y)) <= settings.pivot.diameter) {
                    objectUnderCursor = object
                }
            }
        }

        if(newPivotKey.wasPressed) {
            world.add(new Pivot(mouse.x, mouse.y))
        }
    }

    currentCanvas.render = function() {
        for(let object of world.items) {
            object.draw()
            if(object instanceof Pivot) {
                const x = xToScreen(object.x)
                const y = yToScreen(object.y)
                drawShape(x, y, settings.pivot)

                if(objectUnderCursor === object) {
                    drawDashedRegion(x - 6, y - 6, 12, 12, true)
                }
            }
        }
    }
}