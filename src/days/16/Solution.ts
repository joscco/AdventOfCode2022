import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {

    distances: { [key: string]: { [key2: string]: number } } = {}

    getFirstExampleSolution(): string {
        return "1651";
    }

    getSecondExampleSolution(): string {
        return "1707";
    }

    solveFirst(input: string): string {
        // Read in values
        let inputList = input.parseRows()
            .map(row => row.split(new RegExp("; (?:tunnels lead|tunnel leads) to (?:valve|valves) ")))
            .map(splitRow => [splitRow[0].substring(6, 8), splitRow[0].substring(23), splitRow[1]])

        for (let inp of inputList) {
            this.distances[inp[0]] = {}
            this.distances[inp[0]][inp[0]] = 0

            for (let neighbor of inp[2].split(", ")) {
                this.distances[inp[0]][neighbor] = 1
            }
        }

        // Read in Map of non-null valves
        let valves: string[] = inputList
            .map(row => row[0])

        let valveMap: { [key: string]: number } = {}
        for (let value of inputList) {
            valveMap[value[0]] = parseInt(value[1])
        }

        let nonNullValves: string[] = inputList
            .filter(row => parseInt(row[1]) !== 0)
            .map(row => row[0])


        // Construct map of the shortest paths between those
        for (let nodeI of valves) {
            for (let nodeJ of valves) {
                for (let nodeK of valves) {
                    this.distances[nodeI][nodeJ] = Math.min(this.distances[nodeI][nodeJ] ?? 99, (this.distances[nodeI][nodeK] ?? 99) + (this.distances[nodeK][nodeJ] ?? 99))
                }
            }
        }

        return this.calculatePressureLoss("AA", 30, nonNullValves, valveMap, false).toString()
    }

    solveSecond(input: string): string {
        // Read in values
        let inputList = input.parseRows()
            .map(row => row.split(new RegExp("; (?:tunnels lead|tunnel leads) to (?:valve|valves) ")))
            .map(splitRow => [splitRow[0].substring(6, 8), splitRow[0].substring(23), splitRow[1]])

        for (let inp of inputList) {
            this.distances[inp[0]] = {}
            this.distances[inp[0]][inp[0]] = 0

            for (let neighbor of inp[2].split(", ")) {
                this.distances[inp[0]][neighbor] = 1
            }
        }

        // Read in Map of non-null valves
        let valves: string[] = inputList
            .map(row => row[0])

        let valveMap: { [key: string]: number } = {}
        for (let value of inputList) {
            valveMap[value[0]] = parseInt(value[1])
        }

        let nonNullValves: string[] = inputList
            .filter(row => parseInt(row[1]) !== 0)
            .map(row => row[0])


        // Construct map of the shortest paths between those
        for (let nodeI of valves) {
            for (let nodeJ of valves) {
                for (let nodeK of valves) {
                    this.distances[nodeI][nodeJ] = Math.min(this.distances[nodeI][nodeJ] ?? 99, (this.distances[nodeI][nodeK] ?? 99) + (this.distances[nodeK][nodeJ] ?? 99))
                }
            }
        }

        return this.calculatePressureLoss("AA", 26, nonNullValves, valveMap, true).toString()
    }

    calculatePressureLoss(i: string, t: number, remaining: string[], valveMap: {[key: string]: number}, hasHelp: boolean): number {
        // The initial result will only come through once. So always act as if the elephant now has to deal with the rest
        // The elephant starts in "AA" EVERY TIME!!
        let result = hasHelp ? this.calculatePressureLoss("AA", 26, remaining, valveMap, false) : 0
        for (let j of remaining) {
            let nextT = t - this.distances[i][j] - 1
            if (nextT >= 0) {
                let nextRemaining = remaining.filter(el => el !== j)
                result = Math.max(result, valveMap[j] * nextT + this.calculatePressureLoss(j, nextT, nextRemaining, valveMap, hasHelp))
            }
        }

        return result
    }
}