export abstract class AbstractSolution {
    input: string
    exampleInput: string

    constructor(input: string, exampleInput: string) {
        this.input = input
        this.exampleInput = exampleInput
    }

    abstract solveFirst(input: string): string

    abstract solveSecond(input: string): string

    abstract getFirstExampleSolution(): string

    abstract getSecondExampleSolution(): string

    solve() {
        console.log("----------------------------")
        console.log(`First Puzzle:`)
        let firstExampleSolution = this.getFirstExampleSolution()
        let myFirstExampleSolution = this.solveFirst(this.exampleInput)
        console.log(
            `Example Solution | My Solution: ${firstExampleSolution} | ${myFirstExampleSolution}`,
            "<--",
            firstExampleSolution === myFirstExampleSolution ? "Correct! ✅" : "Wrong! ❌")

        let myRealFirstSolution = this.solveFirst(this.input)
        console.log("Solution for real input:", myRealFirstSolution)

        console.log(`\nSecond Puzzle:`)
        let secondExampleSolution = this.getSecondExampleSolution()
        let mySecondExampleSolution = this.solveSecond(this.exampleInput)
        console.log(`Example Solution | My Solution: ${secondExampleSolution} | ${mySecondExampleSolution}`,
            "<--",
            secondExampleSolution === mySecondExampleSolution ? "Correct! ✅" : "Wrong! ❌")

        let myRealSecondSolution = this.solveSecond(this.input)
        console.log("Solution for real input:", myRealSecondSolution)
    }
}