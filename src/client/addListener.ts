import callAll from '../callAll'
import NOOP from '../NOOP'
import { Unlisten } from '../Unlisten'
import Listenable from './Listenable'
import { Listener } from './Listener'

export function addListener(
  listenable: Listenable,
  listener: Listener
): Unlisten {
  const { $system, $listener, $unlisten } = listenable
  $listener.push(listener)
  if ($system) {
    const unlisten = listener(listenable)
    $unlisten.push(unlisten)
  } else {
    $unlisten.push(NOOP)
  }
  return () => {
    const i = $listener.indexOf(listener)
    if (i > -1) {
      const unlisten = $unlisten[i]
      unlisten()
      $listener.splice(i, 1)
      $unlisten.splice(i, 1)
    }
  }
}

export function addListeners(
  listenable: Listenable,
  listeners: Listener[]
): Unlisten {
  const all_unlisten: Unlisten[] = []
  for (const listener of listeners) {
    const unlisten = addListener(listenable, listener)
    all_unlisten.push(unlisten)
  }
  const unlisten = callAll(all_unlisten)
  return unlisten
}
