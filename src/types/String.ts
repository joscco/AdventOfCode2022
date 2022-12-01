interface String {
    parseRows(): String[],

    parseIntRows(): number[]
}

String.prototype.parseRows = function (): String[] {
    return this.split("\n")
}

String.prototype.parseIntRows = function (): number[] {
    return this.split("\n").map(val => parseInt(val))
}
