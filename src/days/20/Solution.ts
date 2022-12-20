import {AbstractSolution} from "../../types/AbstractSolution";

export class Solution extends AbstractSolution {

    getFirstExampleSolution(): string {
        return "3";
    }

    getSecondExampleSolution(): string {
        return "1623178306";
    }

    solveFirst(input: string): string {
        return this.solveWithMixins(input.parseIntRows(), 1).toString()
    }

    solveSecond(input: string): string {
        return this.solveWithMixins(input.parseIntRows().map((n) => n * 811589153), 10).toString();
    }

    solveWithMixins(arr: number[], time: number): number {
        const mixed = this.applyMixins(arr, time);
        const idx = mixed.findIndex((n) => n === 0);
        return (
            mixed[(idx + 1000) % mixed.length] +
            mixed[(idx + 2000) % mixed.length] +
            mixed[(idx + 3000) % mixed.length]
        );
    };

    applyMixins(_arr: number[], times = 1): number[]{
        const arr = _arr.map((n, i) => [n, i]);
        for (let t = 0; t < times; t++) {
            for (let x = 0; x < arr.length; x++) {
                const i = arr.findIndex((n) => n[1] === x);
                const n = arr[i][0];
                arr.splice(i, 1);
                arr.splice((i + n) % arr.length, 0, [n, x]);
            }
        }
        return arr.map((a) => a[0]);
    };
}