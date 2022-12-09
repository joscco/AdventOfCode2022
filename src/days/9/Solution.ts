import {AbstractSolution} from "../../types/AbstractSolution";

type CommandConversionAnswer = {
    newHead: number[],
    newTail: number[],
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
        let visitedTailPositions = new Set<string>(["0_0"])
        let currentHeadPosition = [0, 0]
        let currentTailPosition = [0, 0]

        input.parseRows()
            .map(row => row.split(" "))
            .map(row => [row[0], parseInt(row[1])])
            .forEach(row => {
                let command = row[0] as string
                let amount = row[1] as number
                let answer = this.applyCommand(currentHeadPosition, currentTailPosition, command, amount);
                currentHeadPosition = answer.newHead
                currentTailPosition = answer.newTail
                answer.newVisitedIndices.forEach(index => {
                    visitedTailPositions.add(index[0] + "_" + index[1])
                })
            })

        return visitedTailPositions.size.toString()
    }

    solveSecond(input: string): string {
        let visitedTailPositions = new Set<string>(["0_0"])
        let currentHeadPosition = [0, 0]
        let currentTailsPositions = Array(9).fill([0, 0])

        input.parseRows()
            .map(row => row.split(" "))
            .map(row => [row[0], parseInt(row[1])])
            .forEach(row => {
                let command = row[0] as string
                let amount = row[1] as number
                let answer = this.applyCommandForMultiple(currentHeadPosition, currentTailsPositions, command, amount);
                currentHeadPosition = answer.newHead
                currentTailsPositions = answer.newTails
                answer.newVisitedIndices.forEach(index => {
                    visitedTailPositions.add(index[0] + "_" + index[1])
                })
            })

        return visitedTailPositions.size.toString()
    }

    private applyCommand(headPos: number[], tailPos: number[], command: string, amount: number): CommandConversionAnswer {
        let visitedIndices: number[][] = []
        let currentHead = headPos
        let currentTail = tailPos
        for (let i = 0; i < amount; i++) {
            currentHead = this.getNextHeadPosition(currentHead, command)
            currentTail = this.stepWithTail(tailPos, currentHead)
            visitedIndices.push(currentTail)
        }

        return {newHead: currentHead, newTail: currentTail, newVisitedIndices: visitedIndices}
    }

    private applyCommandForMultiple(headPos: number[], tailPoss: number[][], command: string, amount: number): { newHead: number[], newTails: number[][], newVisitedIndices: number[][] } {
        let visitedIndices: number[][] = []
        let currentHead = headPos
        let currentTails = tailPoss
        for (let i = 0; i < amount; i++) {
            currentHead = this.getNextHeadPosition(currentHead, command)
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
            case "R":
                return [1, 0]
            case "L":
                return [-1, 0]
            case "U":
                return [0, -1]
            case "D":
                return [0, 1]
        }
        return [0, 0]
    }

    private addPosition(a: number[], b: number[]) {
        return [a[0] + b[0], a[1] + b[1]]
    }

    private getNextHeadPosition(headPos: number[], command: string): number[] {
        let direction = this.getDirectionForCommand(command)
        return this.addPosition(headPos, direction)
    }

    // This can probably be refactored
    private stepWithTail(tailPos: number[], headPos: number[]): number[] {
        let newX = tailPos[0]
        let newY = tailPos[1]
        if (tailPos[0] === headPos[0] && tailPos[1] !== headPos[1]) {
            let difference = (headPos[1] - tailPos[1])
            newY = tailPos[1] + Math.sign(difference) * Math.floor(Math.abs(difference) / 2)
        } else if (tailPos[1] === headPos[1] && tailPos[0] !== headPos[0]) {
            let difference = (headPos[0] - tailPos[0])
            newX = tailPos[0] + Math.sign(difference) * Math.floor(Math.abs(difference) / 2)
        } else {
            // Moved from Diagonal position
            if (Math.abs(headPos[0] - tailPos[0]) > Math.abs(headPos[1] - tailPos[1])) {
                newY = headPos[1]
                let difference = (headPos[0] - tailPos[0])
                newX = tailPos[0] + Math.sign(difference) * Math.floor(Math.abs(difference) / 2)
            } else if (Math.abs(headPos[0] - tailPos[0]) < Math.abs(headPos[1] - tailPos[1])) {
                newX = headPos[0]
                let difference = (headPos[1] - tailPos[1])
                newY = tailPos[1] + Math.sign(difference) * Math.floor(Math.abs(difference) / 2)
            } else {
                let difference = (headPos[0] - tailPos[0])
                newX = tailPos[0] + Math.sign(difference) * Math.floor(Math.abs(difference) / 2)
                difference = (headPos[1] - tailPos[1])
                newY = tailPos[1] + Math.sign(difference) * Math.floor(Math.abs(difference) / 2)
            }
        }

        return [newX, newY]
    }
}