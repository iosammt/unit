import { $ } from '../Class/$'
import { System } from '../system'
import { RS } from '../types/interface/RS'

export function wrapReadableStream(
  readableStream_: ReadableStream,
  system: System
): RS & $ {
  const readableStream = new (class ReadableStream_ extends $ implements RS {
    __: string[] = ['RS']

    json(): Promise<any> {
      return new Response(readableStream_).json()
    }

    text(): Promise<string> {
      return new Response(readableStream_).text()
    }

    blob(): Promise<Blob> {
      return new Response(readableStream_).blob()
    }

    async raw() {
      return readableStream_
    }
  })(system)

  return readableStream
}
