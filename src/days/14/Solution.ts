import {AbstractSolution} from "../../types/AbstractSolution";
import {makeEmpty2DArray, ORDER_NATURAL} from "../../types/Array";
import {IDENTITY} from "../../types/General";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "24";
    }

    getSecondExampleSolution(): string {
        return "93";
    }

    solveFirst(input: string): string {
        let {minX, field} = this.initField(input);

        let numberOfGrains: number = 0
        while (true) {
            if (this.simulateSandGrain(field, 0, 500 - minX)) {
                return `${numberOfGrains}`
            }
            numberOfGrains++
        }
    }

    solveSecond(input: string): string {
        let {minX, field} = this.initField(input);

        this.drawLine(field, [[field.length - 1, 0], [field.length - 1, field[0].length]])

        let numberOfGrains: number = 0
        while (!this.positionBlocked(field, [0, 500 - minX])) {
            this.simulateSandGrain(field, 0, 500 - minX)
            numberOfGrains++
        }

        return `${numberOfGrains}`
    }

    private initField(input: string) {
        let tuples: number[][][] = input.parseRows()
            .map(row => row
                .split(" -> ")
                .map(rawTuple => rawTuple.split(",").parseInt())
                .map(tuple => [tuple[1], tuple[0]])
                .slideWindow(2))
            .flatMap(IDENTITY)

        let maxHeight: number = tuples.map(val => [val[0][0], val[1][0]])
            .flatMap(val => val)
            .max(ORDER_NATURAL)

        // All sand grains can at max form a triangle. We can actually ignore all other bricks
        let widthX = 1 + 2 * (maxHeight + 2 + 1)
        let minX = Math.floor(500 - widthX / 2)

        let field: string[][] = makeEmpty2DArray(maxHeight + 3)
            .map(() => Array(widthX).fill("."))

        tuples.map(pair => {
            pair = pair.map(val => [val[0], val[1] - minX])
            this.drawLine(field, pair)
            return pair
        })
        return {minX, field};
    }

    private getRange(start: number, end: number): number[] {
        if (start <= end) {
            return Array.from({length: (end - start + 1)}, (v, k) => k + start);
        }
        return this.getRange(end, start)
    }

    private drawLine(field: string[][], pair: number[][]) {
        let fieldHeight = field.length
        let fieldWidth = field[0].length
        let [y1, x1] = pair[0]
        let [y2, x2] = pair[1]

        if (y1 === y2) {
            for (let x of this.getRange(x1, x2)) {
                if (y1 < fieldHeight && x < fieldWidth) {
                    field[y1][x] = "#"
                }
            }
        } else {
            for (let y of this.getRange(y1, y2)) {
                if (y < fieldHeight && x1 < fieldWidth) {
                    field[y][x1] = "#"
                }
            }
        }
    }

    private positionBlocked(field: string[][], pos: number[]) {
        return field.length > pos[0] && field[0].length > pos[1] && field[pos[0]][pos[1]] !== "."
    }

    private simulateSandGrain(field: string[][], startX: number, startY: number) {
        let lastPos: number[] = [startX, startY]
        let newPos: number[] = [startX, startY]
        for (let i = 0; i < field.length; i++) {
            if (!this.positionBlocked(field, [lastPos[0] + 1, lastPos[1]])) {
                newPos = [lastPos[0] + 1, lastPos[1]]
            } else if (!this.positionBlocked(field, [lastPos[0] + 1, lastPos[1] - 1])) {
                newPos = [lastPos[0] + 1, lastPos[1] - 1]
            } else if (!this.positionBlocked(field, [lastPos[0] + 1, lastPos[1] + 1])) {
                newPos = [lastPos[0] + 1, lastPos[1] + 1]
            }

            if (newPos[0] === lastPos[0] && newPos[1] === lastPos[1]) {
                field[newPos[0]][newPos[1]] = "o"
                return false
            }

            lastPos = newPos
        }
        return true
    }
}