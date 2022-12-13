import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "13";
    }

    getSecondExampleSolution(): string {
        return "140";
    }

    solveFirst(input: string): string {
        let indexSum = 0
        input.parseRows()
            .groupSplit("")
            .map(pair => pair.map(entry => JSON.parse(entry as string)))
            .map((pair, index) => {
                if (this.compare(pair[0], pair[1]) > 0) {
                    indexSum += index + 1
                }
            });
        return `${indexSum}`
    }

    solveSecond(input: string): string {
        let rows = input.parseRows()
        rows.push("[[2]]", "[[6]]")
        let sorted = rows.filter(line => line !== "")
            .map(line => JSON.parse(line as string))
            .sort((a, b) => -this.compare(a, b))

        return `${(sorted.findIndex(val => JSON.stringify(val) === "[[6]]") + 1) * (sorted.findIndex(val => JSON.stringify(val) === "[[2]]") + 1)}`
    }

    private compare(left: Array<any> | number, right: Array<any> | number): number {
        if (left === undefined) {
            return 1
        }

        if (right === undefined) {
            return -1
        }

        if (Array.isArray(left) && Array.isArray(right)) {
            for (let i = 0; i < left.length; i++) {
                if (left[i] === undefined) {
                    return -1
                }
                let comparisonResult = this.compare(left[i], right[i])
                if (comparisonResult != 0) {
                    return comparisonResult
                }
            }

            // If all objects were equal so far, let the length decide
            return right.length - left.length
        } else if (this.isNumber(left) && this.isNumber(right)) {
            return (right as number) - (left as number)
        } else {
            return this.compare(this.wrapIfNecessary(left), this.wrapIfNecessary(right))
        }
    }

    private isNumber(input: any): boolean {
        return !isNaN(input as number)
    }

    private wrapIfNecessary(input: any) {
        return Array.isArray(input) ? input : [input]
    }
}