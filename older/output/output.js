
const fs = require('fs');

const getbestGenerationMin = ( generationFitnessValuesMin, generation ) => {
    let fittestValue = Math.max(...generationFitnessValuesMin);
    let fittestValueIndex = generationFitnessValuesMin.indexOf(fittestValue);
    let generationData = Object.values(generation);
    let bestChromosome = generationData[fittestValueIndex];

    console.log("Best Chromosme Selected Check file");
    fs.appendFileSync('./Records/output.pdf', 'best chromosome: ' + bestChromosome + '\t' + 'fitness value: ' + fittestValue + '\n');
}

module.exports = {
    getbestGenerationMin: getbestGenerationMin
}