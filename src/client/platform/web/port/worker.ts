import { DataEvent } from '../../../../events/DataEvent'
import { _ErrorEvent } from '../../../../events/ErrorEvent'
import { Port } from '../../../../types/global/Port'

export const workerPort = (worker: Worker): Port => {
  const port: Port = {
    send(message: any): any {
      worker.postMessage(message)
    },
    onmessage(event: DataEvent): any {},
    onerror(event: _ErrorEvent): any {},
    terminate(): any {
      worker.terminate()
    },
  }

  worker.onerror = (event: ErrorEvent) => {
    const { message } = event

    // TODO
    // prevent uncaught exception from propagating to this window
    // event.preventDefault()
    port.onerror({ message })
  }

  worker.onmessage = (event: MessageEvent) => {
    const { data } = event
    port.onmessage({ data })
  }

  return port
}
