import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "7";
    }

    getSecondExampleSolution(): string {
        return "5";
    }

    solveFirst(input: string): string {
        let increases: number = input
            .parseIntRows()
            .slideWindow(2)
            .map(str => str[0] < str[1])
            .count(true)
        return `${increases}`;
    }

    solveSecond(input: string): string {
        let increases: number = input
            .parseIntRows()
            .slideWindow(4)
            .map(str => str[0] < str[3])
            .count(true)
        return `${increases}`;
    }

}