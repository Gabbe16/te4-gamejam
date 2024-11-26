require('dotenv').config()
const express = require('express')
const cors = require('cors')
const expressLimiter = require('express-rate-limit')
const session = require('express-session')
const { v4: uuidv4 } = require('uuid');

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
    // Talk to the server to get a highscore list for a specific game
    const [gameWithHighscoreList] = await pool.promise().query(`
      select users.nickname, games.name, highscores.score from highscores
      join games on highscores.game_id = games.id
      join users on highscores.user_id = users.id
      where highscores.game_id = ?
      order by highscores.score DESC
      limit 5`, [req.params.id]
    );
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
      select users.nickname, games.name, highscores.score from highscores
      join games on highscores.game_id = games.id
      join users on highscores.user_id = users.id
      where highscores.user_id = ?
      order by highscores.score DESC`, [req.params.id])
    // send a response back with the all the users scores
    res.json(userWithHighScores)
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})

app.post('/game/:id', async (req, res) => {
  try {
    // get the game_id, hiscore and userid variables so we can put it in the db
    // const gameID = req.body[0].game_id
    // const hiscore = req.body[0].score
    // const userID = req.body[0].user_id

    const [addedHighscore] = await pool.promise().query(`
      insert into highscores (game_id, score, user_id) 
      values (?, ?, ?)`, [req.body.game_id, req.body.score, req.body.user_id, req.params.id])

    // redirect back to start a new game after posting last score
    res.redirect('/')
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})

app.post('/game', async (req, res) => {
  // create a unique uuid for each game
  const uuid = uuidv4();
  const gameName = req.body[0].name

  try {
    // add the unique uuid after the name has been submitted
    const [addedGame] = await pool.promise().query(`
      insert into games (name, uuid)
      values (?, ?)`, [gameName, uuid])
    res.redirect('/')
  } catch (error) {
    console.log(error)
    res.status(500)
  }
})

app.post('/login', async (req, res) => {
  const nickname = req.body.nickname
  const [user] = await pool.promise().query(`select id from users where nickname = ?`, [nickname])
  
  req.session.userid = user[0].id
  req.session.username = nickname
  console.log(req.session)

  res.redirect('/')
})

app.get('/logout', async (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/')
    }
  })
  console.log(req.session,'Logged out')
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})