interface String {
    parseRows(): String[],

    parseIntRows(): number[],

    findCommonLettersWith(other: String[] | String): String[]
    isUpperCase(): boolean
}

String.prototype.parseRows = function (): String[] {
    return this.split("\n")
}

String.prototype.parseIntRows = function (): number[] {
    return this.split("\n").map(val => parseInt(val))
}

String.prototype.isUpperCase = function(): boolean {
    return /^[A-Z]*$/.test(this as string)
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
