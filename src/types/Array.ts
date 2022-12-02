declare global {
    interface Array<T> {
        slideWindow(width: number): Array<T[]>;
        count(value: T): number;
        log(lambda?: (item: T) => any[]): Array<T>;
        slide(number: number): Array<T>;
        groupSplit(separator: String): Array<T[]>;
        parseInt(): number[]
        add(): number,
        max(sortFn: (a: T, b: T) => number): T,
        maxN(n: number, sortFn: (a: T, b: T) => number): Array<T>
    }
}

Array.prototype.slide = function <T>(positions: number): T[] {
    if (positions < 0) {
        positions = (this.length + positions) % this.length
    }
    return [...this.slice(positions, this.length), ...this.slice(0, positions)]
}

Array.prototype.add = function (): number {
    return this.reduce((a, b) => a + b, 0)
}

Array.prototype.parseInt = function(): number[] {
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

Array.prototype.log = function <T>(lambda?: (item: T) => any[]): T[] {
    if (lambda) {
        this.forEach(item => console.log(...lambda(item)))
    } else {
        this.forEach(item => console.log(item))
    }

    return this
}

Array.prototype.count = function <T>(value: T): number {
    let filtered = this.filter(val => value === val)
    return filtered.length
}

export function ORDER_NATURAL(a: number, b: number): number {
    return a - b
}


