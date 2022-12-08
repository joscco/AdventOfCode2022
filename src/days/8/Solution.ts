import {AbstractSolution} from "../../types/AbstractSolution";
import {makeEmpty2DArray, ORDER_NATURAL} from "../../types/Array";

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "21";
    }

    getSecondExampleSolution(): string {
        return "8";
    }

    solveFirst(input: string): string {
        let field = input.parseRows()
            .map(line => line.split("").parseInt())

        let leftVisible: string[] = this.getVisibleIndices(field, false, false)
        let rightVisible: string[] = this.getVisibleIndices(field, false, true)
        let topVisible: string[] = this.getVisibleIndices(field, true, false)
        let bottomVisible: string[] = this.getVisibleIndices(field, true, true)

        return new Set([...topVisible, ...bottomVisible, ...leftVisible, ...rightVisible]).size.toString()
    }

    solveSecond(input: string): string {
        let field = input.parseRows()
            .map(line => line.split("").parseInt())

        let leftScenicScores = this.getScenicScores(field, false, false)
        let rightScenicScores = this.getScenicScores(field, false, true)
        let topScenicScores = this.getScenicScores(field, true, false)
        let bottomScenicScores = this.getScenicScores(field, true, true)

        return this.fieldMultiply(topScenicScores, bottomScenicScores, leftScenicScores, rightScenicScores)
            .flatMap(val => val)
            .max(ORDER_NATURAL)
            .toString()
    }

    private fieldMultiply(...a: number[][][]): number[][] {
        let result = makeEmpty2DArray(a[0].length)
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < a[0][0].length; j++) {
                result[i][j] = 1
                for (let table of a) {
                    result[i][j] *= table[i][j]
                }
            }
        }
        return result
    }

    getScenicScores(field: number[][], vertical: boolean, reverse: boolean): number[][] {
        let scenicScores: number[][] = makeEmpty2DArray(field.length)

        let helpField = field

        if (vertical) {
            helpField = helpField.getColumns()
        }

        if (reverse) {
            helpField = helpField.map(row => row.reverse())
        }

        for (let i = 0; i < helpField.length; i++) {
            for (let j = 0; j < helpField[0].length; j++) {
                let [outerIndex, innerIndex] = vertical ? [j, i] : [i, j]
                if (reverse) {
                    if (vertical) {
                        // Bottom View
                        outerIndex = helpField.length - 1 - j
                    } else {
                        // Right View
                        innerIndex = helpField[0].length - 1 - j
                    }
                }

                scenicScores[outerIndex][innerIndex] = 0
                for (let k = j + 1; k < helpField[0].length; k++) {
                    scenicScores[outerIndex][innerIndex] = scenicScores[outerIndex][innerIndex] + 1
                    if (helpField[i][k] >= helpField[i][j]) {
                        break
                    }
                }
            }
        }

        return scenicScores
    }

    getVisibleIndices(field: number[][], vertical: boolean, reverse: boolean): string[] {
        let visibleIndices: string[] = []

        let helpField = field
        if (vertical) {
            helpField = helpField.getColumns()
        }
        if (reverse) {
            helpField = helpField.map(row => row.reverse())
        }

        for (let i = 0; i < helpField.length; i++) {
            let currentHighest = -1
            for (let j = 0; j < helpField[0].length; j++) {
                let [outerIndex, innerIndex] = vertical ? [j, i] : [i, j]
                if (reverse) {
                    if (vertical) {
                        // Bottom View
                        outerIndex = helpField.length - 1 - j
                    } else {
                        // Right View
                        innerIndex = helpField[0].length - 1 - j
                    }
                }

                if (helpField[i][j] > currentHighest) {
                    currentHighest = helpField[i][j]
                    visibleIndices.push(`${outerIndex}_${innerIndex}`)
                }
            }
        }

        return visibleIndices
    }
}