import {AbstractSolution} from "../../types/AbstractSolution";
import {ORDER_NATURAL} from "../../types/Array";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "3068";
    }

    getSecondExampleSolution(): string {
        return "1514285714288";
    }

    solveFirst(input: string): string {
        return this.heightAfterBricks(input, 2022);
    }

    solveSecond(input: string): string {
        return this.heightAfterBricks(input, 1000000000000);
    }

    private heightAfterBricks(input: string, numberOfBricks: number) {
        let horBrick = [[0, 0], [0, 1], [0, 2], [0, 3]]
        let plusBrick = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]]
        let lBrick = [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]]
        let vertBrick = [[0, 0], [1, 0], [2, 0], [3, 0]]
        let blockBrick = [[0, 0], [0, 1], [1, 0], [1, 1]]
        let bricks = [horBrick, plusBrick, lBrick, vertBrick, blockBrick]

        let directions = input.split("").map(val => val === ">" ? 1 : -1)

        let field: number[] = []

        let szenarioMemory: Map<string, { time: number, maxHeight: number }> = new Map<string, { time: number; maxHeight: number }>()

        let currentHeight = 0
        for (let i = 0; i < 7; i++) {
            field.push(i)
        }

        let windIndex = 0
        let brickIndex = 0
        let lastWindIndex = 0
        let time = numberOfBricks
        while (time > 0) {
            // this.printField(i, currentHeight, field)

            currentHeight = Math.floor(field.max(ORDER_NATURAL) / 7)
            let brick = this.indexSetAdd(bricks[brickIndex], [currentHeight + 4, 2])
            let lastBrickIndex = brickIndex
            brickIndex = (brickIndex + 1) % bricks.length
            outer:
                while (true) {
                    // Apply wind
                    let wind = directions[windIndex]
                    lastWindIndex = windIndex
                    windIndex = (windIndex + 1) % directions.length
                    let newBrick = this.indexSetAdd(brick, [0, wind])

                    // Check if brick is valid after application of wind
                    if (this.isValidBrick(newBrick, field)) {
                        brick = newBrick
                    }

                    // Go down
                    newBrick = this.indexSetAdd(brick, [-1, 0])
                    for (let spot of newBrick) {
                        if (field.contains(spot[0] * 7 + spot[1])) {
                            brick.forEach(spot2 => field.push(spot2[0] * 7 + spot2[1]))
                            break outer
                        }
                    }

                    brick = newBrick
                }

            currentHeight = Math.floor(field.max(ORDER_NATURAL) / 7)
            time--

            // For part two: Remember old, similar scenarios and how the height changed
            let heights = Array.from(Array(7).keys())
                .map(ind => currentHeight - Math.floor(field.filter(val => val % 7 === ind).max(ORDER_NATURAL) / 7))
                .join("_")

            let lastSzenarioLikeThis = szenarioMemory.get(heights + "_" + lastBrickIndex + "_" + lastWindIndex)
            if (!lastSzenarioLikeThis) {
                szenarioMemory.set(
                    heights + "_" + lastBrickIndex + "_" + lastWindIndex,
                    {maxHeight: currentHeight, time: time}
                )
            } else {
                let lastTime = lastSzenarioLikeThis.time
                let lastHeight = lastSzenarioLikeThis.maxHeight
                let timeDifference = lastTime - time
                let numberOfPossibleApplications = Math.floor(time / timeDifference)
                time %= timeDifference

                field = field.map(entry => entry + (numberOfPossibleApplications) * (currentHeight - lastHeight) * 7)
            }
        }
        return currentHeight.toString()
    }

    indexSetAdd(brick: number[][], offset: number[]) {
        return brick.map(index => [index[0] + offset[0], index[1] + offset[1]])
    }

    private isValidBrick(brick: number[][], field: number[]) {
        return brick.map(spot => 0 <= spot[1] && spot[1] <= 6 && !field.contains(spot[0] * 7 + spot[1]))
            .reduce((a, b) => a && b, true)
    }
}