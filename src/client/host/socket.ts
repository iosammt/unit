import { EventEmitter2 } from 'eventemitter2'
import { Dict } from '../../types/Dict'
import { Unlisten } from '../../Unlisten'
import { isLocalHost } from '../localhost'
import { addSignInListener, addSignOutListener, isSignedIn } from './user'

import isIp = require('is-ip')

export let socket: WebSocket | null = null

export let connected = false
export let connecting = false

export const WS_HOST_URL = (hostname: string): string => {
  const local = isLocalHost(hostname) || isIp(hostname)
  const ws_protocol = local ? 'ws' : 'wss'
  const ws_host = hostname
  const ws_url = `${ws_protocol}://${ws_host}`
  return ws_url
}

function connect(): void {
  const { hostname } = location

  connecting = true

  const ws_url = WS_HOST_URL(hostname)

  // console.log('ws_url', ws_url)

  socket = new WebSocket(ws_url)

  socket.addEventListener('open', function (event) {
    // console.log('socket', 'open')
    connected = true
    connecting = false
  })

  socket.addEventListener('close', function (event: CloseEvent) {
    // console.log('socket', 'close')
    connected = false
    connecting = false
  })

  socket.addEventListener('message', (event) => {
    const { data: message } = event
    const data = JSON.parse(message)
    const { type, data: _data } = data
    const emitter = EMITTER[type]
    const { type: _type, data: __data } = _data
    emitter.emit(_type, __data)
  })

  socket.addEventListener('error', (event) => {
    // console.log('socket', 'error')
  })
}

function disconnect(): void {
  socket.close()
  socket = null
}

export const EMITTER: Dict<EventEmitter2> = {
  user: new EventEmitter2(),
  cloud: new EventEmitter2(),
  server: new EventEmitter2(),
}

export const SOCKET_CLOUD_EMITTER = EMITTER['cloud']
export const SOCKET_USER_EMITTER = EMITTER['user']
export const SOCKET_SERVER_EMITTER = EMITTER['server']

export const SERVER_EMITTER = {
  peer: new EventEmitter2(),
}

export const SOCKET_SERVER_PEER_EMITTER = SERVER_EMITTER['peer']

SOCKET_SERVER_EMITTER.addListener('peer', (_data) => {
  const { type, data } = _data
  SOCKET_SERVER_PEER_EMITTER.emit(type, data)
})

if (isSignedIn()) {
  connect()
}

addSignInListener(() => {
  connect()
})

addSignOutListener(() => {
  disconnect()
})

export function isConnected(): boolean {
  return connected
}

export const connection_emitter = new EventEmitter2()

export function addConnectListener(listener: () => void): Unlisten {
  connection_emitter.addListener('connected', listener)
  return () => {
    connection_emitter.removeListener('connected', listener)
  }
}

export function send(data: any): void {
  const message = JSON.stringify(data)
  socket.send(message)
}
