import __specs from '../../system/_specs'
import {
  ID_INCREMENT,
  ID_ONE,
  ID_PRIORITY_MERGE,
  ID_RANGE_ARRAY,
  ID_SINGLE,
} from './id'

globalThis.__specs = globalThis.__specs || __specs

const paths = [
  ID_INCREMENT,
  ID_ONE,
  ID_SINGLE,
  ID_RANGE_ARRAY,
  ID_PRIORITY_MERGE,
]

// for (const path of paths) {
//   console.log(path, treeComplexityByPath(path))
// }
