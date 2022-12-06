// Get the single item Type from Array Type
export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never

declare global {
    interface Array<T> {
        add(): number,
        count(value: T): number;
        contains(element: T): boolean;
        containsMultipleSymbols(): boolean;
        findCommonSymbols(): String[][]
        get(indices: number[]): T[];
        getFirsts(): ArrayElement<T>[];
        groupSplit(separator: String): T[][];
        groupSplitBySize(size: number): T[][];
        log(lambda?: (item: T) => any[]): T[];
        max(sortFn: (a: T, b: T) => number): T,
        maxN(n: number, sortFn: (a: T, b: T) => number): T[]
        offset(number: number): T[];
        parseInt(): number[]
        slideWindow(width: number): T[][]
    }
}

Array.prototype.add = function (): number {
    return this.reduce((a, b) => a + b, 0)
}

Array.prototype.count = function <T>(value: T): number {
    let filtered = this.filter(val => value === val)
    return filtered.length
}

Array.prototype.findCommonSymbols = function(): String[][] {
    return this.map(arr => {
        let result = arr[0]
        for (let i = 1; i < arr.length; i++) {
            result = arr[i].findCommonLettersWith(result)
        }
        return result
    })
}

Array.prototype.contains = function<T> (element: T): boolean {
    return this.indexOf(element) > -1
}

Array.prototype.containsMultipleSymbols = function (): boolean {
    for (let i = 0; i < this.length - 1; i++) {
        if (this.slice(Math.min(i + 1, this.length - 1), this.length).indexOf(this[i]) > -1) {
            return true
        }
    }
    return false
}

Array.prototype.get = function<T>(indices: number[]): T[]{
    return this.filter((val, i) => indices.contains(i))
}

Array.prototype.getFirsts = function<T>(): ArrayElement<T>[]{
    return this.map(el => el[0])
}

Array.prototype.groupSplit = function <T>(separator: T): T[][] {
    let groups: T[][] = [];
    let currentGroup: T[] = []
    for (let i = 0; i < this.length; i++) {
        if (this[i] === separator) {
            groups.push(currentGroup)
            currentGroup = []
        } else {
            currentGroup.push(this[i])
        }
    }
    // Don't forget the last group!
    groups.push(currentGroup)
    return groups
}

Array.prototype.groupSplitBySize = function <T>(size: number): T[][] {
    let groups: T[][] = [];
    for (let i = 0; i < this.length / size; i++) {
        groups.push([...this.slice(size * i, size * (i + 1))])
    }
    return groups
}

Array.prototype.offset = function <T>(positions: number): T[] {
    if (positions < 0) {
        positions = (this.length + positions) % this.length
    }
    return [...this.slice(positions, this.length), ...this.slice(0, positions)]
}

Array.prototype.parseInt = function (): number[] {
    return this.map(val => parseInt(val as string))
}

Array.prototype.max = function <T>(sortFn: (a: T, b: T) => number): number {
    let currentMax = this[0]
    for (let i = 1; i < this.length; i++) {
        if (sortFn(currentMax, this[i]) <= 0) {
            currentMax = this[i]
        }
    }
    return currentMax
}

Array.prototype.maxN = function <T>(n: number, sortFn: (a: T, b: T) => number): T[] {
    let sorted = Object.assign([], this).sort(sortFn)
    return sorted.slice(this.length - n, this.length)
}

Array.prototype.slideWindow = function <T>(width: number): T[][] {
    let result = [];
    for (let i = width - 1; i < this.length; i++) {
        result.push(this.slice(i - width + 1, i + 1))
    }
    return result
}

Array.prototype.log = function <T>(lambda?: (item: T) => any[]): T[] {
    if (lambda) {
        this.forEach(item => console.log(...lambda(item)))
    } else {
        this.forEach(item => console.log(item))
    }

    return this
}

export function ORDER_NATURAL(a: number, b: number): number {
    return a - b
}


