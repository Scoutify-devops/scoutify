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


fetchAthletes()
    .then(athletes => {

        const athlete = athletes.find(athlete => athlete.id === id);

        console.log(athlete);

    })
    .catch(error => {

        console.log("Error:", error);

    });
