import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

import authRouter from './routers/auth.js'
import profileRouter from './routers/profile.js'
import errorMiddleware from './middlewares/error_middleware.js'

dotenv.config()

const PORT = process.env.SERVER_PORT || 5000
const DB_URL = process.env.MONGODB_URL

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use('/api', authRouter)
app.use('/api/profile', profileRouter)

app.use(errorMiddleware)

async function startServer() {
  try {
    await mongoose.connect(DB_URL)
    app.listen(PORT, () => {
      console.log('Server started on the port: ' + PORT)
    })
  } catch (e) {
    console.log(e)
  }
}

startServer()
