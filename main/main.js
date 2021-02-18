const fs = require('fs');
const {getBase10} = require("./decode/decode");
const {initialPopulation, random} = require("./random/random");
const {generateSelectors} = require("../older/selection");
const {getfitnessMin} = require("./fitness/fitness");

class GeneticAlgorithm {
    constructor({
        chromosomeType, type, xmin, 
        xmax, ymin, ymax, zmin, zmax,
        crossthresh, probSelection, mutationthresh,
        crossPairs, mutationPairs, fitnessfunc,
        selectionType, selectionAvail
    }, generation, iteration) {
        this.iteration = iteration || 50;
        this.generation = generation || [...initialPopulation];
        this.type = type || 'min';
        this.chromosomeType = chromosomeType || 'binary';
        this.xmin = xmin || 0;
        this.xmax = xmax || 5;
        this.ymin = ymin || 5;
        this.ymax = ymax || 10;
        this.zmin = zmin || 10;
        this.zmax = zmax || 15;
        this.selectionProb = probSelection || generateSelectors();
        this.crossoverProb = crossthresh || 0.80;
        this.mutationProb = mutationthresh || 0.25;
        this.crossPairs = crossPairs || [];
        this.mutationPairs = mutationPairs || [];
        this.fitnessFunc = fitnessfunc;
        this.fitnessValues = [];
        this.relativeFitness = [];
        this.decodedGeneration = [];
        this.rwDegrees = [];
        this.newGeneration = [];
        this.nextGeneration = [];
        this.ranked = [];
        this.selectionType = selectionType || 'Roulette';
        this.selectionSupplied = selectionAvail || false;
    }

    decodeChromosome(chromosome) {
        let temp = [];

        chromosome.forEach((value, index) => {
            let denom = Math.pow(2, value.length) - 1;
            if(index === 0) {
                temp[index] = this.xmin + ((this.xmax - this.xmin)/denom)*(getBase10(value));
            } else if(index === 1) {
                temp[index] = this.ymin + ((this.ymax - this.ymin)/denom)*(getBase10(value));
            } else {
                temp[index] = this.zmin + ((this.zmax - this.zmin)/denom)*(getBase10(value));
            }
        });

        return temp;
    }

    decodeGeneration() {
        let decodedGeneration = [];

        for(let x = 0; x < this.generation.length; x++) {
            decodedGeneration[x] = this.decodeChromosome(this.generation[x]);
        }

        this.decodedGeneration = decodedGeneration;
    }

    fitnessValueCalculation() {
        if(this.type === 'min') {
            let values = [];

            if(this.fitnessFunc === undefined) {
                for(let g = 0; g < this.generation.length; g++) {
                    //* by default min fitness is used
                    values[g] = getfitnessMin(this.decodedGeneration[g]);
                }

                this.fitnessValues = values;
            } else {
                //* if fitnessfunc is given
                for(let g = 0; g < this.generation.length; g++) {
                    values[g] = this.fitnessFunc(this.decodedGeneration[g]);
                }

                this.fitnessValues = values.map(val => 1/val);
            }

        } else {
            //* this block prints out the max fitness
            let values = [];
            for(let g = 0; g < this.generation.length; g++) {
                values[g] = this.fitnessFunc(this.decodedGeneration[g]);
            }
            this.fitnessValues = values;
        }
    }

    //* this calculates the relative fitness
    relativeFitnessCalculation() {
        let temp = [];
        let totalFitness = this.fitnessValues.reduce((prev, curr) => prev + curr, 0);

        for(let i = 0; i < this.generation.length; i++) {
            temp[i] = this.fitnessValues[i]/totalFitness;
        }

        this.relativeFitness = temp;
    }

    //* this calculates the roulette wheel in degrees per chromosome
    rwDegreesPerChromosome() {
        let temp = [];
        let totalRelativeFitness = this.relativeFitness.reduce((prev, curr) => prev + curr, 0);

        for(let y = 0; y < this.fitnessValues.length; y++) {
            let relativeFitness = this.relativeFitness[y];
            temp[y] = (relativeFitness/totalRelativeFitness) * 360;
        }

        this.rwDegrees = temp;
    }

    //* this method performs roulette selection the generation
    rwSelection() {
        let newGenerationIndex = [];
        let selectionFilter = this.selectionProb.map(prob => prob * 360);
        let temp = [];
        
        //* goes through each selection prob value with respect to 360 degrees 
        selectionFilter.forEach((value, i) => {
            let index = 0;
            let sum = 0;
            let temp = [];

            //* a do while loop that checks if the chromosome rw degree value is within the rwdegrees
            do {
                temp.push(this.rwDegrees[index]);
                sum = temp.reduce((acc, curr) => acc + curr, 0);
                newGenerationIndex[i] = index;
                index = index + 1;
            } while (value > sum)
        });

        //* checks if we are using binary encoded chromosome and ensures their order
        if(this.chromosomeType !== 'decoded') {
             //func ensures they don't swap
            this.stabilize();
        }

        //* loop through our selected chromosome index and store their values in a temporary array
        for(let c = 0; c < newGenerationIndex.length; c++) {
            let index = newGenerationIndex[c];
            temp[c] = this.generation[index]
        }

        this.generation = [...temp];
    }

    //* this method performs elitism selection
    elitismSelection() {
        let chromosomePosition = [];
        let former = [...this.generation];
        
        //* sort the fitness values in ascending order 
        let rankedFitness = [...this.fitnessValues].sort((a, b) => a - b);

        //* loop through the sorted fitness values and store their original index 
        rankedFitness.forEach((rankedfitness => {
            let index = this.fitnessValues.findIndex(unrankedfitness => unrankedfitness === rankedfitness);
            chromosomePosition.push(index);
        }));

        //* loop through the original index of the ranked fitness and order the population accordingly
        for(let r = 0; r < chromosomePosition.length; r++) {
            let chromosome = former.filter((value, index) => (index === chromosomePosition[r]));
            this.generation[r] = chromosome[0];
        }

        //* make the fitnessvalues being used to be the ranked fitness
        this.fitnessValues = rankedFitness;
        
        //* finding the highest fitness value
        let best = Math.max(...this.fitnessValues);
        
        //* finding the best chromosome
        let bestChromosomeIndex = this.fitnessValues.findIndex((value) => (value === best));
        let bestChromosome = this.generation[bestChromosomeIndex];

        fs.appendFileSync('./output.pdf', `best chromosome: ${bestChromosome}, fitness value: ${best} \n`);

        //console.log(best);
        //console.log(bestChromosome);
        // console.log("chromosome position");
        // console.log(chromosomePosition);
    }

    /* 
    * method that sets the index of two chromosomes for GA operations using the limit and crosscount
    * limit is the max number of times we can expect crossover/mutation
    */
    setNewIndex(firstChromosome, secondChromosome, limit, crossCount) {
        for(let g = 0; g < limit; g++) {
            for(let v = g; v < g + 1; v++) {
                if(crossCount === g) {
                    this.newGeneration[v + g] = firstChromosome;
                    this.newGeneration[v + g + 1] = secondChromosome;
                }
            }
        }
    }

    //* method that ensures the original order of the alleles is kept
    stabilize() {
        for(let i = 0; i < this.generation.length; i++) {
            for(let j = 0; j < this.generation[i].length; j++ ) {
                this.generation[i][j].reverse();
            }
        }
    }

    //* method that swaps an element from a pair of alleles given a point to swap
    swap(point, allele1, allele2) {
        let temp = allele1[point];
        allele1[point] = allele2[point];
        allele2[point] = temp;
    }

    /* 
    * method that performs crossover requires the pairs to be crossed,
    * the point to start the crossover from, crossoverProb for the given pairs,
    * the crossover number(number of crossovers that have been done) crosscount
    */
    crossover(crossoverProb, point, pairs, crossCount) {
        //* checks if crossover will occur
        if(crossoverProb <= this.crossoverProb) {
            let firstIndex = pairs[0] - 1;
            let secondIndex = pairs[1] - 1;
            let crossPoint = point;
            let firstChromosome = this.generation[firstIndex];
            let secondChromosome = this.generation[secondIndex];
            let limit = this.generation.length/pairs.length;

            //* loops through the chromosomes 
            for(let i = 0; i < firstChromosome.length; i++) {
                //* loops through the crosspoint till the end of the allele and swaps
                for(let start = crossPoint; start > 0; start--) {
                    if(this.chromosomeType === 'decoded') {
                        let swapPoint = firstChromosome.length - start;
                        this.swap(swapPoint, firstChromosome, secondChromosome);
                    } else {
                        let swapPoint = firstChromosome[0].length - start;
                        this.swap(swapPoint, firstChromosome[i], secondChromosome[i]);
                    }
                }
            }

            this.setNewIndex(firstChromosome, secondChromosome, limit, crossCount);

            //* blueprint for two point crossover
            // for(let i = 0; i < firstChromosome.length; i++) {
            //     for(let start = crossPoint; start < endpoint; start++) {
            //         this.swap(start, firstChromosome[i], secondChromosome[i]);
            //     }
            // }
        } else {
            //* crossover does not occur set the next pair of alleles to take up the next index
            let firstIndex = pairs[0] - 1;
            let secondIndex = pairs[1] - 1;
            for(let w = 0; w < this.generation.length - 1; w++) {
                if(this.newGeneration[w] === undefined){
                    this.newGeneration[w] = this.generation[firstIndex];
                    this.newGeneration[w + 1] = this.generation[secondIndex];
                } 
            }
        }
    }

    //! this was made for default mode checks if we have undefined as a value in the allele
    check(array) {
        for(let f = 0; f < this.generation.length; f++) {
            for(let a = 0; a < this.generation[0].length; a++) {
                for(let b = 0; b < array[f][a].length; b++) {
                    if(array[f][a][b] === undefined) {
                        array[f][a].splice(b, 1);
                    }
                }
            }
        }

        return array;
    }

    /* 
    * method that performs mutation takes the same parameters as crossover
    * takes in an additional former parameter which is the population after crossover
    */
    mutation(mutationProb, point, pairs, crossCount, former) {

        //* check method removes any undefined values in the alleles
        let original = this.check(former);

        //* checks if mutation will occur
        if(mutationProb <= this.mutationProb) {
            let first = pairs[0] - 1;
            let second = pairs[1] - 1;
            let mutationPoint = point;
            let limit = this.generation.length/pairs.length;
            let firstChromosome = original[first];
            let secondChromosome = original[second];

            // console.log("====================> mutation logs..... <==================");
            // console.log("first inner allele length");
            // console.log(firstChromosome[0].length);
            // console.log("second");
            // console.log(secondChromosome);
            // console.log("pairs");
            // console.log(pairs);

            //* loops through each chromosome and swaps the values between each allele at mutation point
            for(let i = 0; i < firstChromosome.length; i++) {
                if(this.chromosomeType === 'decoded') {
                    let swapPoint = firstChromosome.length - mutationPoint;
                    this.swap(swapPoint, firstChromosome, secondChromosome);
                } else {
                    let swapPoint = firstChromosome[0].length - mutationPoint;
                    this.swap(swapPoint, firstChromosome[i], secondChromosome[i]);
                }
            }

            this.setNewIndex(firstChromosome, secondChromosome, limit, crossCount);

            // for(let g = 0; g < limit; g++) {
            //     for(let v = g; v < g + 1; v++) {
            //         if(crossCount === g) {
            //             this.nextGeneration[v + g] = firstChromosome;
            //             this.nextGeneration[v + g + 1] = secondChromosome;
            //         }
            //     }
            // }
        } else {
            //* mutation does not occur set the next pair of alleles to take up the next index 
            let firstIndex = pairs[0] - 1;
            let secondIndex = pairs[1] - 1;
            for(let w = 0; w < this.generation.length - 1; w++) {
                if(this.nextGeneration[w] === undefined){
                    this.nextGeneration[w] = original[firstIndex];
                    this.nextGeneration[w + 1] = original[secondIndex];
                } 
            }
        }
    }

    //* default method to be run showcases an example of the calculation
    start() {
        for(let i = 1; i < this.iteration + 1; i++) {
            if(this.chromosomeType === "decoded") {
                this.decodedGeneration = this.generation;
            } else {
                this.decodeGeneration();
                // console.log("============= DECODED GENERATION ============");
                // console.log(this.decodedGeneration);
            }

            this.fitnessValueCalculation();
            // console.log("============= FITNESS VALUES ================");
            // console.log(this.fitnessValues);

            this.elitismSelection();

            this.relativeFitnessCalculation();
            // console.log("============= RELATIVE FITNESS ==============");
            // console.log(this.relativeFitness);

            this.rwDegreesPerChromosome();
            // console.log("============= ROULETTE WHEEL DEGREES PER CHROMOSOME =========");
            // console.log(this.rwDegrees);

            this.rwSelection();
            // console.log("============ ROULETTE WHEEL SELECTED CHROMOSOMES ============");
            // console.log(this.generation);

            for(let c = 0; c < this.generation.length/2; c++) {
                let pairs = [];
                let crossProb = Math.random();
                let point = Math.round(Math.random() * 4);
                let parentOne = Math.round(random(1, 100));
                let parentTwo = Math.round(random(1, 100));

                if(parentOne === parentTwo) {
                    parentOne = Math.round(random(1, 100));
                }

                pairs[c] = [parentOne, parentTwo];
                this.crossover(crossProb, point, pairs[c], c);
            }

            for(let m = 0; m < this.generation.length/2; m++) {
                let pairs = [];
                let mutationProb = Math.random();
                let point = Math.round(Math.random() * 4);
                let original = this.newGeneration;
                let parentOne = Math.round(random(1, 100));
                let parentTwo = Math.round(random(1, 100));

                if(parentOne === parentTwo) {
                    parentOne = Math.round(random(1, 100));
                }

                pairs[m] = [parentOne, parentTwo];
                this.mutation(mutationProb, point, pairs[m], m, original);
            }

            // console.log("======================== After mutation ============================");
            // console.log(this.check(this.nextGeneration));

            this.generation = this.check(this.nextGeneration);
            this.nextGeneration = [];
            this.newGeneration = [];
        }
    }

    /* 
    * calculator method takes in the crossover probabilities, mutation probabilities,
    * crossover points and mutation points
    */
    calculate(crossProb, mutationProb, crossPoints, mutationPoints) {
        for(let i = 1; i < this.iteration + 1; i++) {
            if(this.selectionSupplied === false) {

                if(this.chromosomeType === "decoded") {
                    this.decodedGeneration = this.generation;
                } else {
                    this.decodeGeneration();
                    console.log("============= DECODED GENERATION ============");
                    console.log(this.decodedGeneration);
                }

                this.fitnessValueCalculation();
                console.log("============= FITNESS VALUES ================");
                console.log(this.fitnessValues);

                if(this.selectionType === 'elitism') {
                    this.elitismSelection();
                }

                this.relativeFitnessCalculation();
                console.log("============= RELATIVE FITNESS ==============");
                console.log(this.relativeFitness);


                this.rwDegreesPerChromosome();
                console.log("============= ROULETTE WHEEL DEGREES PER CHROMOSOME =========");
                console.log(this.rwDegrees);

                this.rwSelection();
                console.log("============ ROULETTE WHEEL SELECTED CHROMOSOMES ============");
                console.log(this.generation);
            }

            for(let f = 0; f < this.generation.length/2; f++) {
                this.crossover(crossProb[f], crossPoints[f], this.crossPairs[f], f);
            }

            console.log("=========== CROSSOVER SELECTED CHROMOSOMES ===========");
            console.log(this.newGeneration);

            let original = this.newGeneration;

            for(let m = 0; m < this.generation.length/2; m++) {
                this.mutation(mutationProb[m], mutationPoints[m], this.mutationPairs[m], m, original);
            }

            console.log("========== MUTATION SELECTED CHROMOSOMES =============");
            console.log(this.nextGeneration);

            console.log(`========== ${i}th GENERATION CHROMOSOMES ==============`);
            console.log(this.nextGeneration);
        }
    }
}

module.exports = GeneticAlgorithm;