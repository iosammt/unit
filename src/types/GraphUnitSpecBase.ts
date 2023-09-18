import { Dict } from './Dict'
import { GraphUnitPinsSpec } from './GraphUnitPinsSpec'
import { GraphUnitSpec } from './GraphUnitSpec'
import { None } from './None'

export type GraphUnitSpecBase = {
  input?: GraphUnitPinsSpec
  output?: GraphUnitPinsSpec
  state?: Dict<any>
  memory?: { input: Dict<any>; output: Dict<any>; memory: Dict<any> }
  flag?: Dict<any>
  children?: GraphUnitSpec[] | None
  reorder?: string[] | None
}
