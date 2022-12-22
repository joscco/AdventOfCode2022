import {AbstractSolution} from "../../types/AbstractSolution";

type Operator = {
    key1: string,
    key2: string,
    result: (a: number, b: number) => number
}

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "152";
    }

    getSecondExampleSolution(): string {
        return "301";
    }

    solveFirst(input: string): string {
        return this.solveMonkeyCalculation(input.parseRows(), false, false).toString()
    }

    solveSecond(input: string, testMode: boolean): string {
        return this.solveMonkeyCalculation(input.parseRows(), true, testMode).toString()
    }

    solveMonkeyCalculation(arr: String[], adapted: boolean, testMode: boolean): number {
        let monkeyMap = new Map<string, number | Operator>()
        arr.map(monkey => {
            let split = monkey.split(": ")
            let backsplit = split[1].split(" ")
            if (backsplit.length === 1) {
                monkeyMap.set(split[0], parseInt(split[1]))
            } else {
                let operation
                switch (backsplit[1]) {
                    case "+":
                        operation = (a: number, b: number) => a + b
                        break
                    case "-":
                        operation = (a: number, b: number) => a - b
                        break
                    case "/":
                        operation = (a: number, b: number) => a / b
                        break
                    default:
                        operation = (a: number, b: number) => a * b
                        break
                }
                monkeyMap.set(split[0], {key1: backsplit[0], key2: backsplit[2], result: operation})
            }
        })

        if (adapted) {
            // Intervallschachtelung for the win.
            // Only works if the starting interval is small and precise enough
            let low = testMode
                ? 0
                : 1000000000000
            let high = 10000000000000

            while (true) {
                monkeyMap.set("humn", Math.floor((low + high) / 2))
                let resultLeft = this.giveMonkeyResult((monkeyMap.get("root") as Operator).key1, monkeyMap)
                let resultRight = this.giveMonkeyResult((monkeyMap.get("root") as Operator).key2, monkeyMap)
                if (resultLeft > resultRight) {
                    if(testMode) {
                        high = Math.floor((low + high) / 2)
                    } else {
                        low = Math.floor((low + high) / 2)
                    }
                } else if (resultLeft < resultRight) {
                    if(testMode) {
                        low = Math.floor((low + high) / 2)
                    } else {
                        high = Math.floor((low + high) / 2)
                    }
                } else {
                    return Math.floor((low + high) / 2)
                }
            }
        } else {
            return this.giveMonkeyResult("root", monkeyMap)
        }

    };

    private giveMonkeyResult(root: string, monkeyMap: Map<string, number | Operator>): number {
        let monkey = monkeyMap.get(root)
        if (isNaN(Number(monkey))) {
            let opMonkey = (monkey as Operator)
            let firstResult = this.giveMonkeyResult(opMonkey.key1, monkeyMap)
            let lastResult = this.giveMonkeyResult(opMonkey.key2, monkeyMap)
            return opMonkey.result(firstResult, lastResult)
        } else {
            return monkey as number
        }
    }
}