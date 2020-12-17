const ascendingOrderFitnessMax = ( generationfitnessValues ) => {
    generationfitnessValues.sort((a, b) => a - b);
    return generationfitnessValues;
}

const ascendingOrderFitnessMin = ( generationfitnessValues ) => {
    for (i = 0; i < generationfitnessValues.length; i++) {
        generationfitnessValues[i] = 1/generationfitnessValues[i];
    }

    generationfitnessValues.sort((a, b) => a - b);

    return generationfitnessValues;
}

module.exports = {
    rankAscendingFitnessMax: ascendingOrderFitnessMax,
    rankAscendingFitnessMin: ascendingOrderFitnessMin
}