const crossoverCalc = (allele1, allele2, position) => {
    var crosses = {};
    let holder;

    for(x = position; x < allele1.length; x++) {
        holder = allele1[x];
        allele1[x] = allele2[x];
        allele2[x] = holder;
    }

    crosses = {
        first: allele1,
        second: allele2
    }

    return crosses;

}

const crossOver = ( generation ) => {
    var decider;
    var parentOne;
    var parentTwo;
    var generationData = Object.values(generation);
    var crossedGeneration = {...generation};
    var chosenIndex = [];
    var loopEnd = Math.round((generationData.length/2))

    outer: for(i = 0; i < loopEnd; i++) {
        console.log("Hello World");
        decider = Math.random();
        parentOne = Math.round((Math.random() * 4));
        parentTwo = Math.round((Math.random() * 4));
        chosenIndex.push([parentOne, parentTwo]);

        console.log("The decider itself: " + decider);


        if(parentOne === parentTwo) {
            parentOne = Math.floor((Math.random() * 4));
        }

        console.log("parent two index: " + parentTwo + " try: " + [i]);
        console.log("parent one index: " + parentOne + " try: " + [i]);

        let Parent1 = generationData[parentOne];
        console.log(Parent1);
        let Parent2 = generationData[parentTwo];

        if(decider <= 0.8) {
            var position = Math.round(Math.random() * 4);
            console.log("The position: ");
            console.log(position);

            let work = crossoverCalc(Parent1[2], Parent2[2], position);

            Parent1[2] = work.first;
            Parent2[2] = work.second;
            crossedGeneration[parentOne] = Parent1;
            crossedGeneration[parentTwo] = Parent2;
            continue outer;
        }

        console.log('went through for');
        crossedGeneration[parentOne] = Parent1;
        crossedGeneration[parentTwo] = Parent2;
    }

    return crossedGeneration;
}

module.exports = {
    crossover: crossOver
}