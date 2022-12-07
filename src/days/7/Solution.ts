import {AbstractSolution} from "../../types/AbstractSolution";
import {ORDER_NATURAL} from "../../types/Array";

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "95437";
    }

    getSecondExampleSolution(): string {
        return "24933642";
    }

    solveFirst(input: string): string {
        let currentDirectoryPath: string[] = []
        let directoryMap = new Map<string, number>()
        this.createDirectoryMap(input, currentDirectoryPath, directoryMap);
        let result = [...directoryMap.values()].filter(val => val <= 100000).add()
        return `${result}`
    }

    solveSecond(input: string): string {
        let currentDirectoryPath: string[] = []
        let directoryMap = new Map<string, number>()
        this.createDirectoryMap(input, currentDirectoryPath, directoryMap);
        let spaceNeeded = 30000000 - (70000000 - directoryMap.get("/")!)

        for (let size of [...directoryMap.values()].sort(ORDER_NATURAL)) {
            if (size >= spaceNeeded) {
                return `${size}`
            }
        }
        return "NOT VALID"
    }

    private createDirectoryMap(input: string, currentDirectoryPath: string[], directoryMap: Map<string, number>) {
        input.parseRows()
            .map(str => {
                if (str.slice(0, 4) === "$ cd") {
                    if (str.slice(5, 7) === "..") {
                        currentDirectoryPath.pop()
                    } else {
                        currentDirectoryPath.push(str.slice(5))
                    }
                } else if (str.split(" ")[0].isNumber()) {
                    let size = parseInt(str.split(" ")[0])
                    for (let i = 0; i < currentDirectoryPath.length; i++) {
                        let path = currentDirectoryPath.slice(0, i + 1).join("_")
                        let oldValue = directoryMap.get(path) ?? 0
                        directoryMap.set(path, oldValue + size)
                    }
                }
            })
    }
}