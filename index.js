const { generate } = require('./random');
const { getFitnessGenerationVariables, getBase10Generation } = require('./decode');
const { getGenerationFitnessMin } = require('./fitness');
const { rankAscendingFitnessMin } = require('./ranking');
const { getbestGenerationMin } = require('./Records/output');
const { getNewGeneration } = require('./selection');
const { crossover } = require('./crossover');
const { mutation } = require('./mutation');

//50 generations 
for(let i = 0; i < 50; i++) {
    //initial population generation code
    var y = generate();
    console.log("################################################################################");
    console.log("Initial population: ")
    console.log(y);
    console.log("");

    //Binary Conversion of Chromosomes to base 10
    console.log("################################################################################");
    console.log("Converting each binary coded chromosome to decimal");
    var z = getBase10Generation(y);
    console.log("");

    //Calculating the fitness values in the minimization problem
    console.log("################################################################################");
    console.log("Calculating fitness in the minimization problem");
    var a = getFitnessGenerationVariables(z);
    var c = getGenerationFitnessMin(a);
    console.log("The Min generation fitness: ");
    console.log(c);
    console.log("");

    //Finding the best chromosome in the generation and printing out a file
    console.log("################################################################################");
    console.log("Finding the best chromosome in the generation");
    var b = getbestGenerationMin(c, y);
    console.log("");

    //Ranking the fitness values in ascending order;
    console.log("################################################################################");
    console.log("Ranking the chromosomes in ascending order");
    var r = rankAscendingFitnessMin(c);
    console.log("In ascending order the fitness values: ")
    console.log(r);
    console.log("");

    //performing selection using roulette wheel
    console.log("################################################################################");
    console.log("Performing Selection using roulette wheel");
    var d = getNewGeneration(y, c);
    console.log("The selected chromosomes: ");
    console.log(d);
    console.log("")

    //performing crossover with a crossover probability of 0.8 
    console.log("################################################################################");
    console.log("Performing Crossover using the crossover probability 0.80");
    var e = crossover(d);
    console.log("The crossover produces: ");
    console.log(e);
    console.log("")

    //performing mutation with a mutation probabilty of 0.25
    console.log("################################################################################");
    console.log("Performing Mutation");
    var f = mutation(e);
    console.log("The mutation produces: ");
    console.log(f);
}

console.log("");
console.log("End of Code");

