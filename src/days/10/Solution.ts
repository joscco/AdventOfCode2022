import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {
    ticker: number = 1
    valueX: number = 0
    score: number = 0
    pixels: string[] = []
    importantIndices: number[] = []

    getFirstExampleSolution(): string {
        return "13140";
    }

    getSecondExampleSolution(): string {
        return "\n##..##..##..##..##..##..##..##..##..##.." +
            "\n###...###...###...###...###...###...###." +
            "\n####....####....####....####....####...." +
            "\n#####.....#####.....#####.....#####....." +
            "\n######......######......######......####" +
            "\n#######.......#######.......#######.....";
    }

    solveFirst(input: string): string {
        this.ticker = 1
        this.valueX = 1
        this.importantIndices = [20, 60, 100, 140, 180, 220]
        this.score = 0
        let rows = input.parseRows()

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i]
            if (row.slice(0, 4) === "noop") {
                this.increaseFirstSolutionTicker()
            }

            if (row.slice(0, 4) === "addx") {
                this.increaseFirstSolutionTicker()
                this.valueX += parseInt(row.slice(5))
                this.increaseFirstSolutionTicker()
            }
        }

        return this.score.toString()
    }

    solveSecond(input: string): string {
        this.ticker = 1
        this.valueX = 1
        this.score = 0
        this.pixels = []
        let rows = input.parseRows()

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i]
            if (row.slice(0, 4) === "noop") {
                this.increaseSecondSolutionTicker()
            }

            if (row.slice(0, 4) === "addx") {
                this.increaseSecondSolutionTicker()
                this.increaseSecondSolutionTicker()
                this.valueX += parseInt(row.slice(5))
            }
        }

        return this.draw(this.pixels)
    }

    increaseFirstSolutionTicker() {
        this.ticker++
        if (this.importantIndices.contains(this.ticker)) {
            this.score += this.ticker * this.valueX
        }
    }

    increaseSecondSolutionTicker() {
        if (this.ticker % 40 === 1) {
            this.ticker = 1
        }

        if (Math.abs(this.valueX - (this.ticker - 1)) <= 1) {
            this.pixels.push("#")
        } else {
            this.pixels.push(".")
        }

        this.ticker++
    }

    draw(pixels: string[]): string {
        let result: string = ""
        for (let i = 0; i < 6; i++) {
            result += "\n"
            for (let j = 0; j < 40; j++) {
                result += pixels[i * 40 + j]
            }
        }
        return result
    }
}