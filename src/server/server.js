require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const { v4: uuidv4, validate } = require('uuid');
const { query, validationResult, body } = require('express-validator')
const validator = require('validator')

const expressLimiter = require('express-rate-limit')
const pool = require('./db')
const port = process.env.PORT || 3000
const app = express()

const limiter = expressLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'test',
    resave: false,
    saveUninitialized: true,
    cookie: { sameSite: true }
  })
)

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET, POST'
}))

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/game/:id/scores', async (req, res) => {
  try {
    // Talk to the server to get a top 10 highscore list for a specific game, needs an api key
    const [gameWithHighscoreList] = await pool.promise().query(`
    select
      users.nickname,
      games.name,
      highscores.score,
      highscores.playtime
    from
      highscores
      join games on highscores.game_id = games.id
      join users on highscores.user_id = users.id
    where
      games.api_key = ?
    order by
      highscores.score DESC
    limit
      10`, [req.params.id]);
    // send a response back with the highscore list
    res.json(gameWithHighscoreList)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})

app.get('/user/:id/scores', async (req, res) => {
  try {
    // Talk to the server to get a user and all their highscores
    const [userWithHighScores] = await pool.promise().query(`
      select 
        users.nickname, 
        games.name, 
        highscores.score 
      from highscores
        join games on highscores.game_id = games.id
        join users on highscores.user_id = users.id
      where 
        highscores.user_id = ?
      order by 
        highscores.score DESC`, [req.params.id])
    // send a response back with the all the users scores
    res.json(userWithHighScores)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})

app.post('/game/:id',
  body('game_id').isNumeric().isInt().toInt(),
  body('score').isNumeric().isInt().toInt(),
  body('user_id').isEmpty().trim().escape(),
  body('playtime').isNumeric().isInt().toInt(),
  async (req, res) => {

    const result = validationResult(req)
    console.log(result)

    if (result.isEmpty()) {
      try {
        // get the gameid from the api key
        const [gameid] = await pool.promise().query(`SELECT games.id FROM games where api_key = ?`, [req.params.id])
        console.log("gameID", gameid[0].id)

        // get the userid from their name and add them to the database
        const userNickname = req.body.user_id
        const [userToDatabase] = await pool.promise().query(`insert into users (nickname) values (?)`, [userNickname])
        const [userNicknameAndID] = await pool.promise().query(`select id from users where nickname = ?`, [userNickname])
        console.log("username:", req.body.user_id)
        console.log("UserID: ", userNicknameAndID[0].id)

        // send the highscore with the combined gameid and userid + the score the user got
        const [highscoreWithgameid] = await pool.promise().query(`
        INSERT INTO 
          highscores (game_id, score, user_id, playtime) 
        VALUES 
          (?, ?, ?, ?)`, [gameid[0].id, req.body.score, userNicknameAndID[0].id, req.body.playtime])
      } catch (error) {
        console.log(error)
        res.status(500)
      }
    }

    res.send({ errors: result.array() })
  })

app.post('/game', body('api_key').isUUID(4), async (req, res) => {
  const uuid = req.body[0].uuid
  const gameName = req.body[0].name
  const result = validationResult(req)

  if (result.isEmpty()) {
    try {
      const [addedGame] = await pool.promise().query(`insert into games (name, api_key) values (?, ?)`, [gameName, uuid])
      res.redirect('/')
    } catch (error) {
      console.log(error)
      res.status(500)
    }
  }

  res.send({ errors: result.array() })

})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})