import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {
    private directions: number[][] = [
        [-1, 0, 0], [1, 0, 0],
        [0, -1, 0], [0, 1, 0],
        [0, 0, -1], [0, 0, 1]
    ];

    getFirstExampleSolution(): string {
        return "64";
    }

    getSecondExampleSolution(): string {
        return "58";
    }

    solveFirst(input: string): string {
        let cubes = input.parseRows()
            .map(row => row.split(",").map(s => parseInt(s)))

        let sides = 0

        for (let cube of cubes) {
            let cubeSides = 6
            for (let other of cubes) {
                if (cube === other) {
                    continue
                }
                if (this.hasIntersectingSide(cube, other)) {
                    cubeSides--
                }
            }
            sides += cubeSides
        }
        return sides.toString()
    }

    private hasIntersectingSide(cube: number[], other: number[]) {
        return (Math.abs(cube[0] - other[0]) <= 1 && cube[1] === other[1] && cube[2] === other[2])
            || (Math.abs(cube[1] - other[1]) <= 1 && cube[0] === other[0] && cube[2] === other[2])
            || (Math.abs(cube[2] - other[2]) <= 1 && cube[0] === other[0] && cube[1] === other[1]);
    }

    solveSecond(input: string): string {
        let cubes = input.parseRows()
            .map(row => row.split(",").map(s => parseInt(s)))

        // Wrap your way around the surface
        let [minX, minY, minZ] = cubes.reduce((a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.min(a[2], b[2])], [99, 99, 99])
        let [maxX, maxY, maxZ] = cubes.reduce((a, b) => [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.max(a[2], b[2])], [-99, -99, -99])

        let outsides = [[minX - 1, minY - 1, minZ - 1]]
        let visited = new Set<string>()
        let sides = 0

        while (outsides.length > 0) {
            let outsideCube = outsides[0]
            outsides.shift()
            visited.add(`${outsideCube[0]}_${outsideCube[1]}_${outsideCube[2]}`)
            for (let direction of this.directions) {
                let potentialDropCube = this.addCoordinates(outsideCube, direction)
                if (minX - 1 <= potentialDropCube[0] && potentialDropCube[0] <= maxX + 1
                    && minY - 1 <= potentialDropCube[1] && potentialDropCube[1] <= maxY + 1
                    && minZ - 1 <= potentialDropCube[2] && potentialDropCube[2] <= maxZ + 1) {
                    if (this.isCube(potentialDropCube, cubes)) {
                        sides++
                    } else if (!visited.has(`${potentialDropCube[0]}_${potentialDropCube[1]}_${potentialDropCube[2]}`)
                        && !this.isCube(potentialDropCube, outsides)){
                        outsides.push(potentialDropCube)
                    }
                }
            }
        }
        return sides.toString()
    }

    isCube(potentialCube: number[], cubes: number[][]): boolean {
        for (let cube of cubes) {
            if (cube[0] === potentialCube[0] && cube[1] === potentialCube[1] && cube[2] === potentialCube[2]) {
                return true
            }
        }
        return false
    }

    addCoordinates(a: number[], b: number[]): number[] {
        return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
    }
}