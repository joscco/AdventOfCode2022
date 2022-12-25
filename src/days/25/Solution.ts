import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "2=-1=0";
    }

    getSecondExampleSolution(): string {
        return "Nothing to do here";
    }

    solveFirst(input: string): string {
        return this.decToSnafu(input.parseRows()
            .map(val => this.snafuToDec(val as string))
            .add()
        )
    }

    solveSecond(input: string): string {
        return "Nothing to do here"
    }

    DIGITS: { [key: string]: number } = {"0": 0, "1": 1, "2": 2, "-": -1, "=": -2}
    REVERSE_DIGITS: { [key: string]: string } = {"-2": "=", "-1": "-"}

    snafuToDec(snafu: string): number {
        return snafu.split("").map(val => this.DIGITS[val])
            .reduce((prev, next) => prev * 5 + next, 0)
    }

    decToSnafu(dec: number): string {
        if (dec === 0) {
            return ""
        }
        let ratio = Math.floor(dec / 5)
        let remainder = dec % 5
        return remainder < 3
            ? (this.decToSnafu(ratio) + remainder)
            : (this.decToSnafu(ratio + 1) + this.REVERSE_DIGITS[`${remainder - 5}`])
    }
}