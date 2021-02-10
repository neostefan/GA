const getRandom = (min, max) => {
    Math.ceil(min);
    Math.floor(max);
    return Math.floor(Math.random()* (max - min + 1) + min);
}

//function used to generate an allele of 5 binary digits
const generateAllele = () => {
    let value = getRandom(1, 31);
    let chromosome = [];

    for(i = 0; i < 5; i++) {
        if((value % 2) !== 0 ) {
            let x = value % 2;
            chromosome.push(x);
        }
        if((value % 2) === 0) {
            let y = value % 2;
            chromosome.push(y);
        }
        value = Math.floor(value/2);
    }

    chromosome = chromosome.reverse();
    return chromosome;
}

// function used to generate a chromosome from an allele
const generateChromosome = () => {
    let chromosome = [];
    let x = generateAllele();
    let y = generateAllele();
    let z = generateAllele();
    chromosome.push(x);
    chromosome.push(y);
    chromosome.push(z);

    return chromosome;
}

// function used to generate the initial population of GA 
const generateInitialPopulation = () => {
    let initial = {};
    let arr = []

    for(i = 0; i < 100; i++) {
        arr.push(i);
    }

    for(const value of arr) {
        initial[value] = generateChromosome();
    }

    return initial;
}

module.exports = {
    random: getRandom,
    chromosome: generateChromosome,
    allele: generateAllele,
    generate: generateInitialPopulation
}