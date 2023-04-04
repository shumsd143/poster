import mongoose, { ConnectOptions } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) throw new Error('DB Url not set.')

const options: ConnectOptions = {
  autoIndex: true,
}

var createConnection = function () {
  mongoose
    .connect(MONGODB_URI, options)
    .then(() => console.log('Connected to database'))
    .catch((err) => console.error('Error connecting to database:', err))
}

export default createConnection
