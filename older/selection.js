const selectwithRW = ( generationfitnessValues, generation ) => {
    let selectedChromosomeT;
    let sumofRWratio;
    let selectedIndex;
    let sumfitness = generationfitnessValues.reduce((prev, curr) => prev + curr, 0);
    let RWratio = generationfitnessValues.map(value => (value/sumfitness) * 360);
    console.log(RWratio);
    sumofRWratio = RWratio.reduce((prev, curr) => prev + curr, 0);
    console.log(sumofRWratio);

    let selector = (Math.random() * 360);
    console.log("The selector: " + selector);
    selectedIndex = selectionReducer( RWratio, selector );
    console.log("The index of the selector: " + selectedIndex);

    for ( const value in generation ) {
        if(value == selectedIndex) {
            selectedChromosomeT = generation[value];
            break;
        }
    }

    selectedChromosomeT = selectedChromosomeT.map(el => el.reverse());
    return selectedChromosomeT;
}

const selectionReducer = ( RWratio, selector ) => {
    let accumulator = 0;
    let selectorIndex;
    for (i = 0; i < RWratio.length; i++) {
        accumulator = accumulator + RWratio[i]; 
        if(selector <= accumulator) {
            selectorIndex = [i];
            break;
        }
    }

    return selectorIndex;
}

const newgenerationSelection = ( prevGeneration, generationfitnessValues ) => {
    let newgeneration = {};
    for (const key in prevGeneration) {
        //Possible fix here use an array to push the values then turn the array to an object
        newgeneration[key] = selectwithRW(generationfitnessValues, prevGeneration);
    }

    console.log("==========================================================================");
    let population = Object.values(newgeneration);

    for( i = 0; i < population.length; i++ ) {
        newgeneration[i] = population[i];
    }

    return newgeneration;
}

const generateSelectors = () => {
    let selectors = [];

    for(let i = 0; i < 100; i++) {
        selectors[i] = Math.random();
    }

    return selectors;
}

module.exports = {
    RWselection: selectwithRW,
    getNewGeneration: newgenerationSelection,
    generateSelectors
}