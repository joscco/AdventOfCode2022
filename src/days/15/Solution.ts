import {AbstractSolution} from "../../types/AbstractSolution";
import {ORDER_NATURAL} from "../../types/Array";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "26";
    }

    getSecondExampleSolution(): string {
        return "56000011";
    }

    solveSecond(input: string, testMode: boolean): string {
        let numbers: number[][] = input.parseRows()
            .map(line => line
                .split(": closest beacon is at ")
                .map(half => half.split(", ")))
            .map(entries => [entries[0][0].substring(12), entries[0][1].substring(2), entries[1][0].substring(2), entries[1][1].substring(2)])
            .map(row => row.map(val => parseInt(val)))

        let lineLimit = testMode ? 20 : 4000000
        for (let row = 0; row <= lineLimit; row++) {
            let knownIntervals: number[][] = []
            numbers.map(fours => {
                let distance = this.getManhattenDistance(fours)
                let offset = distance - Math.abs(row - fours[1])

                if (offset >= 0) {
                    knownIntervals.push([fours[0] - offset, fours[0] + offset])
                }
            })

            // Now shorten intervals to at most two big ones
            knownIntervals = knownIntervals.sort((a, b) => a[0] - b[0])


            let bigIntervalls: number[][] = []
            knownIntervals.map(interval => {
                if (bigIntervalls.length === 0) {
                    bigIntervalls.push(interval)
                } else {
                    bigIntervalls = this.unionIntervalls(bigIntervalls, interval)
                }
            })

            let x = 0
            for (let interval of bigIntervalls) {
                if (x < interval[0]) {
                    let result = 4000000 * x + row
                    return result.toString()
                } else {
                    x = interval[1] + 1
                }
            }

        }

        return "bla"
    }

    solveFirst(input: string, test: boolean): string {
        let numbers: number[][] = input.parseRows()
            .map(line => line
                .split(": closest beacon is at ")
                .map(half => half.split(", ")))
            .map(entries => [entries[0][0].substring(12), entries[0][1].substring(2), entries[1][0].substring(2), entries[1][1].substring(2)])
            .map(row => row.map(val => parseInt(val)))

            let noBeaconIntervals: Set<string> = new Set()
            let beacons: Set<string> = new Set()
            numbers.map(fours => {
                beacons.add([fours[2], fours[3]].toString())
                let distance = this.getManhattenDistance(fours)
                let fixedY = test ? 10 : 2000000
                if (Math.abs(fixedY - fours[1]) <= distance) {
                    for (let i = 0; i <= distance - Math.abs(fixedY - fours[1]); i++) {
                        if (!beacons.has([fours[0] + i, fixedY].toString())) {
                            noBeaconIntervals.add([fours[0] + i, fixedY].toString())
                        }
                        if (!beacons.has([fours[0] - i, fixedY].toString())) {
                            noBeaconIntervals.add([fours[0] - i, fixedY].toString())
                        }
                    }
                }

            })

        return noBeaconIntervals.size.toString()
    }

    private getManhattenDistance([x1, y1, x2, y2]: number[]): number {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2)
    }

    private unionIntervalls(bigIntervalls: number[][], interval: number[]): number[][] {
        let intersectingIntervals: number[][] = [interval]
        let newIntervals: number[][] = []
        for (let bigInterval of bigIntervalls) {
            if (this.intersectingIntervals(bigInterval, interval)) {
                intersectingIntervals.push(bigInterval)
            } else {
                newIntervals.push(bigInterval)
            }
        }

        newIntervals.push(this.mergeIntervals(intersectingIntervals))
        return newIntervals
    }

    private intersectingIntervals(first: number[], second: number[]): boolean {
        return (first[0] <= second[1] && first[1] >= second[0]) || (second[0] <= first[1] && second[1] >= first[0])
    }

    private mergeIntervals(intersectingIntervals: number[][]) {
        let minX = intersectingIntervals.map(int => int[0]).min(ORDER_NATURAL)
        let maxX = intersectingIntervals.map(int => int[1]).max(ORDER_NATURAL)
        return [minX, maxX];
    }
}