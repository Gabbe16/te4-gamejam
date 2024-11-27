import Bottleneck from 'bottleneck'

// change this to your api key
const api_key = "e3d81809-b093-4872-8b04-9269589a1b0e"

const limiter = new Bottleneck({
    minTime: 200
})

function throttleFetch(url, options) {
    return limiter.schedule(() => fetch(url, options))
}

export function apiSetup(element) {
    console.log('hello from apitest.js')

    const url = "http://localhost:3000"
    
    throttleFetch(url)
    .then((response) => response.text())
    .then((text) => {
        console.log(text)
    })
    .catch((error) => {
        console.error(error)
    })

    element.innerHTML = `
    <button id="postScore">Post Score</button>
    <button id="getScore">Get Score</button>
    `
    document.querySelector("#postScore").addEventListener("click", () => {
        postScore(4500, "alfred")
    })

    document.querySelector("#getScore").addEventListener("click", () => {
        getScore(element)
    })
}

export function postScore(score, user_id) {
    // let nickname = prompt('Enter your username')
    const url = "http://localhost:3000"
    const data = { score, user_id }
    
    throttleFetch(`${url}/game/${api_key}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.text())
    .then((text) => {
        console.log(text)
    })
    .catch((error) => {
        console.error(error)
    })
}

export function getScore(element) {
    const url = "http://localhost:3000"

    throttleFetch(`${url}/game/${api_key}/scores`)
    .then((response) => response.text())
    .then((text) => {
        console.log(text)
        const scores = JSON.parse(text)
        const list = document.createElement('ul')
        scores.forEach((score) => {
            const item = document.createElement('li')
            item.textContent = `${score.nickname}: ${score.score}`
            list.appendChild(item)
        });
        element.appendChild(list)
    })
    .catch((error) => {
        console.error(error)
    })
}