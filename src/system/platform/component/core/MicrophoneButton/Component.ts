import { Element } from '../../../../../client/element'
import { IOPointerEvent } from '../../../../../client/event/pointer'
import { makePointerDownListener } from '../../../../../client/event/pointer/pointerdown'
import { makePointerUpListener } from '../../../../../client/event/pointer/pointerup'
import { SpeechOpt, SpeechRecorder } from '../../../../../client/event/speech'
import { Mode } from '../../../../../client/mode'
import parentElement from '../../../../../client/parentElement'
import { Dict } from '../../../../../types/Dict'
import IconButton from '../IconButton/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  mode?: Mode
  disabled?: boolean
  opt?: SpeechOpt
  tabIndex?: number
}

export const DEFAULT_STYLE = {
  touchAction: 'none',
}

export default class MicrophoneButton extends Element<HTMLDivElement, Props> {
  private _icon_button: IconButton

  private _speech_recorder: SpeechRecorder

  constructor($props: Props) {
    super($props)

    const {
      className,
      style = {},
      opt = {},
      disabled = false,
      tabIndex,
    } = this.$props

    const icon_button = new IconButton({
      icon: 'mic',
      className,
      style: {
        ...DEFAULT_STYLE,
        ...style,
      },
      activeColor: 'rgb(201,64,49)',
      disabled,
      title: 'microphone',
    })
    icon_button.addEventListener(makePointerDownListener(this._on_pointer_down))
    this._icon_button = icon_button

    this._speech_recorder = new SpeechRecorder(opt)
    this._speech_recorder.addListener('transcript', this._on_transcript)
    this._speech_recorder.addListener('err', this._on_err)

    const $element = parentElement()

    this.$element = $element
    this.$slot = icon_button.$slot
    this.$subComponent = {
      icon_button,
    }

    this.registerRoot(icon_button)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._icon_button.setProp('style', { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'disabled') {
      this._icon_button.setProp('disabled', current)
    }
  }

  private _on_pointer_down = (
    event: IOPointerEvent,
    _event: PointerEvent
  ): void => {
    const { disabled } = this.$props

    if (disabled) {
      return
    }

    const { pointerId } = event

    this.setPointerCapture(pointerId)

    const unlisten_pointer_up = this.addEventListener(
      makePointerUpListener(() => {
        const { pointerId } = event
        this.releasePointerCapture(pointerId)
        unlisten_pointer_up()
        this.stop()
      })
    )

    this.start()
  }

  private _on_transcript = (transcript: string): void => {
    if (this.$unit) {
      this.$unit.$setPinData({
        type: 'output',
        pinId: 'transcript',
        data: transcript,
      })
    }
    this.dispatchEvent('transcript', transcript)
  }

  private _on_err = (err: string): void => {}

  public start(): void {
    console.log('MicrophoneButton', 'start')
    this._icon_button.setProp('active', true)
    try {
      this._speech_recorder.start()
    } catch {
      // swallow
    }
  }

  public stop(): void {
    console.log('MicrophoneButton', 'stop')
    this._icon_button.setProp('active', false)
    this._speech_recorder.stop()
  }
}
