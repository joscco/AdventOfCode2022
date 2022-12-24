import {AbstractSolution} from "../../types/AbstractSolution";
import {ORDER_NATURAL} from "../../types/Array";

const NORTHS = [[-1, -1], [-1, 0], [-1, 1]]
const SOUTHS = [[1, -1], [1, 0], [1, 1]]
const WESTS = [[-1, -1], [0, -1], [1, -1]]
const EASTS = [[-1, 1], [0, 1], [1, 1]]
const DIRECTIONS = [...NORTHS, ...SOUTHS, ...WESTS, ...EASTS]

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "110";
    }

    getSecondExampleSolution(): string {
        return "20";
    }

    solveFirst(input: string): string {
        return this.getFreeSpotsOfSmallestRectangle(input.parseRows(), 10).toString()
    }

    solveSecond(input: string, testMode: boolean): string {
        // Incredibly slow, I will try to refactor later
        return this.findFirstRoundWithoutMoving(input.parseRows()).toString()
    }


    private getFreeSpotsOfSmallestRectangle(lines: String[], rounds: number): number {
        let elves: number[][] = []

        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines[0].length; j++) {
                if (lines[i][j] === "#") {
                    elves.push([i, j])
                }
            }
        }

        let directions = [NORTHS, SOUTHS, WESTS, EASTS]
        for (let round = 0; round < rounds; round++) {
            //console.log(this.printBoard(elves))
            let suggestions = this.findNextSuggestions(directions, elves)
            suggestions = this.filterDuplicates(suggestions)
            for (let suggestion of suggestions) {
                elves[suggestion[0]] = [suggestion[1], suggestion[2]]
            }
            directions = directions.rotate(-1)
        }

        let minY = elves.map(elv => elv[0]).min(ORDER_NATURAL)
        let minX = elves.map(elv => elv[1]).min(ORDER_NATURAL)
        let maxY = elves.map(elv => elv[0]).max(ORDER_NATURAL)
        let maxX = elves.map(elv => elv[1]).max(ORDER_NATURAL)
        return (maxX - minX + 1) * (maxY - minY + 1) - elves.length
    }

    private findFirstRoundWithoutMoving(lines: String[]): number {
        let elves: number[][] = []
        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines[0].length; j++) {
                if (lines[i][j] === "#") {
                    elves.push([i, j])
                }
            }
        }

        let round = 0
        let directions = [NORTHS, SOUTHS, WESTS, EASTS]
        while (true) {
            let suggestions = this.findNextSuggestions(directions, elves)
            suggestions = this.filterDuplicates(suggestions)
            if (suggestions.length > 0) {
                if(round % 20 === 0) {
                    console.log(round, suggestions.length, elves.length)
                }
                for (let suggestion of suggestions) {
                    elves[suggestion[0]] = [suggestion[1], suggestion[2]]
                }
                directions = directions.rotate(-1)
                round++
            } else {
                return round + 1
            }


            // if (elves.map((val, i) => suggestions[i][0] === val[0] && suggestions[i][1] === val[1]).count(false) === 0) {
            //     return round + 1
            // } else {
            //     elves = suggestions
            //     round++
            // }
        }

        return -1
    }

    private findNextSuggestions(directions: number[][][], elves: number[][]): number[][] {
        let suggestions: number[][] = []
        for (let index in elves) {
            let x = elves[index][1]
            let y = elves[index][0]

            if (!this.hasAnyOf(elves, this.addMultiTuple([y, x], DIRECTIONS))) {
                continue
            }

            for (let direction of directions) {
                if (this.hasAnyOf(elves, this.addMultiTuple([y, x], direction))) {
                    continue
                }
                suggestions.push([parseInt(index), ...this.addTuple([y, x], direction[1])])
                break
            }
        }
        return suggestions
    }

    private addTuple(a: number[], b: number[]): number[] {
        return [a[0] + b[0], a[1] + b[1]]
    }

    private addMultiTuple(a: number[], b: number[][]): number[][] {
        return b.map(el => this.addTuple(a, el))
    }

    private hasAnyOf(elves: number[][], elements: number[][]) {
        for (let i = 0; i < elves.length; i++) {
            if (this.arrContains(elements, elves[i])) {
                return true
            }
        }
        return false
    }

    private arrContains(arr: number[][], val: number[]) {
        for (let i = 0; i < arr.length; i++) {
            if (val[0] === arr[i][0] && val[1] === arr[i][1]) {
                return true
            }
        }
        return false
    }

    private printBoard(elves: number[][]) {
        let result = ""
        for (let i = -10; i < 20; i++) {
            let row = ""
            for (let j = -10; j < 20; j++) {
                row += this.arrContains(elves, [i, j]) ? "#" : "."
            }
            result += row + "\n"
        }
        return result
    }

    private filterDuplicates(suggestions: number[][]): number[][] {
        let suggestionSet: string[] = []
        let badBoys: Set<string> = new Set()
        for (let suggestion of suggestions) {
            if (suggestionSet.contains(`${suggestion[1]}_${suggestion[2]}`)) {
                badBoys.add(`${suggestion[1]}_${suggestion[2]}`)
            } else {
                suggestionSet.push(`${suggestion[1]}_${suggestion[2]}`)
            }
        }
        let badIndices: string[] = Array.from(badBoys)
        return suggestions.filter(val => !badIndices.contains(`${val[1]}_${val[2]}`));
    }
}