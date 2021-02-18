## Genetic Algorithm Calculator in JS
----
### A calculator for genetic algorithm written in Javascript, please **NOTE** the code is still improving and anyone is welcome to contribute.

### The main genetic algorithm is written in the main folder, the older folder contains an older implementation of the genetic algorithm.

### **NOTE** this is not an npm package at least not yet looking for ways i can optimize this first before making it into a package 

---
## Usage Instructions
---
### NodeJS **MUST** be installed to run the program.
### If NodeJS is installed, after cloning the repository run
```Javascript
npm start
```
### The command above runs a default example with an initial population of 100 and outputs the best chromosome and fitness values for each generation in an output.pdf file.

### To use the calculator check the code block below, preferably run all your work with the code inside the index.js file, you can however create another file to work with the calculator if you wish.

### Calculator Example
```Javascript
const gaInstance = new GeneticAlgorithm({
    xmin: 2, xmax: 5, ymin: 5, ymax: 10, zmin: 10, zmax: 15, type: 'min', 
    probSelection: [0.44, 0.19, 0.78, 0.59, 0.72, 0.34],
    fitnessfunc: (chromosome) => {
        let x = chromosome[0];
        let y = chromosome[1];
        let z = chromosome[2];

        let fitness = x * y * x + x * y + x * z + y * z - x -y -z;
        return fitness;
    },
    crossthresh: 0.85, mutationthresh: 0.2, 
    crossPairs: [[3, 4], [2, 5], [1, 6]], 
    mutationPairs: [[2, 3], [5, 6], [1, 3]],
    chromosomeType: 'decoded',
    selectionType: 'elitism',
    selectionAvail: true
    }, [
        [2.329, 10, 10.839],
        [4.106, 6.189, 14.354],
        [5, 10, 10.839],
        [5, 6.189, 14.354],
        [4.106, 6.189, 14.354],
        [2.329, 10, 10.839]
    ], 1);
```
### As seen above the genetic algoithm instance takes a lot of options, the initial population and the number of iterations.
```Javascript
const gaInstance = new GeneticAlgorithm(options, generation, iteration);
```
## Some Options
---
* **xmin/xmax, ymin/ymax, zmin/zmax** : min and max values for x, y and z respectively
*  **chromosomeType** : whether the chromosomes are base10/decoded(default) or binary entries.

## Methods
___
### The default method called when you run the __npm start__ command is the start method on the gaInstance, it is inside the index.js file
### To use the calculator you must call the calculate method on the gaInstance
```Javascript
gaInstance.calculate(crossProb, mutationProb, crossPoints, mutationPoints);
```
* **crossProb** : is an array of the probabilities of crossover happening between the pairs specified when gaInstance is created.
* **mutationProb** : is an array of the probabilities of mutation between the pairs specified when gaInstance is created.
* **crossPoints** : array of the points where crossover begins **ONE POINT CROSSOVER** is the only crossover approach implemented.
* **mutationPoints** array of points where mutation occurs between the pairs specified when gaInstance is created.
### An example with all option in calculate method filled
```Javascript
gaInstance.calculate(
    [0.65, 0.59, 0.74],//crossprob 
    [0.43, 0.14, 0.55],//mutationprob 
    [3, 2, 2],//crosspoints 
    [1, 2, 3]//mutationpoints
    );
```




