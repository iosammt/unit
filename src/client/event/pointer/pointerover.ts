import { IOPointerEvent, listenPointerEvent } from '.'
import Listenable from '../../Listenable'
import { Listener } from '../../Listener'

export function makePointerOverListener(
  listener: (event: IOPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenPointerOver(component, listener, _global)
  }
}

export function listenPointerOver(
  component: Listenable,
  listener: (event: IOPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): () => void {
  return listenPointerEvent('pointerover', component, listener, _global)
}
