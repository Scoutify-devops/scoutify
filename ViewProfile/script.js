async function fetchAthletes() {

    const response = await fetch("athletes.json");

    if (!response.ok) {
        throw new Error("Could not fetch athletes");
    }

    const athletes = await response.json();

    return athletes;
}


function displayAthletes(athletes) {

    const athleteList = document.getElementById("athleteList");

    athletes.forEach(athlete => {

        const athleteDiv = document.createElement("div");

        const name = document.createElement("h2");
        name.textContent = athlete.name;

        const position = document.createElement("p");
        position.textContent = athlete.position;

        const button = document.createElement("button");
        button.textContent = "View Profile";

        
        button.addEventListener("click", () => {

            window.location.href = `profile.html?id=${athlete.id}`;

        });

        athleteDiv.appendChild(name);
        athleteDiv.appendChild(position);
        athleteDiv.appendChild(button);

        athleteList.appendChild(athleteDiv);
    });
}


fetchAthletes()
    .then(athletes => {

        displayAthletes(athletes);

    })
    .catch(error => {

        console.log("Error:", error);

    });
