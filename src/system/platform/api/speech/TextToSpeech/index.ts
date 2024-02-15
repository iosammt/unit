import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_TEXT_TO_SPEECH } from '../../../../_ids'

export type I = {
  message: string
  voice: number
}

export type O = {}

export default class TextToSpeech extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['message', 'voice'],
        o: [],
      },
      {},
      system,
      ID_TEXT_TO_SPEECH
    )
  }

  f({ message, voice }: I, done: Done<O>) {
    const {
      api: {
        speech: { SpeechSynthesis, SpeechSynthesisUtterance },
      },
    } = this.__system
    if (message === '') {
      done()
      return
    }

    let synth: SpeechSynthesis

    try {
      synth = SpeechSynthesis
    } catch (err) {
      done(undefined, err.message)

      return
    }

    let voices = []

    const speak = () => {
      voices = synth.getVoices()
      if (voices.length > 0) {
        _speak()
      } else {
        speak()
      }
    }

    const _speak = () => {
      if (voice < 0 || voice > voices.length - 1) {
        done(undefined, 'voice index out of range')
        return
      }

      const _voice = voices[voice]
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.addEventListener('error', (err) => {
        done(undefined, err.error)
      })
      utterance.addEventListener('end', () => {
        done()
      })
      synth.speak(utterance)
    }

    speak()
  }
}
