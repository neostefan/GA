/*  
    This file has the fitness calculations involved in GA
*/

// function to obtain the max fitness from the decodedfitnessVariables 
const fitnessMax = ( decodedfitnessVariables ) => {
    let x = decodedfitnessVariables.x;
    let y = decodedfitnessVariables.y;
    let z = decodedfitnessVariables.z;

    let fitnessValue = x * y * x + x * y + x * z + y * z - x - y - z;
    return fitnessValue;
}

// function to obtain min fitness from the decodedfitnessVariables
const fitnessMin = ( decodedfitnessVariables ) => {
    let x = decodedfitnessVariables.x;
    let y = decodedfitnessVariables.y;
    let z = decodedfitnessVariables.z;

    let fitnessValue = x * y * x + x * y + x * z + y * z - x - y - z;
    let Minfitness = 1/fitnessValue;

    return Minfitness;
}

//function to obtain the fitness for a whole generation from the decodedFitnessGenerationVariables 
const getGenerationFitnessMax = ( decodedFitnessGenerationVariables ) => {
    let generationFitness = [];

    for ( value in decodedFitnessGenerationVariables) {
        let x = fitnessMax(decodedFitnessGenerationVariables[value]);
        generationFitness.push(x);
    }

    return generationFitness;
}

const getGenerationFitnessMin = ( decodedFitnessGenerationVariables ) => {
    let Mingenerationfitness = [];

    for ( value in decodedFitnessGenerationVariables) {
        let x = fitnessMin(decodedFitnessGenerationVariables[value]);
        Mingenerationfitness.push(x);
    }

    return Mingenerationfitness;
}

module.exports = {
    getfitnessMax: fitnessMax,
    getfitnessMin: fitnessMin,
    getGenerationFitnessMax: getGenerationFitnessMax,
    getGenerationFitnessMin: getGenerationFitnessMin
}