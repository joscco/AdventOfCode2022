import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "18";
    }

    getSecondExampleSolution(): string {
        return "54";
    }

    solveFirst(input: string): string {
        let field = this.parseField(input)
        let height = field.length
        let width = field[0].length
        return this.getShortestPath(field, [0, 1], [height - 1, width - 2], 0).toString()
    }

    solveSecond(input: string, testMode: boolean): string {
        let field = this.parseField(input)
        let height = field.length
        let width = field[0].length
        let time0 = this.getShortestPath(field, [0, 1], [height - 1, width - 2], 0)
        let time1 = this.getShortestPath(field, [height - 1, width - 2], [0, 1], time0)
        let time2 = this.getShortestPath(field, [0, 1], [height - 1, width - 2], time1)
        return time2.toString()
    }

    private parseField(input: String): String[][] {
        return input.parseRows()
            .map(row => row.split(""))
    }

    private getShortestPath(field: String[][], start: number[], end: number[], time: number): number {
        let visited = new Set<string>()
        let toBeVisited: number[][] = [[...start, time]]

        while (toBeVisited.length > 0) {
            let next = toBeVisited.shift()!
            let stringID = `${next[0]}_${next[1]}_${next[2]}`
            if (visited.has(stringID)) {
                continue
            }
            visited.add(stringID)

            if (this.arrEquals([next[0], next[1]], end)) {
                return next[2]
            }

            let possibleNext = this.getPossibleNextPositions(field, next[2] + 1, [next[0], next[1]])
            for (let neighbor of possibleNext) {
                if (!this.arrContains(toBeVisited, [...neighbor, next[2] + 1])) {
                    toBeVisited.push([...neighbor, next[2] + 1])
                }
            }
        }
        return -1
    }

    private hasNoBlizzard(initialField: String[][], time: number, index: number[]): boolean {
        let fieldHeight = initialField.length
        let fieldWidth = initialField[0].length
        return this.arrEquals(index, [0, 1])
            || this.arrEquals(index, [fieldHeight - 1, fieldWidth - 2])
            || !(
                initialField[index[0]][this.wrap(index[1] + time % (fieldWidth - 2), fieldWidth)] === "<"
                || initialField[index[0]][this.wrap(index[1] - time % (fieldWidth - 2), fieldWidth)] === ">"
                || initialField[this.wrap(index[0] + time % (fieldHeight - 2), fieldHeight)][index[1]] === "^"
                || initialField[this.wrap(index[0] - time % (fieldHeight - 2), fieldHeight)][index[1]] === "v"
            )
    }

    wrap(newVal: number, length: number): number {
        return ((newVal - 1 + length - 2) % (length - 2)) + 1
    }

    private getPossibleNextPositions(field: String[][], time: number, position: number[]): number[][] {
        let possible = this.arrMultiAdd([[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1]], position)
        return possible.filter(val => this.isPossibleFieldPosition(field, val) && this.hasNoBlizzard(field, time, val))
    }

    private arrAdd(a: number[], b: number[]): number[] {
        return [a[0] + b[0], a[1] + b[1]]
    }

    private arrMultiAdd(a: number[][], b: number[]): number[][] {
        return a.map(el => this.arrAdd(el, b))
    }

    private arrEquals(a: number[], b: number[]): boolean {
        return a[0] === b[0] && a[1] === b[1]
    }

    private isPossibleFieldPosition(field: String[][], val: number[]) {
        return this.arrEquals(val, [0, 1])
            || this.arrEquals(val, [field.length - 1, field[0].length - 2])
            || (1 <= val[0] && val[0] <= field.length - 2 && 1 <= val[1] && val[1] <= field[0].length - 2)
    }

    private arrContains(arr: number[][], ell: number[]): boolean {
        for (let el of arr) {
            if (el[0] === ell[0] && el[1] === ell[1]) {
                return true
            }
        }
        return false
    }
}