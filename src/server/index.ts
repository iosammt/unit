#!/usr/bin/env node
import { json } from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as http from 'http'
import * as createError from 'http-errors'
import * as os from 'os'
import { PATH_PUBLIC } from '../path'
import { PORT } from './port'
import compression = require('compression')

/* eslint-disable no-console */

process.on('uncaughtException', function (err) {
  console.error(new Date().toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)
})

const LOCAL_IP_ADDRESS = Object.values(os.networkInterfaces()).reduce(
  (r, list) =>
    r.concat(
      list.reduce(
        (rr, i) =>
          rr.concat((i.family === 'IPv4' && !i.internal && i.address) || []),
        []
      )
    ),
  []
)[0]

export let server: http.Server | null = null

const app = express()

app.disable('x-powered-by')

app.use((req, res, next) => {
  const { url, method } = req
  console.log(method, url)
  next()
})

const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.set('port', PORT)

app.use(cors(corsOptions))
app.use(compression())
app.use(express.static(PATH_PUBLIC))
app.use(json())
app.use('*/index.js', (req, res, next) => {
  res.setHeader('Content-Type', 'application/javascript')

  res.sendFile(PATH_PUBLIC + '/index.js')
})
app.use('*', express.static(PATH_PUBLIC))

app.use(function (req, res, next) {
  next(createError(404))
})

function onListening() {
  console.log(`http://localhost:${PORT}`)
  console.log(`http://${LOCAL_IP_ADDRESS}:${PORT}`)
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

server = app.listen(PORT, onListening)

server.on('error', onError)
