import Bottleneck from 'bottleneck'

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
    <button id="login">Login</button>
    <button id="logout">Logout</button>
    `

    document.querySelector("#postScore").addEventListener("click", () => {
        postScore(1, 100, 1)
    })

    document.querySelector("#login").addEventListener("click", () => {
        const nickname = prompt('Enter your username')
        login(nickname)
    })

    document.querySelector("#logout").addEventListener("click", () => {
        logout()
    })

    document.querySelector("#getScore").addEventListener("click", () => {
        getScore(element)
    })
}

export function postScore(game_id, score, user_id) {
    const url = "http://localhost:3000"
    const data = { game_id, score, user_id }
    
    throttleFetch(`${url}/game/1`, {
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

export function login(nickname) {
    const url = "http://localhost:3000"
    const data = { nickname }
    
    throttleFetch(`${url}/login`, {
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

export function logout(nickname) {
    const url = "http://localhost:3000"
    
    throttleFetch(`${url}/logout`)
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

    throttleFetch(`${url}/game/1/scores`)
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