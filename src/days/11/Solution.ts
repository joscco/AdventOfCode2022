import {AbstractSolution} from "../../types/AbstractSolution";
import {ORDER_NATURAL} from "../../types/Array";

type Monkey = {
    items: number[]
    addOperation: boolean,
    operand: number | "old",
    checkDivisor: number,
    trueNextIndex: number,
    falseNextIndex: number,
    throws: number
}

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "10605";
    }

    getSecondExampleSolution(): string {
        return "2713310158";
    }

    solveFirst(input: string): string {
        return this.playMonkeyRounds(input, 20, true)
    }

    solveSecond(input: string): string {
        return this.playMonkeyRounds(input, 10000, false)
    }

    private playMonkeyRounds(input: string, rounds: number, divideBy3: boolean) {
        let monkeys: Monkey[] = input.parseRows()
            .groupSplit("")
            .map(monkeyConfig => {
                return {
                    items: monkeyConfig[1].slice(18).split(", ").parseInt(),
                    addOperation: monkeyConfig[2].slice(23, 24) === "+",
                    operand: monkeyConfig[2].slice(25) === "old" ? "old" : parseInt(monkeyConfig[2].slice(25)),
                    checkDivisor: parseInt(monkeyConfig[3].slice(21)),
                    trueNextIndex: parseInt(monkeyConfig[4].slice(29)),
                    falseNextIndex: parseInt(monkeyConfig[5].slice(30)),
                    throws: 0
                }
            })

        let scm = monkeys.map(monkey => monkey.checkDivisor).multiply()

        for (let i = 0; i < rounds; i++) {
            for (let monkey of monkeys) {
                for (let item of monkey.items) {
                    let realOperand = monkey.operand === "old" ? item : monkey.operand
                    let newItemValue = monkey.addOperation ? item + realOperand : item * realOperand
                    newItemValue = divideBy3 ? Math.floor(newItemValue / 3) : newItemValue % scm

                    let nextMonkeyIndex = newItemValue % monkey.checkDivisor === 0
                        ? monkey.trueNextIndex
                        : monkey.falseNextIndex
                    monkeys[nextMonkeyIndex].items.push(newItemValue)
                    monkey.throws++
                }
                // Reset monkey items after throw
                monkey.items = []
            }
        }

        return monkeys.map(monkey => monkey.throws).maxN(2, ORDER_NATURAL).multiply().toString()
    }
}