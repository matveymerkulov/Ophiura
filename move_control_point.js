import MovePoint from "./move_point.js"
import {controlPointUnderCursorIndex, pathPartUnderCursor} from "./path.js"
import {currentPathPart} from "./main.js"

export class MoveControlPoint extends MovePoint {
    conditions() {
        return controlPointUnderCursorIndex !== undefined
    }

    getObject() {
        return controlPointUnderCursorIndex === 0 ? pathPartUnderCursor.cPoint0 : pathPartUnderCursor.cPoint1
    }
}