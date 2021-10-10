import { UNTITLED } from '../constant/STRING'
import { GraphSpec } from '../types'

export const emptyGraphSpec: GraphSpec = {
  type: '`U`&`G`',
  name: UNTITLED,
  units: {},
  merges: {},
  inputs: {},
  outputs: {},
  metadata: {
    icon: null,
    description: '',
  },
}
