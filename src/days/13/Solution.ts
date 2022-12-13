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
            .map(pair => this.hasRightOrder(pair))
            .map((pair, index) => {
                if (pair) {
                    indexSum += index + 1
                }
            });
        return `${indexSum}`
    }

    solveSecond(input: string): string {
        let indexProduct = 1
        let rows = input.parseRows()
        rows.push("[[2]]", "[[6]]")
        rows.filter(line => line !== "")
            .sort((a, b) => this.hasRightOrder([a, b]) ? -1 : 1)
            .map((line, i) => {
                if(line === "[[2]]" || line === "[[6]]") {
                    indexProduct *= i +1
                }
            })

        return `${indexProduct}`
    }

    hasRightOrder(pair: String[]): boolean {
        return this.compare(pair[0], pair[1]).right
    }

    private compare(left: String, right: String): {right: boolean, final: boolean} {
        if (left === "") {
            return {right: true, final: false}
        }

        if (right === "") {
            return {right: false, final: true}
        }

        if (left[0] === "[" && right[0] === "[") {
            let strippedLeft = this.unwrap(left)
            let leftElements = this.getElements(strippedLeft)
            let strippedRight = this.unwrap(right)
            let rightElements = this.getElements(strippedRight)

            for (let i = 0; i < leftElements.length; i++) {
                let leftElement = leftElements[i]
                let rightElement = rightElements[i]

                if (rightElement === undefined) {
                    return {right: false, final: true}
                }

                let comparisonResult = this.compare(leftElement, rightElement)
                if (comparisonResult.right) {
                    return {right: true, final: true}
                } else if (!comparisonResult.right && comparisonResult.final) {
                    return {right: false, final: true}
                }
            }

            // Comparing Elements didn't give a result
            if (rightElements.length > leftElements.length) {
                return {right: true, final: true}
            }

            // Continue
            return {right: false, final: false}
        } else if (left[0] === "[" && right[0].isNumber()) {
            return this.compare(left, this.wrap(right))
        } else if (left[0].isNumber() && right[0] === "[") {
            return this.compare(this.wrap(left), right)
        } else {
            // Both must be single numbers
            if (parseInt(left as string) < parseInt(right as string)) {
                return {right: true, final: true}
            } else if (parseInt(left as string) > parseInt(right as string)) {
                return {right: false, final: true}
            } else {
                return {right: false, final: false}
            }
        }
    }

    private getElements(strippedLeft: string): string[] {
        let elements: string[] = []
        let currentElement = ""
        let level = 0
        for (let i = 0; i < strippedLeft.length; i++) {
            if (strippedLeft[i] === "[") {
                currentElement += strippedLeft[i]
                level++
            } else if (strippedLeft[i] === "]") {
                currentElement += strippedLeft[i]
                level--
            } else if (strippedLeft[i] === "," && level === 0) {
                elements.push(currentElement)
                currentElement = ""
            } else {
                currentElement += strippedLeft[i]
            }
        }
        elements.push(currentElement)
        return elements
    }

    private unwrap(val: String) {
        return val.slice(1, val.length - 1);
    }

    private wrap(val: String) {
        return "[" + val + "]"
    }
}