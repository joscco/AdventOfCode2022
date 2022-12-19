import {AbstractSolution} from "../../types/AbstractSolution";

const ROW_REGEX = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./

export class Solution extends AbstractSolution {

    currentMax: number = 0

    getFirstExampleSolution(): string {
        return "33";
    }

    getSecondExampleSolution(): string {
        return `${56 * 62}`;
    }

    solveFirst(input: string): string {
        let blueprints = input.parseRows()
            .map(row => row.match(ROW_REGEX)!)
            .map(row => {
                return {
                    index: parseInt(row[1]),
                    costs: [
                        [parseInt(row[2]), 0, 0, 0],
                        [parseInt(row[3]), 0, 0, 0],
                        [parseInt(row[4]), parseInt(row[5]), 0, 0],
                        [parseInt(row[6]), 0, parseInt(row[7]), 0],
                    ]
                }
            })

        let sum = 0
        for (let i = 0; i < blueprints.length; i++) {
            let score = this.solvy(24, blueprints[i])
            sum += (i + 1) * score
        }

        return sum.toString()
    }

    solveSecond(input: string): string {
        let blueprints = input.parseRows()
            .map(row => row.match(ROW_REGEX)!)
            .map(row => {
                return {
                    index: parseInt(row[1]),
                    costs: [
                        [parseInt(row[2]), 0, 0, 0],
                        [parseInt(row[3]), 0, 0, 0],
                        [parseInt(row[4]), parseInt(row[5]), 0, 0],
                        [parseInt(row[6]), 0, parseInt(row[7]), 0],
                    ]
                }
            })

        let prod = 1
        for (let i = 0; i < Math.min(3, blueprints.length); i++) {
            let score = this.solvy(32, blueprints[i])
            prod *= score
        }

        return prod.toString()
    }

    solvy(time: number, blueprint: { index: number, costs: number[][] }) {
        this.currentMax = 0
        return this.getMaxGeodes(time, blueprint, [1, 0, 0, 0], [0, 0, 0, 0])
    }

    getMaxGeodes(time: number, blueprint: { index: number, costs: number[][] }, robots: number[], inventory: number[]): number {
        let worstEstimate = inventory[3] + robots[3] * time
        this.currentMax = Math.max(worstEstimate, this.currentMax)

        // Little Gauss: 1 + 2 + 3 + ... + n = n * (n+1) / 2
        let bestEstimate = worstEstimate + time * (time + 1) / 2

        if (bestEstimate <= this.currentMax) {
            return worstEstimate
        }

        for (let i = 0; i < 3; i++) {
            let maxUseful = time * Math.max(...blueprint.costs.map(cost => cost[i])) - robots[i] * (time - 1)
            if (inventory[i] > maxUseful) {
                let newInventory: number[] = Object.assign([], inventory)
                newInventory[i] = maxUseful
                return this.getMaxGeodes(time, blueprint, robots, newInventory)
            }
        }

        for (let index = 0; index < blueprint.costs.length; index++) {
            let cost = blueprint.costs[index]
            let needsToEarn = this.arraySub(cost, inventory)
            let timeNeeded = Math.max(...this.arrayOp(needsToEarn, robots, (a, b) => this.timeNeededUntilReached(a, b))) + 1

            if (index < 3 && robots[index] >= Math.max(...blueprint.costs.map(cost => cost[index]))) {
                // We have enough robots of that type. Nothing to do here
                continue
            }

            if (time >= timeNeeded) {
                // We can still do something
                let newInventory = this.arraySub(this.arrayAdd(inventory, this.vectorScalarMultiply(timeNeeded, robots)), cost)
                let newRobots = this.arrayAdd(robots, this.identityVector(index))
                worstEstimate = Math.max(worstEstimate, this.getMaxGeodes(time - timeNeeded, blueprint, newRobots, newInventory))
                this.currentMax = Math.max(worstEstimate, this.currentMax)
            }

        }

        return worstEstimate
    }

    timeNeededUntilReached(cost: number, increase: number): number {
        if (cost === 0) {
            return 0
        }

        if (increase === 0) {
            return 999
        }

        return Math.max(Math.ceil(cost / increase), 0)
    }

    arraySub(first: number[], second: number[]) {
        return this.arrayOp(first, second, (a, b) => a - b)
    }

    arrayAdd(first: number[], second: number[]) {
        return this.arrayOp(first, second, (a, b) => a + b)
    }

    arrayOp(first: number[], second: number[], op: (a: number, b: number) => number): number[] {
        return [op(first[0], second[0]), op(first[1], second[1]), op(first[2], second[2]), op(first[3], second[3])]
    }

    private vectorScalarMultiply(scalar: number, v: number[]) {
        return [scalar * v[0], scalar * v[1], scalar * v[2], scalar * v[3]];
    }

    private identityVector(index: number): number[] {
        if (index === 0) {
            return [1, 0, 0, 0]
        } else if (index === 1) {
            return [0, 1, 0, 0]
        } else if (index === 2) {
            return [0, 0, 1, 0]
        } else {
            return [0, 0, 0, 1]
        }
    }
}