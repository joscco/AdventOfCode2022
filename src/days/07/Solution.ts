import {AbstractSolution} from "../../types/AbstractSolution";
import {ORDER_NATURAL} from "../../types/Array";

type DirectoryMapEntry = {size: number, files: string[]}

export class Solution extends AbstractSolution {
    getFirstExampleSolution(): string {
        return "95437";
    }

    getSecondExampleSolution(): string {
        return "24933642";
    }

    solveFirst(input: string): string {
        let currentDirectoryPath: string[] = []
        let directoryMap = new Map<string, DirectoryMapEntry>()
        this.createDirectoryMap(input, currentDirectoryPath, directoryMap);
        let result = [...directoryMap.values()]
            .map(val => val.size)
            .filter(val => val <= 100000)
            .add()
        return `${result}`
    }

    solveSecond(input: string): string {
        let currentDirectoryPath: string[] = []
        let directoryMap = new Map<string, DirectoryMapEntry>()
        this.createDirectoryMap(input, currentDirectoryPath, directoryMap);
        let spaceNeeded = 30000000 - (70000000 - directoryMap.get("/")!.size)

        return [...directoryMap.values()]
            .map(entry => entry.size)
            .sort(ORDER_NATURAL)
            .getFirst(size => size >= spaceNeeded)
            .toString()
    }


    private createDirectoryMap(input: string, currentDirectoryPath: string[], directoryMap: Map<string, DirectoryMapEntry>) {
        input.parseRows()
            .map(str => {
                if (str.slice(0, 4) === "$ cd") {
                    if (str.slice(5, 7) === "..") {
                        currentDirectoryPath.pop()
                    } else {
                        currentDirectoryPath.push(str.slice(5))
                    }
                } else if (str.split(" ")[0].isNatural()) {
                    let [preSize, filename] = str.split(" ")
                    let fileSize = parseInt(preSize)

                    let currentDirectoryPathStr = currentDirectoryPath.join("_")
                    let currentDirectory = directoryMap.get(currentDirectoryPathStr) ?? {size: 0, files: []}
                    if (!currentDirectory.files.contains(filename)) {
                        currentDirectory.files.push(filename)
                        directoryMap.set(currentDirectoryPathStr, currentDirectory)

                        for (let i = 0; i < currentDirectoryPath.length; i++) {
                            let parentDirectoryPath = currentDirectoryPath.slice(0, i + 1).join("_")
                            let parentDirectory = directoryMap.get(parentDirectoryPath) ?? {size: 0, files: []}
                            parentDirectory.size = parentDirectory.size + fileSize
                            directoryMap.set(parentDirectoryPath, parentDirectory)
                        }
                    }
                }
            })
    }
}