import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "CMZ";
    }

    getSecondExampleSolution(): string {
        return "MCD";
    }

    solveFirst(input: string): string {
        let [stackLines, commandLines] = input.parseRows().groupSplit("")
        let result = this.applyCommandLines(stackLines, commandLines, true)
        return `${result}`;
    }

    solveSecond(input: string): string {
        let [stackLines, commandLines] = input.parseRows().groupSplit("")
        let result = this.applyCommandLines(stackLines, commandLines, false)
        return `${result}`;
    }

    applyCommandLines(stackLines: String[], commandLines: String[], reverse: boolean): string {
        let stacks = this.initStacks(stackLines)

        commandLines.map(str => {
            let [amount, fromIndex, toIndex] = str.split(" ").get([1, 3, 5]).parseInt()
            stacks = this.move(stacks, fromIndex - 1, toIndex - 1, amount, reverse)
        })

        return stacks.reduce((lastResult, stack) => lastResult + stack[stack.length - 1], "")
    }

    makeEmptyArr(length: number): any[][] {
        let result = []
        for (let i = 0; i < length; i++) {
            result.push([])
        }
        return result
    }

    private move(stacks: String[][], fromIndex: number, toIndex: number, amount: number, reverse: boolean): string[][] {
        let newStacks: string[][] = Object.assign([], stacks)
        let oldFromStack = newStacks[fromIndex]
        newStacks[toIndex].push(...reverse
            ? oldFromStack.slice(oldFromStack.length - amount).reverse()
            : oldFromStack.slice(oldFromStack.length - amount)
        )
        newStacks[fromIndex] = oldFromStack.slice(0, oldFromStack.length - amount)
        return newStacks
    }

    private initStacks(stackLines: String[]) {
        let lastLine = stackLines[stackLines.length - 1]
        let stackIndices = lastLine.split("   ").length
        let result: string[][] = this.makeEmptyArr(stackIndices)

        for (let lineIndex = stackLines.length - 2; lineIndex >= 0; lineIndex--) {
            for (let stackIndex = 0; stackIndex < stackIndices; stackIndex++) {
                let line = stackLines[lineIndex]
                let crate: string = line.slice(1 + stackIndex * 4, 2 + stackIndex * 4)
                if (crate !== " ") {
                    result[stackIndex].push(crate)
                }
            }
        }
        return result;
    }
}