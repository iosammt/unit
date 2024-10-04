export interface AC {
  audioContext(): AudioContext
  disconnect(audioNode?: AudioNode): void
  getDestination(): AudioDestinationNode
  createOscillator(opt: OscillatorOptions): OscillatorNode
  createAnalyser(opt: AnalyserOptions): AnalyserNode
}
