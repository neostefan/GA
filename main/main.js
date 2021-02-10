const {getBase10} = require("./decode/decode");

class GeneticAlgorithm {
    constructor(generation, iteration, options) {
        this.iteration = iteration;
        this.generation = generation;
        this.type = options.type || 'max';
        this.chromosomeType = options.chromosomeType || 'decoded';
        this.xmin = options.xmin || 0;
        this.xmax = options.xmax || 0;
        this.ymin = options.ymin || 0;
        this.ymax = options.ymax || 0;
        this.zmin = options.zmin || 0;
        this.zmax = options.zmax || 0;
        this.selectionProb = options.probSelection || [];
        this.crossoverProb = options.crossthresh || 0;
        this.mutationProb = options.mutationthresh || 0;
        this.crossPairs = options.crossPairs || [];
        this.mutationPairs = options.mutationPairs || [];
        this.fitnessFunc = options.fitnessfunc;
        this.fitnessValues = [];
        this.relativeFitness = [];
        this.decodedGeneration = [];
        this.rwDegrees = [];
        this.newGeneration = [];
        this.nextGeneration = [];
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
            for(let g = 0; g < this.generation.length; g++) {
                values[g] = this.fitnessFunc(this.decodedGeneration[g]);
            }
            console.log("============= MAX FITNESS VALUES ============");
            console.log(values);
            this.fitnessValues = values.map(val => 1/val);
        } else {
            let values = [];
            for(let g = 0; g < this.generation.length; g++) {
                values[g] = this.fitnessFunc(this.decodedGeneration[g]);
            }
            this.fitnessValues = values;
        }
    }

    relativeFitnessCalculation() {
        let temp = [];
        let totalFitness = this.fitnessValues.reduce((prev, curr) => prev + curr, 0);

        for(let i = 0; i < this.generation.length; i++) {
            temp[i] = this.fitnessValues[i]/totalFitness;
        }

        this.relativeFitness = temp;
    }

    rwDegreesPerChromosome() {
        let temp = [];
        let totalRelativeFitness = this.relativeFitness.reduce((prev, curr) => prev + curr, 0);

        console.log("=============== TOTAL RELATIVE FITNESS =============");
        console.log(totalRelativeFitness);

        for(let y = 0; y < this.fitnessValues.length; y++) {
            let relativeFitness = this.relativeFitness[y];
            temp[y] = (relativeFitness/totalRelativeFitness) * 360;
        }

        this.rwDegrees = temp;
    }

    rwSelection() {
        let newGenerationIndex = [];
        let selectionFilter = this.selectionProb.map(prob => prob * 360);
        let temp = [];
        
        selectionFilter.forEach((value, i) => {
            let index = 0;
            let sum = 0;
            let temp = [];

            do {
                temp.push(this.rwDegrees[index]);
                sum = temp.reduce((acc, curr) => acc + curr, 0);
                newGenerationIndex[i] = index;
                index = index + 1;
            } while (value > sum)
        });

        //func ensures they don't swap
        this.stabilize();

        for(let c = 0; c < newGenerationIndex.length; c++) {
            let index = newGenerationIndex[c];
            temp[c] = this.generation[index]
        }

        this.generation = temp;
    }

    setNewIndex(firstChromosome, secondChromosome, limit, crossCount) {
        let indexA;
        let indexB;
        for(let g = 0; g < limit; g++) {
            for(let v = g; v < g + 1; v++) {
                if(crossCount === g) {
                    indexA = v + g;
                    indexB = v + g + 1;
                    this.newGeneration[v + g] = firstChromosome;
                    this.newGeneration[v + g + 1] = secondChromosome;
                }
            }
        }
    }

    stabilize() {
        for(let i = 0; i < this.generation.length; i++) {
            for(let j = 0; j < this.generation[0].length; j++ ) {
                this.generation[i][j].reverse();
            }
        }
    }

    swap(point, allele1, allele2) {
        let temp = allele1[point];
        allele1[point] = allele2[point];
        allele2[point] = temp;
    }

    crossover(crossoverProb, point, pairs, crossCount) {
        if(crossoverProb <= this.crossoverProb) {
            let firstIndex = pairs[0] - 1;
            let secondIndex = pairs[1] - 1;
            let crossPoint = point;
            let firstChromosome = this.generation[firstIndex];
            let secondChromosome = this.generation[secondIndex];
            let limit = this.generation.length/pairs.length;
        
            for(let i = 0; i < firstChromosome.length; i++) {
                for(let start = crossPoint; start > 0; start--) {
                    let swapPoint = firstChromosome[0].length - start;
                    this.swap(swapPoint, firstChromosome[i], secondChromosome[i]);
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

    mutation(mutationProb, point, pairs, crossCount, former) {
        let original = former;
        if(mutationProb <= this.mutationProb) {
            let first = pairs[0] - 1;
            let second = pairs[1] - 1;
            let mutationPoint = point;
            let limit = this.generation.length/pairs.length;
            let firstChromosome = this.newGeneration[first];
            let secondChromosome = this.newGeneration[second];

            console.log(crossCount);
            console.log(firstChromosome);
            console.log(secondChromosome);

            for(let i = 0; i < firstChromosome.length; i++) {
                let swapPoint = firstChromosome[0].length - mutationPoint;
                this.swap(swapPoint, firstChromosome[i], secondChromosome[i]);
            }

            for(let g = 0; g < limit; g++) {
                for(let v = g; v < g + 1; v++) {
                    if(crossCount === g) {
                        this.nextGeneration[v + g] = firstChromosome;
                        this.nextGeneration[v + g + 1] = secondChromosome;
                    }
                }
            }
        } else {
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

    calculate(crossProb, mutationProb, crossPoints, mutationPoints) {
        for(let i = 1; i < this.iteration + 1; i++) {
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
            this.relativeFitnessCalculation();
            console.log("============= RELATIVE FITNESS ==============");
            console.log(this.relativeFitness);
            this.rwDegreesPerChromosome();
            console.log("============= ROULETTE WHEEL DEGREES PER CHROMOSOME =========");
            console.log(this.rwDegrees);
            this.rwSelection();
            console.log("============ ROULETTE WHEEL SELECTED CHROMOSOMES ============");
            console.log(this.generation);

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