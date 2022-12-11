import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "2";
    }

    getSecondExampleSolution(): string {
        return "4";
    }

    solveFirst(input: string): string {
        let sum = input
            .parseRows()
            .map(str => str.split(","))
            .filter(pair => this.oneFullContains(pair[0], pair[1]))
            .length
        return `${sum}`;
    }

    solveSecond(input: string): string {
        let sum = input
            .parseRows()
            .map(str => str.split(","))
            .filter(pair => this.overlaps(pair[0], pair[1]))
            .length
        return `${sum}`;
    }

    private oneFullContains(first: string, second: string): boolean{
        return this.fullContains(first, second) || this.fullContains(second, first)
    }

    private fullContains(first: string, second: string): boolean {
        let [l1, r1] = first.split("-").parseInt()
        let [l2, r2] = second.split("-").parseInt()
        return l1 <= l2 && r2 <= r1
    }

    private overlaps(first: string, second: string): boolean {
        return this.overlapsRight(first, second) || this.overlapsRight(second, first)
    }

    private overlapsRight(first: string, second: string): boolean {
        let [l1, r1] = first.split("-").parseInt()
        let [l2, r2] = second.split("-").parseInt()
        return l1 <= r2 && l2 <= r1
    }
}