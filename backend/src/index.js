import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { logger } from './middlewares/logger.js'
import { checkCredentials, checkRegisterFields } from './middlewares/checkCredentials.js'
import { verifyToken } from './middlewares/verifyToken.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js'
import { getUser, loginUser, registerUser } from './controllers.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(logger)

app.post('/usuarios', checkCredentials, checkRegisterFields, registerUser)
app.post('/login', checkCredentials, loginUser)
app.get('/usuarios', verifyToken, getUser)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => console.log(`Servidor encendido en http://localhost:${PORT}`))
