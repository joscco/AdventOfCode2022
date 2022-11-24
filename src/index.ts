import SolutionManager from "./SolutionManager";
import "./types/Array"
import "./types/String"

const args = process.argv.slice(2);
const dayNumber = args[0];

if (!dayNumber) {
    console.error('No day specified run with npm run day {dayNumber}');
    process.exit(1);
}

(async () => {
    const solution = await SolutionManager.getSolution(args[0]);
    console.log(`Solving Day ${dayNumber}:`)
    solution.solve()
})();