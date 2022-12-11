import {AbstractSolution} from "../../types/AbstractSolution";
import {ORDER_NATURAL} from "../../types/Array";

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "24000";
    }

    getSecondExampleSolution(): string {
        return "45000";
    }

    solveFirst(input: string): string {
        let maximalSum = input
            .parseRows()
            .groupSplit("")
            .map(group => group.parseInt().add())
            .max(ORDER_NATURAL)

        return `${maximalSum}`;
    }

    solveSecond(input: string): string {
        let maxThreeSum = input
            .parseRows()
            .groupSplit("")
            .map(group => group.parseInt().add())
            .maxN(3, ORDER_NATURAL)
            .add()

        return `${maxThreeSum}`;
    }

}