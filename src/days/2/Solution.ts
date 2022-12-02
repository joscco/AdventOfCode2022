import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "15";
    }

    getSecondExampleSolution(): string {
        return "12";
    }

    private static parseStateToNumberTuple(state: String): number[] {
        return [state.charCodeAt(0) - "A".charCodeAt(0), state.charCodeAt(2) - "X".charCodeAt(0)]
    }

    solveFirst(input: string): string {
        let INDEX_TO_POINTS = [3, 6, 0]
        let score = input
            .parseRows()
            .map(Solution.parseStateToNumberTuple)
            .map(([opChoice, myChoice]) => {
                let indexPoints = INDEX_TO_POINTS.slide(-opChoice)
                return indexPoints[myChoice] + myChoice + 1
            })
            .add()
        return `${score}`;
    }

    solveSecond(input: string): string {
        let INDEX_TO_ANSWER = [2, 0, 1]
        let score = input
            .parseRows()
            .map(Solution.parseStateToNumberTuple)
            .map(([opChoice, gameResult]) => {
                let answerTable = INDEX_TO_ANSWER.slide(opChoice)
                let ownChoice = answerTable[gameResult]
                return ownChoice + 1 + 3 * gameResult
            })
            .add()
        return `${score}`;
    }
}