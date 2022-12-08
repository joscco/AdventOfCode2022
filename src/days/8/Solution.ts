import {AbstractSolution} from "../../types/AbstractSolution";
import {ORDER_NATURAL} from "../../types/Array";

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

        let topVisible: string[] = []
        for (let j = 0; j < field[0].length; j++) {
            let currentHighest = -1
            for (let i = 0; i < field.length; i++) {
                if (field[i][j] > currentHighest) {
                    currentHighest = field[i][j]
                    topVisible.push(`${i}_${j}`)
                }
            }
        }

        let bottomVisible: string[] = []
        for (let j = 0; j < field[0].length; j++) {
            let currentHighest = -1
            for (let i = field.length - 1; i >= 0; i--) {
                if (field[i][j] > currentHighest) {
                    currentHighest = field[i][j]
                    bottomVisible.push(`${i}_${j}`)
                }
            }
        }

        let leftVisible: string[] = []
        for (let i = 0; i < field.length; i++) {
            let currentHighest = -1
            for (let j = 0; j < field[0].length; j++) {
                if (field[i][j] > currentHighest) {
                    currentHighest = field[i][j]
                    leftVisible.push(`${i}_${j}`)
                }
            }
        }

        let rightVisible: string[] = []
        for (let i = 0; i < field.length; i++) {
            let currentHighest = -1
            for (let j = field[0].length - 1; j >= 0; j--) {
                if (field[i][j] > currentHighest) {
                    currentHighest = field[i][j]
                    rightVisible.push(`${i}_${j}`)
                }
            }
        }

        return new Set([...topVisible, ...bottomVisible, ...leftVisible, ...rightVisible]).size.toString()
    }

    makeEmptyArr(length: number): any[][] {
        let result = []
        for (let i = 0; i < length; i++) {
            result.push([])
        }
        return result
    }

    solveSecond(input: string): string {
        let field = input.parseRows()
            .map(line => line.split("").parseInt())

        let topScenicScores: number[][] = this.makeEmptyArr(field.length)
        for (let j = 0; j < field[0].length; j++) {
            for (let i = 0; i < field.length; i++) {
                topScenicScores[i][j] = 0
                for (let k = i + 1; k < field.length; k++) {
                    topScenicScores[i][j] = topScenicScores[i][j] + 1
                    if (field[k][j] >= field[i][j]) {
                        break
                    }
                }
            }
        }

        let bottomScenicScores: number[][] = this.makeEmptyArr(field.length)
        for (let j = 0; j < field[0].length; j++) {
            for (let i = field.length - 1; i >= 0; i--) {
                bottomScenicScores[i][j] = 0
                for (let k = i - 1; k >= 0; k--) {
                    bottomScenicScores[i][j] = bottomScenicScores[i][j] + 1
                    if (field[k][j] >= field[i][j]) {
                        break
                    }
                }
            }
        }

        let leftScenicScores: number[][] = this.makeEmptyArr(field.length)
        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[0].length; j++) {
                leftScenicScores[i][j] = 0
                for (let k = j+1; k < field[0].length; k++) {
                    leftScenicScores[i][j] = leftScenicScores[i][j] + 1
                    if (field[i][k] >= field[i][j]) {
                        break
                    }
                }
            }
        }

        let rightScenicScores: number[][] = this.makeEmptyArr(field.length)
        for (let i = 0; i < field.length; i++) {
            for (let j = field[0].length - 1; j >= 0; j--) {
                rightScenicScores[i][j] = 0
                for (let k = j - 1; k >= 0; k--) {
                    rightScenicScores[i][j] = rightScenicScores[i][j] + 1
                    if (field[i][k] >= field[i][j]) {
                       break
                    }
                }
            }
        }


        return this.fieldMultiply(topScenicScores, bottomScenicScores, leftScenicScores, rightScenicScores)
            .flatMap(val => val)
            .max(ORDER_NATURAL)
            .toString()
    }

    private fieldMultiply(...a: number[][][]): number[][] {
        let result = this.makeEmptyArr(a[0].length)
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
}