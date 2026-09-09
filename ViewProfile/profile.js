async function fetchAthletes() {

    const response = await fetch("athletes.json");

    if (!response.ok) {
        throw new Error("Could not fetch athletes");
    }

    const athletes = await response.json();

    return athletes;
}

 

const parameters = new URLSearchParams(window.location.search);

const id = Number(parameters.get("id"));

console.log("ID from URL:", id);


function displayAthleteInfo(athlete) {

    const divList = document.createElement("div");

    const name = document.createElement("h2");
    name.textContent = athlete.name;

    const position = document.createElement("h2");
    position.textContent = `Position: ${athlete.position}`;

    const age = document.createElement("h2");
    age.textContent = `Age: ${athlete.age}`;

    const location = document.createElement("h2");
    location.textContent = `Location: ${athlete.location}`;


    divList.appendChild(name);
    divList.appendChild(position);
    divList.appendChild(age);
    divList.appendChild(location);


    document.body.appendChild(divList);
}


fetchAthletes()
    .then(athletes => {

        console.log("Athletes:", athletes);
        console.log("ID we're looking for:", id);

        const athlete = athletes.find(athlete => athlete.id === id);

        console.log("Found athlete:", athlete);

        if (!athlete) {
            throw new Error("Athlete not found");
        }

        displayAthleteInfo(athlete);

    })
    .catch(error => {

        console.log("Error:", error);

    });
