import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "6032";
    }

    getSecondExampleSolution(): string {
        return "5031";
    }

    solveFirst(input: string): string {
        return this.solvePathPasswort(input.parseRows()).toString()
    }

    solveSecond(input: string, testMode: boolean): string {
        return this.solveCubePathPasswort(input.parseRows(), testMode ? 4 : 50, testMode ? [0, 2] : [0, 1], testMode).toString()
    }

    solveCubePathPasswort(arr: String[], sideLength: number, startCube: number[], testMode: boolean): number {
        let cubeGrid: (string[][] | null)[][] = this.parseCubeGrid(arr, sideLength)
        let commandRow = arr[arr.length - 1]
        let commands: ("R" | "L" | number)[] = []

        let currentCommand = ""
        for (let letter of commandRow.split("")) {
            if (letter === "R") {
                commands.push(parseInt(currentCommand))
                commands.push("R")
                currentCommand = ""
            } else if (letter === "L") {
                commands.push(parseInt(currentCommand))
                commands.push("L")
                currentCommand = ""
            } else {
                currentCommand += letter
            }
        }
        commands.push(parseInt(currentCommand))

        // Work through commands
        let currentCube = startCube
        let currentPosition = [0, 0]
        let currentDirection = [1, 0]

        for (let command of commands) {
            if (command === "R") {
                currentDirection = this.turnRight(currentDirection)
            } else if (command === "L") {
                currentDirection = this.turnLeft(currentDirection)
            } else {
                for (let i = 0; i < (command as number); i++) {
                    let nextYIndex: number = currentPosition[0] + currentDirection[1]
                    let nextXIndex: number = currentPosition[1] + currentDirection[0]

                    // Wrap index, this gets much more complicated on a cube!
                    let result = this.findNextCube(testMode, sideLength, currentCube, currentDirection, nextYIndex, nextXIndex)
                    nextXIndex = result.xIndex
                    nextYIndex = result.yIndex

                    // Check if out of row
                    let nextField = cubeGrid[result.cube[0]][result.cube[1]]![nextYIndex][nextXIndex]
                    // If field is not free, break
                    if (nextField === ".") {
                        currentCube = result.cube
                        currentDirection = result.direction
                        currentPosition = [nextYIndex, nextXIndex]
                    } else {
                        break
                    }
                }

            }
        }

        return (currentCube[0] * sideLength + currentPosition[0] + 1) * 1000 + (currentCube[1] * sideLength + currentPosition[1] + 1) * 4 + this.getScoreForDirection(currentDirection)
    };

    solvePathPasswort(arr: String[]): number {
        let grid: string[][] = arr.slice(0, arr.length - 2).map(row => row.split(""))
        let commandRow = arr[arr.length - 1]
        let commands: ("R" | "L" | number)[] = []

        let currentCommand = ""
        for (let letter of commandRow.split("")) {
            if (letter === "R") {
                commands.push(parseInt(currentCommand))
                commands.push("R")
                currentCommand = ""
            } else if (letter === "L") {
                commands.push(parseInt(currentCommand))
                commands.push("L")
                currentCommand = ""
            } else {
                currentCommand += letter
            }
        }
        commands.push(parseInt(currentCommand))

        // Work through commands
        let currentPosition = [0, grid[0].indexOf(".")]
        let currentDirection = [1, 0]

        for (let command of commands) {
            if (command === "R") {
                currentDirection = this.turnRight(currentDirection)
            } else if (command === "L") {
                currentDirection = this.turnLeft(currentDirection)
            } else {
                let columnStartIndex = this.getColumnStart(grid, currentPosition[1])
                let columnHeight = this.getColumnHeight(grid, currentPosition[1])
                let rowStartIndex = this.getRowStart(grid, currentPosition[0])
                let rowWidth = this.getRowWidth(grid, currentPosition[0])

                for (let i = 0; i < (command as number); i++) {
                    let nextYIndex = currentPosition[0] + currentDirection[1]
                    let nextXIndex = currentPosition[1] + currentDirection[0]
                    // Wrap index
                    if (nextYIndex < columnStartIndex) {
                        nextYIndex = columnStartIndex + columnHeight - 1
                    } else if (nextYIndex > columnStartIndex + columnHeight - 1) {
                        nextYIndex = columnStartIndex
                    } else if (nextXIndex < rowStartIndex) {
                        nextXIndex = rowStartIndex + rowWidth - 1
                    } else if (nextXIndex > rowStartIndex + rowWidth - 1) {
                        nextXIndex = rowStartIndex
                    }

                    // Check if out of row
                    let nextField = grid[nextYIndex][nextXIndex]
                    // If field is not free, break
                    if (nextField === ".") {
                        currentPosition = [nextYIndex, nextXIndex]
                    } else {
                        break
                    }
                }

            }
        }

        return (currentPosition[0] + 1) * 1000 + (currentPosition[1] + 1) * 4 + this.getScoreForDirection(currentDirection)
    };

    private turnRight(currentDirection: number[]) {
        return [-currentDirection[1], currentDirection[0]]
    }

    private turnLeft(currentDirection: number[]) {
        return [currentDirection[1], -currentDirection[0]]
    }

    private getScoreForDirection(currentDirection: number[]): number {
        if (currentDirection[0] === 1) {
            return 0
        } else if (currentDirection[1] === 1) {
            return 1
        } else if (currentDirection[0] === -1) {
            return 2
        } else {
            return 3
        }
    }

    private getColumnStart(grid: string[][], number: number): number {
        let columnIndices = grid.map(row => row.filter((el, index) => index === number)).flatMap(el => el)
        for (let i = 0; i < columnIndices.length; i++) {
            if (columnIndices[i] !== " ") {
                return i
            }
        }
        throw Error("NO COLUMN START FOUND")
    }

    private getColumnHeight(grid: string[][], number: number): number {
        let columnIndices = grid.map(row => row.filter((el, index) => index === number)).flatMap(el => el)
        let started: boolean = false
        let height: number = 0
        for (let i = 0; i < columnIndices.length; i++) {
            if (columnIndices[i] === " ") {
                if (started) {
                    return height
                }

            } else {
                started = true
                height++
            }
        }
        return height
    }

    private getRowStart(grid: string[][], number: number): number {
        for (let i = 0; i < grid[number].length; i++) {
            if (grid[number][i] !== " ") {
                return i
            }
        }
        throw Error("NO COLUMN START FOUND")
    }

    private getRowWidth(grid: string[][], number: number): number {
        let started: boolean = false
        let width: number = 0
        for (let i = 0; i < grid[number].length; i++) {
            if (grid[number][i] === " ") {
                if (started) {
                    return width
                }

            } else {
                started = true
                width++
            }
        }
        return width
    }

    private parseCubeGrid(arr: String[], sideLength: number): (string[][] | null)[][] {
        let cubes: (string[][] | null)[][] = [[], [], [], []]
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (arr[row].length < col * sideLength || arr [row * sideLength][col * sideLength] === " ") {
                    cubes[row][col] = null
                } else {
                    cubes[row][col] = arr.slice(row * sideLength, (row + 1) * sideLength).map(row => row.slice(col * sideLength, (col + 1) * sideLength).split(""))
                }
            }
        }
        return cubes
    }

    private findNextCube(testMode: boolean, sideLength: number, currentCube: number[], currentDirection: number[], nextYIndex: number, nextXIndex: any): { cube: number[], direction: number[], yIndex: number, xIndex: number } {
        const DIRECTIONS = [[1, 0], [0, 1], [-1, 0], [0, -1]]
        const REGIONS = testMode
            ? [[0, 2], [1, 0], [1, 1], [1, 2], [2, 2], [2, 3]]
            : [[0, 1], [0, 2], [1, 1], [2, 0], [2, 1], [3, 0]]
        const DIRREGIONMAP: { [key: string]: number[] } = testMode
            ? {
                "0_0": [5, 2], "0_1": [3, 1], "0_2": [2, 1], "0_3": [1, 1],
                "1_0": [2, 0], "1_1": [4, 3], "1_2": [5, 3], "1_3": [0, 1],
                "2_0": [3, 0], "2_1": [4, 0], "2_2": [1, 2], "2_3": [0, 0],
                "3_0": [5, 1], "3_1": [4, 1], "3_2": [2, 2], "3_3": [0, 3],
                "4_0": [5, 0], "4_1": [1, 3], "4_2": [2, 3], "4_3": [3, 3],
                "5_0": [0, 2], "5_1": [1, 0], "5_2": [4, 2], "5_3": [3, 2],
            }
            : {
                "0_0": [1, 0], "0_1": [2, 1], "0_2": [3, 0], "0_3": [5, 0],
                "1_0": [4, 2], "1_1": [2, 2], "1_2": [0, 2], "1_3": [5, 3],
                "2_0": [1, 3], "2_1": [4, 1], "2_2": [3, 1], "2_3": [0, 3],
                "3_0": [4, 0], "3_1": [5, 1], "3_2": [0, 0], "3_3": [2, 0],
                "4_0": [1, 2], "4_1": [5, 2], "4_2": [3, 2], "4_3": [2, 3],
                "5_0": [4, 3], "5_1": [1, 1], "5_2": [0, 1], "5_3": [3, 3],
            }

        if (0 <= nextXIndex && nextXIndex < sideLength && 0 <= nextYIndex && nextYIndex < sideLength) {
            return {cube: currentCube, direction: currentDirection, yIndex: nextYIndex, xIndex: nextXIndex}
        } else {
            nextXIndex = (nextXIndex + sideLength) % sideLength
            nextYIndex = (nextYIndex + sideLength) % sideLength
            let regionIndex = REGIONS.findIndex(region => region[0] === currentCube[0] && region[1] === currentCube[1])
            let directionIndex = DIRECTIONS.findIndex(direction => direction[0] === currentDirection[0] && direction[1] === currentDirection[1])
            let newTuple: number[] = DIRREGIONMAP[regionIndex + "_" + directionIndex]
            let cube = REGIONS[newTuple[0]]
            let direction = DIRECTIONS[newTuple[1]]
            let [xIndex, yIndex] = this.findCoordinates(sideLength, nextYIndex, nextXIndex, currentDirection, direction)

            return {cube: cube, direction: direction, yIndex: yIndex, xIndex: xIndex}
        }

    }

    private findCoordinates(sideLength: number, nextYIndex: number, nextXIndex: any, currentDirection: number[], direction: number[]) {
        let directionCopy = [currentDirection[0], currentDirection[1]]
        while (directionCopy[0] !== direction[0] || directionCopy[1] !== direction[1]) {
            let temp = directionCopy[0]
            directionCopy[0] = -directionCopy[1]
            directionCopy[1] = temp

            let temp2 = nextXIndex
            nextXIndex = sideLength - 1 - nextYIndex
            nextYIndex = temp2
        }
        return [nextXIndex, nextYIndex]
    }
}