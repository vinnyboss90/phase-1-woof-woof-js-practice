
//When the page loads, use fetch to get all of the pup data from your server. When you have this information, you'll need to add a span with the pup's name to the dog bar

document.addEventListener('DOMContentLoaded', () => {
    fetchDogs()
}   )

function fetchDogs() {
    fetch('http://localhost:3000/pups')
    .then(resp => resp.json())
    .then(dogs => dogs.forEach(dog => renderDog(dog)))
}

function renderDog(dog) {
    const dogBar = document.querySelector('#dog-bar')
    const span = document.createElement('span')
    span.innerText = dog.name
    span.addEventListener('click', () => showDog(dog))
    dogBar.appendChild(span)
}

//When a user clicks on a pup's span in the dog bar, that pup's info (image, name, and isGoodDog status) should show up in the div with the id of "dog-info". When you have the pup's information, the dog info div should have the following children:

function showDog(dog) {
    const dogInfo = document.querySelector('#dog-info')
    dogInfo.innerHTML = `
    <img src=${dog.image}>
    <h2>${dog.name}</h2>
    `
    const button = document.createElement('button')
    button.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
    button.addEventListener('click', () => toggleDog(dog, button))
    dogInfo.appendChild(button)
}

//When a user clicks the Good Dog/Bad Dog button, two things should happen:
//The button's text should change from Good to Bad or Bad to Good
//The corresponding pup object in the database should be updated to reflect the new isGoodDog value

function toggleDog(dog, button) {
    dog.isGoodDog = !dog.isGoodDog
    fetch(`http://localhost:3000/pups/${dog.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({isGoodDog: dog.isGoodDog})
    })
    .then(resp => resp.json())
    .then(data => {
        button.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
    })
}

//When a user clicks on the Filter Good Dogs button, two things should happen:
//The button's text should change from "Filter good dogs: OFF" to "Filter good dogs: ON", or vice versa.
//If the button now says "ON" (meaning the filter is on), then the Dog Bar should only show pups whose isGoodDog attribute is true. If the filter is off, the Dog Bar should show all pups (like normal).

const filterButton = document.querySelector('#good-dog-filter')
filterButton.addEventListener('click', () => toggleFilter())

function toggleFilter() {
    filterButton.innerText = filterButton.innerText.includes("OFF") ? "Filter good dogs: ON" : "Filter good dogs: OFF"
    const dogBar = document.querySelector('#dog-bar')
    dogBar.innerHTML = ""
    if (filterButton.innerText.includes("ON")) {
        fetch('http://localhost:3000/pups')
        .then(resp => resp.json())
        .then(dogs => dogs.filter(dog => dog.isGoodDog === true))
        .then(goodDogs => goodDogs.forEach(dog => renderDog(dog)))
    } else {
        fetchDogs()
    }
}