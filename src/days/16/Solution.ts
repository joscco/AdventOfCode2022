import {AbstractSolution} from "../../types/AbstractSolution";

type DistanceMap = { [fromValve: string]: { [toValve: string]: number } }
type ValveMap = { [valve: string]: number }

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "1651";
    }

    getSecondExampleSolution(): string {
        return "1707";
    }

    solveFirst(input: string): string {
        let {distances, valveMap, nonNullValves} = this.constructValveMap(input);
        return this.getMaxPressureLoss("AA", 30, distances, nonNullValves, valveMap, false).toString()
    }

    solveSecond(input: string): string {
        let {distances, valveMap, nonNullValves} = this.constructValveMap(input);
        return this.getMaxPressureLoss("AA", 26, distances, nonNullValves, valveMap, true).toString()
    }

    private constructValveMap(input: string) {
        // Read in values
        let inputList = input.parseRows()
            .map(row => row.split(/; (?:tunnels lead|tunnel leads) to (?:valve|valves) /))
            .map(splitRow => [splitRow[0].substring(6, 8), splitRow[0].substring(23), splitRow[1]])

        // Generate a list of all valves
        let valves: string[] = inputList
            .map(row => row[0])

        // Build shortest distances Map for all valves
        let distances: DistanceMap = {}

        for (let inp of inputList) {
            distances[inp[0]] = {}
            distances[inp[0]][inp[0]] = 0

            for (let neighbor of inp[2].split(", ")) {
                distances[inp[0]][neighbor] = 1
            }
        }

        // Construct map of the shortest paths between all valves
        for (let fromValve of valves) {
            for (let toValve of valves) {
                for (let betweenValve of valves) {
                    distances[fromValve][toValve] = Math.min(
                        distances[fromValve][toValve] ?? 99,
                        (distances[fromValve][betweenValve] ?? 99) + (distances[betweenValve][toValve] ?? 99)
                    )
                }
            }
        }

        // Set up map which maps valve to pressure loss
        let valveMap: { [key: string]: number } = {}
        for (let valveTuple of inputList) {
            valveMap[valveTuple[0]] = parseInt(valveTuple[1])
        }

        // Read in Map of non-null valves
        let nonNullValves: string[] = inputList
            .filter(row => parseInt(row[1]) !== 0)
            .map(row => row[0])

        return {distances, valveMap, nonNullValves};
    }

    getMaxPressureLoss(currentValve: string, time: number, distances: DistanceMap, remainingValves: string[], valveToOutlet: ValveMap, hasHelp: boolean): number {
        // The initial result will only come through once. So always act as if the elephant now has to deal with the rest
        // The elephant starts in "AA" every time as well!!
        let result = hasHelp ? this.getMaxPressureLoss("AA", 26, distances, remainingValves, valveToOutlet, false) : 0
        for (let nextValve of remainingValves) {
            let nextTime = time - distances[currentValve][nextValve] - 1
            if (nextTime >= 0) {
                let nextRemainingValves = remainingValves.filter(valve => valve !== nextValve)
                result = Math.max(
                    result,
                    valveToOutlet[nextValve] * nextTime + this.getMaxPressureLoss(nextValve, nextTime, distances, nextRemainingValves, valveToOutlet, hasHelp)
                )
            }
        }

        return result
    }
}