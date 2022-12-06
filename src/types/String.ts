interface String {
    containsMultipleLetters(): boolean
    findCommonLettersWith(other: String[] | String): String[]
    isUpperCase(): boolean
    parseRows(): String[],
    parseIntRows(): number[],
    splitAt(index: number): String[],
    slideWindow(width: number): String[]
}

String.prototype.containsMultipleLetters = function (): boolean {
    for (let i = 0; i < this.length - 1; i++) {
        if (this.substring(Math.min(i + 1, this.length - 1), this.length).indexOf(this.charAt(i)) > -1) {
            return true
        }
    }
    return false
}

String.prototype.findCommonLettersWith = function (other: String | String[]): String[] {
    let result: Set<String> = new Set()
    for (let i = 0; i < this.length; i++) {
        if (other.indexOf(this.charAt(i)) > -1) {
            result.add(this.charAt(i))
        }
    }
    return Array.of(...result)
}

String.prototype.isUpperCase = function (): boolean {
    return /^[A-Z]*$/.test(this as string)
}

String.prototype.parseRows = function (): String[] {
    return this.split("\n")
}

String.prototype.parseIntRows = function (): number[] {
    return this.split("\n").map(val => parseInt(val))
}

String.prototype.splitAt = function (index: number): String[] {
    return [this.slice(0, index), this.slice(index, this.length)]
}

String.prototype.slideWindow = function (width: number): String[] {
    let result = [];
    for (let i = width - 1; i < this.length; i++) {
        result.push(this.slice(i - width + 1, i + 1))
    }
    return result
}
