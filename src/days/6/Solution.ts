import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "7";
    }

    getSecondExampleSolution(): string {
        return "19";
    }

    solveFirst(input: string): string {
        let uniqueIndices: number[] = []
        input.slideWindow(4)
            .map((val, index) => {
                if (!val.containsMultipleLetters()) {
                    uniqueIndices.push(index + 4)
                }
            })

        return `${uniqueIndices[0]}`;
    }

    solveSecond(input: string): string {
        let uniqueIndices: number[] = []
        input.slideWindow(14)
            .map((val, index) => {
                if (!val.containsMultipleLetters()) {
                    uniqueIndices.push(index + 14)
                }
            })
        return `${uniqueIndices[0]}`;
    }
}