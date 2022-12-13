import {AbstractSolution} from "../../types/AbstractSolution";
import {ORDER_NATURAL} from "../../types/Array";

export class Solution extends AbstractSolution {

    field: string[][] = []

    getFirstExampleSolution(): string {
        return "31";
    }

    getSecondExampleSolution(): string {
        return "29";
    }

    solveFirst(input: string): string {
        this.field = input.parseRows().map(row => row.split(""))
        let startIndex: number[] = []
        let endIndex: number[] = []
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[i].length; j++) {
                if (this.field[i][j] === "S") {
                    startIndex = [i, j]
                }
                if (this.field[i][j] === "E") {
                    endIndex = [i, j]
                }
            }
        }
        return `${this.getShortestPathLength(startIndex, endIndex)!.length - 1}`
    }

    solveSecond(input: string): string {
        this.field = input.parseRows().map(row => row.split(""))
        let startIndices: number[][] = []
        let endIndex: number[] = []
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[i].length; j++) {
                if (this.field[i][j] === "a" || this.field[i][j] === "S") {
                    startIndices.push([i, j])
                }
                if (this.field[i][j] === "E") {
                    endIndex = [i, j]
                }
            }
        }

        return startIndices
            .map(start => this.getShortestPathLength(start, endIndex))
            .map(a => a ? a.length - 1 : 999)
            .sort((a, b) => b - a)
            .min(ORDER_NATURAL).toString()
    }

    private reconstructPath(cameFrom: Map<string, number[]>, end: number[]): number[][] {
        let total_path = []
        let current: number[] = end
        while (current) {
            total_path.push(current)
            current = cameFrom.get(current[0] + "_" + current[1])!
        }

        return total_path
    }

    private aStar(startIndex: number[], goalIndex: number[], h: (index: number[]) => number): number[][] | undefined {
        let scores = new Map<string, number>()
        let openSet: number[][] = [startIndex]
        let cameFrom = new Map<string, number[]>()

        let score = ((index: number[]) => scores.has(index[0] + "_" + index[1]) ? scores.get(index[0] + "_" + index[1])! : 9999)
        scores.set(startIndex[0] + "_" + startIndex[1], 0)

        while (openSet.length > 0) {
            openSet = openSet.sort((a, b) => score(a) - score(b))
            let current = openSet[0]
            if (current[0] === goalIndex[0] && current[1] === goalIndex[1]) {
                return this.reconstructPath(cameFrom, current)
            }

            openSet = openSet.slice(1)
            for (let neighborIndex of this.getNeighborIndices(current)) {
                let tentative_gScore = score(current) + 1
                if (tentative_gScore < score(neighborIndex)) {
                    // This path to neighbor is better than any previous one. Record it!
                    cameFrom.set(neighborIndex[0] + "_" + neighborIndex[1], current)
                    scores.set(neighborIndex[0] + "_" + neighborIndex[1], tentative_gScore)
                    if (!openSet.find(el => el[0] === neighborIndex[0] && el[1] === neighborIndex[1])) {
                        openSet.push(neighborIndex)
                    }
                }
            }
        }

        // Open set is empty but goal was never reached
        return undefined
    }

    private getShortestPathLength(startIndex: number[], endIndex: number[]): number[][] | undefined {
        return this.aStar(startIndex, endIndex, (index) => 1)
    }

    private getHeight(value: string) {
        if (value === "S") {
            return 0
        }
        if (value === "E") {
            return 26
        }
        return value.charCodeAt(0) - "a".charCodeAt(0)
    }

    private getNeighborIndices(current: number[],): number[][] {
        let i: number = current[0]
        let j: number = current[1]
        let currentHeight: number = this.getHeight(this.field[i][j])
        let rawNeighbors: number[][] = [
            [i - 1, j],
            [i + 1, j],
            [i, j - 1],
            [i, j + 1]
        ]
        rawNeighbors = rawNeighbors
            .filter(index => index[0] < this.field.length && index[0] >= 0 && index[1] < this.field[0].length && index[1] >= 0)
        return rawNeighbors.filter(index => this.getHeight(this.field[index[0]][index[1]]) - currentHeight <= 1)
    }
}