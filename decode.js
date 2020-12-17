/* 
    This decode file is where all conversions in genetic algorithms occur 
*/

// function used to convert binary to decimal
const decodeBinary = ( arr ) => {
    let decodedValue;
    let decoded = [];

    let array = arr.reverse();
    for(i = 0; i < array.length; i++) {
        let val = array[i]
        let index = array.indexOf(val, i);
        let decodedString = val * Math.pow(2, index);
        decoded.push(decodedString);
    }

    decodedValue = decoded.reduce((prev, curr) => prev + curr, 0);
    return decodedValue;
}

// function used to convert all alleles in the chromosome to base10 
const decodeBinaryChromosome = ( chromosome ) => {
    let x;
    let y;
    let z;
    let decodedChromosome;
    x = decodeBinary(chromosome[0]);
    y = decodeBinary(chromosome[1]);
    z = decodeBinary(chromosome[2]);

    decodedChromosome = {
        'x': x,
        'y': y,
        'z': z
    };

    return decodedChromosome;
}

// function used obtain the fitness value from the base 10 chromosome value
const decodefitnessValue = (alleleValue, decodedChromosome) => {
    let min;
    let max;

    if(alleleValue === 'x') {
        min = 0;
        max = 5;
    }

    if(alleleValue === 'y') {
        min = 5;
        max = 10;
    }

    if(alleleValue === 'z') {
        min = 10;
        max = 15;
    }

    let x = min + ((max - min)/(Math.pow(2, 5) - 1 )) * decodedChromosome[alleleValue]
    return x;
}

// function to obtain the fitness variable used in the fitness function from the decodedChromosome
const decodefitnessVariables = ( decodedChromosome ) => {
    let decodedfitnessVariables;
    let x = decodefitnessValue('x', decodedChromosome);
    let y = decodefitnessValue('y', decodedChromosome);
    let z = decodefitnessValue('z', decodedChromosome);
    decodedfitnessVariables = {
        x: x,
        y: y,
        z: z
    };

    return decodedfitnessVariables;
}

// function to obtain base 10 values for each chromosome in the generation
const decodeBinaryGeneration = ( generation ) => {
    let decodedBinaryGeneration = {};
    let arr = [];

    for ( value in generation ) {
        let x = decodeBinaryChromosome(generation[value]);
        arr.push(x);
    }

    for (i = 0; i < arr.length; i++ ) {
        decodedBinaryGeneration[i] = arr[i];
    }

    return decodedBinaryGeneration;
}

// function to obtain the fitness variables for each chromosome in the generation
const fitnessGenerationVariables = ( decodedBinaryGeneration ) => {
    let generationFitnessVariables = {};
    let arr = [];

    for ( value in decodedBinaryGeneration ) {
        let x = decodefitnessVariables(decodedBinaryGeneration[value]);
        arr.push(x);
    }

    for(i = 0; i < arr.length; i++) {
        generationFitnessVariables[i] = arr[i];
    }

    return generationFitnessVariables;
}



module.exports = {
    getBase10: decodeBinary,
    getdecodedChromosome: decodeBinaryChromosome,
    getdecodedfitnessValue: decodefitnessValue,
    getdecodedfitnessVariables: decodefitnessVariables,
    getBase10Generation: decodeBinaryGeneration,
    getFitnessGenerationVariables: fitnessGenerationVariables
}


// for library purposes in case if length was not given we get it from the allele
// const decodefitnessValue = (alleleValue, allele, decodedChromosome) => {
//     let min;
//     let max;

//     if(alleleValue === 'x') {
//         min = 0;
//         max = 5;
//     }

//     if(alleleValue === 'y') {
//         min = 5;
//         max = 10;
//     }

//     if(alleleValue === 'z') {
//         min = 10;
//         max = 15;
//     }

//     let x = min + ((max - min)/(Math.pow(2, allele.length) - 1 )) * decodedChromosome[alleleValue]
//     return x;
// }