import {AbstractSolution} from "../../types/AbstractSolution";

type CommandConversionAnswer = {
    newHead: number[],
    newTails: number[][],
    newVisitedIndices: number[][]
}

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "13";
    }

    getSecondExampleSolution(): string {
        return "1";
    }

    solveFirst(input: string): string {
        return this.solveWithTailLength(input, 1)
    }

    solveSecond(input: string): string {
        return this.solveWithTailLength(input, 9)
    }

    private solveWithTailLength(input: string, tailLength: number) {
        let visitedTailPositions = new Set<string>()
        let currentHeadPosition = [0, 0]
        let currentTailsPositions = Array(tailLength).fill([0, 0])

        input.parseRows()
            .map(row => row.split(" "))
            .map(row => [row[0], parseInt(row[1])])
            .forEach(row => {
                let command = row[0] as string
                let amount = row[1] as number
                let answer = this.applyCommands(currentHeadPosition, currentTailsPositions, command, amount);
                currentHeadPosition = answer.newHead
                currentTailsPositions = answer.newTails
                answer.newVisitedIndices.forEach(index => {
                    visitedTailPositions.add(index[0] + "_" + index[1])
                })
            })

        return visitedTailPositions.size.toString()
    }

    private applyCommands(headPos: number[], tailPoss: number[][], command: string, amount: number): CommandConversionAnswer {
        let visitedIndices: number[][] = []
        let currentHead = headPos
        let currentTails = tailPoss
        for (let i = 0; i < amount; i++) {
            currentHead = this.addPosition(currentHead, this.getDirectionForCommand(command))
            let lastTailPos = currentHead
            for (let j = 0; j < tailPoss.length; j++) {
                currentTails[j] = this.stepWithTail(currentTails[j], lastTailPos)
                lastTailPos = currentTails[j]
            }
            visitedIndices.push(lastTailPos)
        }
        return {newHead: currentHead, newTails: currentTails, newVisitedIndices: visitedIndices}
    }

    private getDirectionForCommand(command: string): number[] {
        switch (command) {
            case "R": return [1, 0]
            case "L": return [-1, 0]
            case "U": return [0, -1]
            case "D": return [0, 1]
        }
        return [0, 0]
    }

    private addPosition(a: number[], b: number[]) {
        return [a[0] + b[0], a[1] + b[1]]
    }

    private subtractPosition(a: number[], b: number[]) {
        return [a[0] - b[0], a[1] - b[1]]
    }

    private stepWithTail(tailPos: number[], headPos: number[]): number[] {
        let rawDirection = this.subtractPosition(headPos, tailPos)
        let realDirection: number[] = [0, 0]
        if (rawDirection.map(Math.abs).contains(2)) {
            realDirection = rawDirection.map(Math.sign)
        }
        return this.addPosition(tailPos, realDirection)
    }
}