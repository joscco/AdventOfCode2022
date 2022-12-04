import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "157";
    }

    getSecondExampleSolution(): string {
        return "70";
    }

    letterToPriority(letter: String): number {
        if (letter.isUpperCase()) {
            return letter.charCodeAt(0) - 'A'.charCodeAt(0) + 27
        } else {
            return letter.charCodeAt(0) - 'a'.charCodeAt(0) + 1
        }
    }

    solveFirst(input: string): string {
        let sum = input
            .parseRows()
            .map(str => str.splitAt(str.length/2))
            .findCommonSymbols()
            .getFirsts()
            .map(this.letterToPriority)
            .add()
        return `${sum}`;
    }

    solveSecond(input: string): string {
        let sum = input
            .parseRows()
            .groupSplitBySize(3)
            .findCommonSymbols()
            .getFirsts()
            .map(this.letterToPriority)
            .add()
        return `${sum}`;
    }
}