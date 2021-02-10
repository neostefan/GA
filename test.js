const GeneticAlgorithm = require('./main/main');

const gaInstance = new GeneticAlgorithm(
    [
        [[0, 0, 1, 1, 0], [0, 1, 0, 0, 1], [1, 1, 0, 0, 0]], 
        [[1, 1, 1, 0, 1], [0, 0, 0, 0, 1], [1, 1, 0, 1, 1]],
        [[0, 0, 0, 0, 0], [0, 1, 1, 1, 0], [1, 1, 1, 0, 0]],
        [[0, 0, 1, 1, 0], [0, 1, 0, 0, 1], [1, 1, 0, 0, 0]],
        [[0, 0, 1, 1, 0], [0, 1, 0, 0, 1], [1, 1, 0, 0, 0]],
        [[1, 0, 1, 0, 0], [1, 0, 0, 1, 0], [0, 1, 0, 0, 0]]
    ], 1, 
    { xmin: 2, xmax: 5, ymin: 5, ymax: 10, zmin: 10, zmax: 15, type: 'min', 
    probSelection: [0.44, 0.19, 0.78, 0.59, 0.72, 0.34],
        fitnessfunc: (chromosome) => {
            let x = chromosome[0];
            let y = chromosome[1];
            let z = chromosome[2];

            let fitness = x * y * x + x * y + x * z + y * z - x -y -z;
            return fitness;
        }, crossthresh: 0.85, mutationthresh: 0.2, 
        crossPairs: [[3, 4], [2, 5], [1, 6]], 
        mutationPairs: [[2, 3], [5, 6], [1, 3]],
        chromosomeType: 'binary'
    }
);

gaInstance.calculate([0.65, 0.59, 0.74], [0.43, 0.14, 0.55], [3, 2, 2], [1, 2, 3]);