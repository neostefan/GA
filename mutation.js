const { random } = require('./random');

const mutator = (parent1, parent2) => {
    let position = Math.round((Math.random() * 4));
    let holder;
    let output;

    for(let i = 0; i < parent1.length; i++) {
        if(position == [i]) {
            holder = parent1[position];
            parent1[position] = parent2[position];
            parent2[position] = holder;
            console.log("MUTATION IN PROGRESS");
            break;
        }
    }

    output = {
        first: parent1,
        second: parent2
    };

    return output;
}

const mutation = (generation) => {
    let generationData = Object.values(generation);
    let crossedGeneration = {...generation};
    let decider;
    let parentOne;
    let parentTwo;
    let endLoop = Math.round(generationData.length/2);

    outer: for(let i = 0; i < endLoop; i++) {
        decider = Math.random();
        parentOne = random(0, (generationData.length - 1));
        parentTwo = random(0, (generationData.length - 1));

        let parent1 = generationData[parentOne];
        let parent2 = generationData[parentTwo];

        if(parentOne === parentTwo) {
            parentOne = Math.round(Math.random() * (generationData.length - 1));
        }
        console.log("Mutation's parentOne index: " + parentOne + " for try: " + [i]);
        console.log("Mutation's parentTwo index: " + parentTwo + " for try: " + [i]);

        if(decider <= 0.25) {
            let output = mutator(parent1[2], parent2[2]);

            parent1[2] = output.first;
            parent2[2] = output.second;

            crossedGeneration[parentOne] = parent1;
            crossedGeneration[parentTwo] = parent2;
            continue outer;
        }

        crossedGeneration[parentOne] = parent1;
        crossedGeneration[parentTwo] = parent2;
    }

    return crossedGeneration;
    
}

module.exports = {
    mutator: mutator,
    mutation: mutation
}