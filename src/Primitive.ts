import { IO, Opt, Unit } from './Class/Unit'
import { Config } from './Class/Unit/Config'
import { Pin } from './Pin'
import { PinOpt } from './PinOpt'
import { Pins } from './Pins'
import forEachKeyValue from './system/core/object/ForEachKeyValue/f'
import { Dict } from './types/Dict'

export class Primitive<I = any, O = any> extends Unit<I, O> {
  protected _i: Partial<I> = {}
  protected _o: Partial<O> = {}

  protected _active_i_count: number = 0
  protected _active_o_count: number = 0

  protected _i_start_count: number = 0
  protected _i_start: Dict<boolean> = {}

  protected _o_invalid_count: number = 0
  protected _o_invalid: Dict<boolean> = {}

  protected _i_invalid_count: number = 0
  protected _i_invalid: Dict<boolean> = {}

  protected _forwarding: boolean = false
  protected _backwarding: boolean = false
  protected _forwarding_empty: boolean = false

  private _inputListeners: {
    data: Dict<(name: string, data: any) => void>
    drop: Dict<(name: string, data: any) => void>
    invalid: Dict<(name: string) => void>
    start: Dict<(name: string) => void>
    end: Dict<(name: string) => void>
  } = {
    data: {},
    drop: {},
    invalid: {},
    start: {},
    end: {},
  }

  private _outputListeners: {
    data: Dict<(name: string, data: any) => void>
    drop: Dict<(name: string, data: any) => void>
    invalid: Dict<(name: string) => void>
  } = {
    data: {},
    drop: {},
    invalid: {},
  }

  private __buffer: {
    name: string
    type: 'input' | 'output'
    event: 'data' | 'drop'
    ref: boolean
    data?: any
  }[] = []

  constructor({ i, o }: IO, config: Config = {}, opt: Opt = {}) {
    super({ i, o }, config, opt)

    this._setupInputs(this._input)
    this._setupOutputs(this._output)

    this.addListener('set_input', this._onInputSet)
    this.addListener('set_output', this._onOutputSet)
    this.addListener('remove_input', this._onInputRemoved)
    this.addListener('remove_output', this._onOutputRemoved)
    this.addListener('rename_input', this._onInputRenamed)
    this.addListener('rename_output', this._onOutputRenamed)
    this.addListener('destroy', () => {
      forEachKeyValue(this._input, (input: Pin<any>, name: string) => {
        this._plunkInput(name, input)
      })
      forEachKeyValue(this._output, (output: Pin<any>, name: string) => {
        this._plunkOutput(name, output)
      })
    })
    this.addListener('reset', () => {
      this._backwarding = false
      this._forwarding = false
      this._forwarding_empty = false
    })
    this.addListener('play', () => {
      while (this.__buffer.length > 0) {
        const { name, type, event, data } = this.__buffer.shift()!
        if (type === 'input') {
          const { ref } = this.getInputOpt(name)
          if (event === 'data') {
            if (ref) {
              this.onRefInputData(name, data)
            } else {
              this.onDataInputData(name, data)
            }
          } else {
            if (ref) {
              this.onRefInputDrop(name)
            } else {
              this.onDataInputDrop(name)
            }
          }
        } else {
          if (event === 'drop') {
            this.onDataOutputDrop(name)
          }
        }
      }
    })
  }

  public getActiveInputCount(): number {
    return this._active_i_count
  }

  public getActiveOutputCount(): number {
    return this._active_o_count
  }

  public getOutputData(): Partial<O> {
    return this._o
  }

  private _plunkOutput(name: string, output: Pin<O[keyof O]>): void {
    const dataListener = this._outputListeners.data[name]
    const dropListener = this._outputListeners.drop[name]
    const invalidListener = this._outputListeners.invalid[name]
    delete this._outputListeners.data[name]
    delete this._outputListeners.drop[name]
    delete this._outputListeners.invalid[name]
    dataListener && output.removeListener('_data', dataListener)
    dropListener && output.removeListener('_drop', dropListener)
    invalidListener && output.removeListener('_invalid', invalidListener)
  }

  private _plunkInput(name: string, input: Pin<I[keyof I]>): void {
    const dataListener = this._inputListeners.data[name]
    const dropListener = this._inputListeners.drop[name]
    const invalidListener = this._inputListeners.invalid[name]
    const startListener = this._inputListeners.start[name]
    const endListener = this._inputListeners.end[name]
    delete this._inputListeners.data[name]
    delete this._inputListeners.drop[name]
    delete this._inputListeners.invalid[name]
    delete this._inputListeners.start[name]
    delete this._inputListeners.end[name]
    dataListener && input.removeListener('_data', dataListener)
    dropListener && input.removeListener('_drop', dropListener)
    invalidListener && input.removeListener('_invalid', invalidListener)
    startListener && input.removeListener('_start', startListener)
    endListener && input.removeListener('_end', endListener)
  }

  private _setupInputs = (inputs: Pins<I>) => {
    for (let name in inputs) {
      const input = inputs[name]
      const opt = this.getInputOpt(name)
      this._setupInput(name, input, opt)
    }
  }

  private _setupDataInput = (name: string, input: Pin<I[keyof I]>): void => {
    const dataListener = this._onDataInputData.bind(this, name)
    const dropListener = this._onDataInputDrop.bind(this, name)
    const invalidListener = this._onDataInputInvalid.bind(this, name)
    const startListener = this._onInputStart.bind(this, name)
    const endListener = this._onInputEnd.bind(this, name)
    this._inputListeners.data[name] = dataListener
    this._inputListeners.start[name] = startListener
    this._inputListeners.invalid[name] = invalidListener
    this._inputListeners.drop[name] = dropListener
    this._inputListeners.end[name] = endListener
    input.addListener('_data', dataListener)
    input.addListener('_start', startListener)
    input.addListener('_invalid', invalidListener)
    input.prependListener('_drop', dropListener)
    input.prependListener('_end', endListener)
  }

  private _setupRefInput = (name: string, input: Pin<I[keyof I]>): void => {
    const dataListener = this._onRefInputData.bind(this, name)
    const dropListener = this._onRefInputDrop.bind(this, name)
    const invalidListener = this._onRefInputInvalid.bind(this, name)
    this._inputListeners.data[name] = dataListener
    this._inputListeners.drop[name] = dropListener
    this._inputListeners.invalid[name] = invalidListener
    input.addListener('_data', dataListener)
    input.addListener('_invalid', invalidListener)
    input.prependListener('_drop', dropListener)
  }

  private _setupInput = (
    name: string,
    input: Pin<I[keyof I]>,
    opt: PinOpt
  ): void => {
    const { ref } = opt
    if (ref) {
      this._setupRefInput(name, input)
    } else {
      this._setupDataInput(name, input)
    }
  }

  private _setupOutputs = (outputs: Pins<O>) => {
    for (let name in outputs) {
      const output = outputs[name]
      const opt = this.getOutputOpt(name)
      this._setupOutput(name, output, opt)
    }
  }

  private __setupOutput = (name: string, output: Pin<any>): void => {
    const dataListener = this._onDataOutputData.bind(this, name)
    const dropListener = this._onDataOutputDrop.bind(this, name)
    const invalidListener = this._onOutputInvalid.bind(this, name)
    this._outputListeners.data[name] = dataListener
    this._outputListeners.drop[name] = dropListener
    this._outputListeners.invalid[name] = invalidListener
    output.prependListener('_data', dataListener)
    output.addListener('_drop', dropListener)
    output.prependListener('_invalid', invalidListener)
  }

  private _setupDataOutput = (name: string, output: Pin<any>): void => {
    this.__setupOutput(name, output)

    if (output.active()) {
      const data = output.peak()
      this._onDataOutputData(name, data)
    }
  }

  private _setupRefOutput = (name: string, output: Pin<any>): void => {
    this.__setupOutput(name, output)

    if (output.active()) {
      const data = output.peak()
      this._onRefOutputData(name, data)
    }
  }

  private _setupOutput = (
    name: string,
    output: Pin<any>,
    opt: PinOpt
  ): void => {
    const { ref } = opt
    if (ref) {
      this._setupRefOutput(name, output)
    } else {
      this._setupDataOutput(name, output)
    }
  }

  private _onDataInputData = (name: string, data: any): void => {
    this._activateInput(name, data)
    if (!this._paused) {
      this.onDataInputData(name, data)
    } else {
      this.__buffer.push({
        name,
        type: 'input',
        event: 'data',
        data,
        ref: false,
      })
    }
  }

  private _onRefInputData = (name: string, data: any): void => {
    this._activateInput(name, data)
    if (!this._paused) {
      this.onRefInputData(name, data)
    } else {
      this.__buffer.push({
        name,
        type: 'input',
        event: 'data',
        data,
        ref: true,
      })
    }
  }

  private _onInputSet(name: string, input: Pin<any>, opt: PinOpt): void {
    this._setupInput(name, input, opt)
    this.onInputSet(name, input)
  }

  public onInputSet(name: string, input: Pin<any>): void {
    if (!input.empty()) {
      this._onInputStart(name)
      const data = input.peak()
      if (this.hasRefInputNamed(name)) {
        this._onRefInputData(name, data)
      } else {
        this._onDataInputData(name, data)
      }
    }
  }

  private _onOutputSet(
    name: string,
    output: Pin<O[keyof O]>,
    opt: PinOpt
  ): void {
    this._setupOutput(name, output, opt)
    this.onOutputSet(name, output)
  }

  public onOutputSet(name: string, output: Pin<O[keyof O]>): void {}

  private _onInputRemoved(name: string, input: Pin<any>): void {
    this._plunkInput(name, input)
    if (input.active()) {
      this._deactivateInput(name)
    }
    this.onInputRemoved(name, input)
  }

  public onInputRemoved(name: string, input: Pin<any>): void {
    // console.log(this.constructor.name, 'onInputRemoved', name)
  }

  public _onOutputRemoved(name: string, output: Pin<any>): void {
    this._plunkOutput(name, output)
    if (!output.empty()) {
      this._deactivateOutput(name)
    }
    this.onOutputRemoved(name, output)
  }

  public onOutputRemoved(name: string, output: Pin<any>): void {
    if (!output.empty()) {
      this._onDataOutputDrop(name)
    }
  }

  public onDataInputData(name: string, data: any): void {}

  public onRefInputData(name, data: any): void {}

  private _onInputRenamed(name: string, newName: string): void {
    // console.log('Primitive', '_onInputRenamed', name, newName)
    const input = this.getInput(name)
    const opt = this.getInputOpt(name)

    this._plunkInput(name, input)

    this._setupInput(newName, input, opt)
  }

  private _onOutputRenamed(name: string, newName: string) {
    // console.log('Primitive', '_onOutputRenamed', name, newName)
    const output = this.getOutput(name)
    const opt = this.getOutputOpt(name)

    this._plunkOutput(name, output)

    this._setupOutput(newName, output, opt)
  }

  private _activateInput = (name: string, data: any) => {
    if (this._i[name] === undefined) {
      this._active_i_count++
    }
    this._i[name] = data
    if (this._i_invalid[name]) {
      delete this._i_invalid[name]
      this._i_invalid_count--
    }
  }

  private _deactivateInput = (name: string) => {
    if (this._i[name] !== undefined) {
      delete this._i[name]
      this._active_i_count--
    }
    if (this._i_invalid[name]) {
      delete this._i_invalid[name]
      this._i_invalid_count--
    }
    if (this._i_start[name]) {
      delete this._i_start[name]
      this._i_start_count--
    }
  }

  private _onDataInputDrop = (name: string): void => {
    this._deactivateInput(name)
    if (!this._paused) {
      this.onDataInputDrop(name)
    } else {
      this.__buffer.push({ name, type: 'input', event: 'drop', ref: false })
    }
  }

  private _onRefInputDrop = (name: string): void => {
    this._deactivateInput(name)
    if (!this._paused) {
      this.onRefInputDrop(name)
    } else {
      this.__buffer.push({ name, type: 'input', event: 'drop', ref: true })
    }
  }

  private _onRefInputInvalid = (name: string): void => {
    if (!this._i_invalid[name]) {
      this._i_invalid[name] = true
      this._i_invalid_count++
    }
    this.onRefInputInvalid(name)
  }

  public onDataInputDrop(name: string): void {}

  public onRefInputDrop(name: string): void {}

  private _activateOutput = (name: string) => {
    if (this._o[name] === undefined) {
      this._active_o_count++
    }
    if (this._o_invalid[name]) {
      delete this._o_invalid[name]
      this._o_invalid_count--
    }
  }

  private _deactivateOutput = (name: string) => {
    if (this._o[name] !== undefined) {
      this._active_o_count--
      delete this._o[name]
    }
    if (this._o_invalid[name]) {
      delete this._o_invalid[name]
      this._o_invalid_count--
    }
  }

  private __onOutputData = (name: string, data: any): void => {
    this._activateOutput(name)
    this._o[name] = data
  }

  private _onDataOutputData = (name: string, data: any): void => {
    this.__onOutputData(name, data)
  }

  private _onRefOutputData = (name: string, data: any): void => {
    this.__onOutputData(name, data)
  }

  private _onDataOutputDrop = (name: string): void => {
    this._deactivateOutput(name)
    if (!this._paused) {
      this.onDataOutputDrop(name)
    } else {
      this.__buffer.push({ name, type: 'output', event: 'drop', ref: false })
    }
  }

  private _onRefOutputDrop = (name: string): void => {
    this._deactivateOutput(name)
    if (!this._paused) {
      this.onRefOutputDrop(name)
    } else {
      this.__buffer.push({ name, type: 'output', event: 'drop', ref: true })
    }
  }

  public onDataOutputDrop(name: string): void {}

  public onRefOutputDrop(name: string): void {}

  private _onOutputInvalid = (name: string): void => {
    if (!this._o_invalid[name]) {
      this._o_invalid[name] = true
      this._o_invalid_count++
    }
  }

  private _onInputEnd(name: string): void {
    if (this._i_start[name]) {
      this._i_start[name] = false
      this._i_start_count--
    }
    this.onDataInputEnd(name)
  }

  public onDataInputEnd(name: string): void {}

  private _onInputStart(name: string): void {
    if (!this._i_start[name]) {
      this._i_start[name] = true
      this._i_start_count++
    }
    this.onDataInputStart(name)
  }

  public onDataInputStart(name: string): void {}

  private _onDataInputInvalid(name: string): void {
    if (!this._i_invalid[name]) {
      this._i_invalid[name] = true
      this._i_invalid_count++
    }
    this.onDataInputInvalid(name)
  }

  protected _start() {
    forEachKeyValue(this._output, (output) => output.start())
  }

  protected _invalidate() {
    forEachKeyValue(this._output, (output) => output.invalidate())
  }

  protected _end() {
    forEachKeyValue(this._output, (output) => output.end())
  }

  protected _forward_all_empty() {
    this._forwarding_empty = true
    // forEachKeyValue(this.output, o => o.pull())
    forEachKeyValue(this._output, (o) => o.take())
    this._forwarding_empty = false
  }

  protected _backward_all(): void {
    this._backwarding = true
    forEachKeyValue(this._data_input, (i) => i.pull())
    this._backwarding = false
  }

  protected _backward(name: string): void {
    this._backwarding = true
    const input = this._input[name]
    input.pull()
    this._backwarding = false
  }

  public onDataInputInvalid(name: string) {}

  public onRefInputInvalid(name: string) {}
}
