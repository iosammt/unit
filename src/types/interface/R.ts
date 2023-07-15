import { GraphSpecs, Spec } from '..'
import { GraphSpec } from '../GraphSpec'
import { Dict } from '../Dict'

export interface R {
  newSpecId(): string
  hasSpec(id: string): boolean
  emptySpec(partial?: Partial<GraphSpec>): GraphSpec
  newSpec(spec: GraphSpec): GraphSpec
  getSpec(id: string): Spec
  setSpec(id: string, spec: GraphSpec): void
  forkSpec(spec: GraphSpec, specId?: string): [string, GraphSpec]
  injectSpecs(specs: GraphSpecs): Dict<string>
  deleteSpec(id: string): void
  registerUnit(id: string): void
  unregisterUnit(id: string): void
}
