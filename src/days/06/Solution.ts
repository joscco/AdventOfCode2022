import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "7";
    }

    getSecondExampleSolution(): string {
        return "19";
    }

    solveFirst(input: string): string {
        return `${this.findFirstNDifferent(input, 4)}`;
    }

    solveSecond(input: string): string {
        return `${this.findFirstNDifferent(input, 14)}`;
    }

    findFirstNDifferent(input: string, n: number): number {
        let result: number = -1
        for(let [i, quadruple] of input.slideWindow(n).entries()) {
            if (!quadruple.containsRepeatingLetters()) {
                result = i + n
                break
            }
        }
        return result
    }
}