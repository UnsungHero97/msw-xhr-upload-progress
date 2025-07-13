// import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'

const app = express()
const port = 8080

app.use(cors())

app.post('/test', express.raw({ limit: 104857600, type: '*/*'}), async (req, res) => {
  if (!req.body) {
    res.status(400).json({ error: 'no body' })
  }
  if (req.body.length === 0) {
    res.status(400).json({ error: 'invalid body' })
  }
  console.log(req.body.length)
  return res.json({ data: 'api - ok' })
})

app
  .listen(port, () => {
    console.log(`server is running - http://localhost:${port}`)
  })
  .on('error', (e) => {
    console.log('server error')
    console.error(e)
  })
