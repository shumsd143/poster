require('dotenv').config()
import createError, { HttpError } from 'http-errors'
import Express, { application, Request, Response } from 'express'
import createConnection from '../configs/mongodb.config'
import cors from 'cors'
import bodyParser from 'body-parser'

import userRoutes from './routes/user.routes'
import postRoutes from './routes/post.routes'
import todoRoutes from './routes/todo.routes'
import commentRoutes from './routes/comment.routes'

const app = Express()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//connecting to db
createConnection()

app.get('/', (req: Request, res: Response) => res.send('Working .....'))
app.use('/users', userRoutes)
app.use('/todos', todoRoutes)
app.use('/posts', postRoutes)
app.use('/comments', commentRoutes)

app.use(function (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  next(createError(404))
})

// error handler
app.use(function (
  err: HttpError,
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  // render the error page
  res.status(err.status || 500).send(err.message)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
