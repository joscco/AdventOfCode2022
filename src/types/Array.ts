interface Array<T> {
    slideWindow(width: number): Array<T[]>;
    count(value: T): number
    log(lambda?: (item: T) => any[]): Array<T>
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

Array.prototype.count = function <T>(value: T): number {
    let filtered = this.filter(val => value === val)
    return filtered.length
}


