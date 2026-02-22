import orchestrator from "./orchestrator.js";

const heavy = (n) => {
    let sum = 0;
    for(let i = 0; i < 20_000_000_000; i++){
        sum++;
    }
    return sum + n;
}

(async () =>{
    const results = await Promise.all([
        orchestrator.run(heavy, [1]),
        orchestrator.run(heavy, [2]),
        orchestrator.run(heavy, [3]),
        orchestrator.run(heavy, [4]),
        orchestrator.run(heavy, [5]),
        orchestrator.run(heavy, [6]),
        orchestrator.run(heavy, [7]),
        orchestrator.run(heavy, [8]),
        orchestrator.run(heavy, [9]),
        orchestrator.run(heavy, [10]),
        orchestrator.run(heavy, [11]),
        orchestrator.run(heavy, [12]),
    ]);
    console.log(results);
})();
