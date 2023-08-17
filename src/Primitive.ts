import { ION, Opt, Unit, UnitEvents } from './Class/Unit'
import { Pin } from './Pin'
import { PinOpt } from './PinOpt'
import { Pins } from './Pins'
import { System } from './system'
import forEachValueKey from './system/core/object/ForEachKeyValue/f'
import { Dict } from './types/Dict'
import { IO } from './types/IO'

export type Primitive_EE = {}

export type PrimitiveEvents<_EE extends Dict<any[]>> = UnitEvents<
  _EE & Primitive_EE
> &
  Primitive_EE

export class Primitive<
  I = {},
  O = {},
  _EE extends PrimitiveEvents<_EE> & Dict<any[]> = PrimitiveEvents<Primitive_EE>
> extends Unit<I, O, _EE> {
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
    data: Dict<(data: any) => void>
    drop: Dict<(data: any) => void>
    invalid: Dict<() => void>
    start: Dict<() => void>
    end: Dict<() => void>
  } = {
    data: {},
    drop: {},
    invalid: {},
    start: {},
    end: {},
  }

  private _outputListeners: {
    data: Dict<(data: any) => void>
    drop: Dict<(data: any) => void>
    invalid: Dict<() => void>
  } = {
    data: {},
    drop: {},
    invalid: {},
  }

  private __buffer: {
    name: string
    type: IO
    event: 'data' | 'drop'
    ref: boolean
    data?: any
  }[] = []

  constructor(
    { i, o }: ION<I, O> = {},
    opt: Opt = {},
    system: System,
    id: string
  ) {
    super({ i, o }, opt, system, id)

    this._setupInputs(this._input)
    this._setupOutputs(this._output)

    this.addListener('set_input', this._onInputSet)
    this.addListener('set_output', this._onOutputSet)
    this.addListener('remove_input', this._onInputRemoved)
    this.addListener('remove_output', this._onOutputRemoved)
    this.addListener('rename_input', this._onInputRenamed)
    this.addListener('rename_output', this._onOutputRenamed)
    this.addListener('destroy', () => {
      forEachValueKey(this._input, (input: Pin<any>, name: string) => {
        this._plunkInput(name, input)
      })
      forEachValueKey(this._output, (output: Pin<any>, name: string) => {
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
              this.__onRefInputData(name, data)
            } else {
              this.onDataInputData(name, data)
            }
          } else {
            if (ref) {
              this.__onRefInputDrop(name)
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

    dataListener && output.removeListener('data', dataListener)
    dropListener && output.removeListener('drop', dropListener)
    invalidListener && output.removeListener('invalid', invalidListener)
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

    dataListener && input.removeListener('data', dataListener)
    dropListener && input.removeListener('drop', dropListener)
    invalidListener && input.removeListener('invalid', invalidListener)
    startListener && input.removeListener('start', startListener)
    endListener && input.removeListener('end', endListener)
  }

  private _setupInputs = (inputs: Pins<I>) => {
    for (const name in inputs) {
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

    input.addListener('data', dataListener)
    input.addListener('start', startListener)
    input.addListener('invalid', invalidListener)

    input.prependListener('drop', dropListener)
    input.prependListener('end', endListener)
  }

  private _setupRefInput = (name: string, input: Pin<I[keyof I]>): void => {
    const dataListener = this._onRefInputData.bind(this, name)
    const dropListener = this._onRefInputDrop.bind(this, name)
    const invalidListener = this._onRefInputInvalid.bind(this, name)

    this._inputListeners.data[name] = dataListener
    this._inputListeners.drop[name] = dropListener
    this._inputListeners.invalid[name] = invalidListener

    input.addListener('data', dataListener)
    input.addListener('invalid', invalidListener)

    input.prependListener('drop', dropListener)
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
    output.prependListener('data', dataListener)
    output.addListener('drop', dropListener)
    output.prependListener('invalid', invalidListener)
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

  private _input_effemeral: Dict<Unit> = {}

  private _onRefInputData = (name: string, data: any): void => {
    this._activateInput(name, data)

    if (!this._paused) {
      this.__onRefInputData(name, data)
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

  private __onRefInputData = (name: string, data: any): void => {
    if (data instanceof Function) {
      data = new data(this.__system)

      this._input_effemeral[name] = data
      this._i[name] = data
    }

    this.onRefInputData(name, data)
  }

  private _onInputSet(
    name: string,
    input: Pin<any>,
    opt: PinOpt,
    propagate: boolean
  ): void {
    this._setupInput(name, input, opt)

    this.onInputSet(name, input, opt, propagate)
  }

  public onInputSet(
    name: string,
    input: Pin<any>,
    opt: PinOpt,
    propagate: boolean
  ): void {
    if (!input.empty()) {
      const data = input.peak()

      this._activateInput(name, data)

      if (propagate) {
        this._onInputStart(name)

        if (this.hasRefInputNamed(name)) {
          this._onRefInputData(name, data)
        } else {
          this._onDataInputData(name, data)
        }
      }
    }
  }

  private _onOutputSet(
    name: string,
    output: Pin<O[keyof O]>,
    opt: PinOpt,
    propagate: boolean
  ): void {
    this._setupOutput(name, output, opt)
    this.onOutputSet(name, output, opt, propagate)
  }

  public onOutputSet(
    name: string,
    output: Pin<O[keyof O]>,
    opt: PinOpt,
    propagate: boolean
  ): void {}

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

    const input = this.getInput(newName)
    const opt = this.getInputOpt(newName)

    this._plunkInput(name, input)

    this._setupInput(newName, input, opt)

    this.onInputRenamed(name, newName, opt, opt)
  }

  private _onOutputRenamed(name: string, newName: string) {
    // console.log('Primitive', '_onOutputRenamed', name, newName)

    const output = this.getOutput(newName)
    const opt = this.getOutputOpt(newName)

    this._plunkOutput(name, output)

    this._setupOutput(newName, output, opt)

    this.onOutputRenamed(name, newName, opt, opt)
  }

  public onInputRenamed(
    name: string,
    newName: string,
    opt: PinOpt,
    newOpt: PinOpt
  ): void {
    //
  }

  public onOutputRenamed(
    name: string,
    newName: string,
    opt: PinOpt,
    newOpt: PinOpt
  ): void {
    //
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
      this.__onRefInputDrop(name)
    } else {
      this.__buffer.push({ name, type: 'input', event: 'drop', ref: true })
    }
  }

  private __onRefInputDrop = (name: string): void => {
    if (this._input_effemeral[name]) {
      const effemeral_unit = this._input_effemeral[name]

      delete this._input_effemeral[name]

      effemeral_unit.destroy()
    }

    this.onRefInputDrop(name)
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

    this.onDataOutputData(name, data)
  }

  private _onRefOutputData = (name: string, data: any): void => {
    this.__onOutputData(name, data)

    this.onRefOutputData(name, data)
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

  public onDataOutputData(name: string, data: any): void {}

  public onDataOutputDrop(name: string): void {}

  public onRefOutputData(name: string, data: any): void {}

  public onRefOutputDrop(name: string): void {}

  public onOutputInvalid(name: string): void {}

  private _onOutputInvalid = (name: string): void => {
    if (!this._o_invalid[name]) {
      this._o_invalid[name] = true
      this._o_invalid_count++
    }

    this.onOutputInvalid(name)
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
    forEachValueKey(this._output, (output) => output.start())
  }

  protected _invalidate() {
    forEachValueKey(this._output, (output) => output.invalidate())
  }

  protected _end() {
    forEachValueKey(this._output, (output) => output.end())
  }

  protected _forward(name: string, data: any): void {
    const output = this._output[name]
    this._forward_(output, data)
  }

  protected _forward_(output: Pin, data: any): void {
    this._forwarding = true
    output.push(data)
    this._forwarding = false
  }

  protected _forward_all_empty(): void {
    this._forwarding_empty = true
    forEachValueKey(this._output, (o) => o.take())
    this._forwarding_empty = false
  }

  protected _forward_empty(name: keyof O): void {
    this._forwarding_empty = true
    const output = this._output[name]
    output.take()
    this._forwarding_empty = false
  }

  protected _backward_all(): void {
    this._backwarding = true
    forEachValueKey(this._data_input, (i) => i.pull())
    this._backwarding = false
  }

  protected _backward(name: keyof I): void {
    this._backwarding = true
    const input = this._input[name]
    input.pull()
    this._backwarding = false
  }

  public onDataInputInvalid(name: string) {}

  public onRefInputInvalid(name: string) {}

  public snapshotSelf(): Dict<any> {
    return {
      ...super.snapshotSelf(),
      // __buffer: this.__buffer,
      _forwarding: this._forwarding,
      _backwarding: this._backwarding,
      _forwarding_empty: this._forwarding_empty,
    }
  }

  public restoreSelf(state: Dict<any>): void {
    const { __buffer, _forwarding, _backwarding, _forwarding_empty, ...rest } =
      state

    super.restoreSelf(rest)

    // this.__buffer = __buffer || []

    this._forwarding = _forwarding
    this._backwarding = _backwarding
    this._forwarding_empty = _forwarding_empty

    this._i = {}
    this._o = {}

    this._active_i_count = 0
    this._active_o_count = 0

    this._i_start_count = 0
    this._i_start = {}

    this._o_invalid_count = 0
    this._o_invalid = {}

    this._i_invalid_count = 0
    this._i_invalid = {}

    for (let name in this._input) {
      const pin = this._input[name]
      const data = pin.peak()

      this._i[name] = data

      if (data !== undefined) {
        this._active_i_count++

        this._i_start_count++
        this._i_start[name] = true

        if (pin.invalid()) {
          this._i_invalid_count++
          this._i_invalid[name] = true
        }
      }
    }

    for (let name in this._output) {
      const output = this._output[name]
      const data = output.peak()
      this._o[name] = data

      if (data !== undefined) {
        this._active_o_count++

        if (output.invalid()) {
          this._o_invalid_count++
          this._o_invalid[name] = true
        }
      }
    }
  }
}
