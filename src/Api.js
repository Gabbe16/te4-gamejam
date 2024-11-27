import Bottleneck from 'bottleneck'

export default class Api {
    constructor(game) {
        this.game = game
        // test api key
        this.api_key = 'e3d81809-b093-4872-8b04-9269589a1b0e'
        this.url = "http://localhost:3000"

        this.limiter = new Bottleneck({
            minTime: 200
        })
    }

    throttleFetch(url, options) {
        return this.limiter.schedule(() => fetch(url, options))
    }

    postScore() {
        let nickname = prompt('Enter your username')
        const data = { score: this.game.score, user_id: nickname }
        
        this.throttleFetch(`${this.url}/game/${this.api_key}`, {
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

    getScore(element) {
        throttleFetch(`${this.url}/game/${this.api_key}/scores`)
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
}