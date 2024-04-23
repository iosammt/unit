import { Position } from '../../client/util/geometry/types'
import {
  GraphPlugOuterSpec,
  GraphSubComponentSpec,
  GraphSubPinSpec,
} from '../../types'
import { Action } from '../../types/Action'
import { Dict } from '../../types/Dict'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { GraphMergesSpec } from '../../types/GraphMergesSpec'
import { GraphPinSpec } from '../../types/GraphPinSpec'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphUnitMerges } from '../../types/GraphUnitMerges'
import { GraphUnitPlugs } from '../../types/GraphUnitPlugs'
import { GraphUnitsSpec } from '../../types/GraphUnitsSpec'
import { IO } from '../../types/IO'
import { IOOf } from '../../types/IOOf'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { GraphSelection } from '../../types/interface/G'

export type GraphMoveSubGraphData = {
  nodeIds: GraphSelection
  nextSpecId: string
  nextIdMap: {
    merge?: Dict<string>
    link?: Dict<IOOf<Dict<{ mergeId: string; oppositePinId: string } | null>>>
    plug?: IOOf<
      Dict<Dict<{ mergeId: string; type: IO; subPinId: string } | null>>
    >
    unit?: Dict<string>
    data?: Dict<string>
  }
  nextPinIdMap: Dict<
    IOOf<
      Dict<{
        pinId: string
        subPinId: string
        ref?: boolean
        defaultIgnored?: boolean
        plug?: GraphPlugOuterSpec
        mergeId?: string
        merge?: GraphMergeSpec
      }>
    >
  >
  nextUnitPinMergeMap: Dict<IOOf<Dict<string>>>
  nextMergePinId: Dict<
    IOOf<{
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
      oppositeMerge?: GraphMergeSpec
      ref?: boolean
    }>
  >
  nextPlugSpec: IOOf<Dict<Dict<GraphSubPinSpec>>>
  nextSubComponentIndexMap: Dict<number>
  nextSubComponentParentMap: Dict<string | null>
  nextSubComponentChildrenMap: Dict<string[]>
  position?: Position
}

export type GraphMoveSubGraphIntoData = GraphMoveSubGraphData & {
  graphId: string
  graphBundle: UnitBundleSpec
  graphSpec: GraphSpec
  fork?: boolean
}

export type GraphMoveSubGraphOutOfData = GraphMoveSubGraphIntoData & {
  fork?: boolean
}

export type GraphAddUnitData = {
  unitId: string
  bundle: UnitBundleSpec
  fork?: boolean
  position?: Position | undefined
  pinPosition?: IOOf<Dict<Position>> | undefined
  layoutPositon?: Position | undefined
  parentId?: string | null | undefined
  merges?: GraphUnitMerges | undefined
  plugs?: GraphUnitPlugs | undefined
  subComponent?: GraphSubComponentSpec
}

export type GraphCloneUnitData = {
  unitId: string
  newUnitId: string
  fork?: boolean
}

export type GraphSetUnitPinDataData = {
  unitId: string
  pinId: string
  type: IO
  data: string
  lastData: string
  fork?: boolean
}

export type GraphRemoveMergeDataData = {
  mergeId: string
  fork?: boolean
}

export type GraphSetUnitIdData = {
  unitId: string
  newUnitId: string
  name: string
  specId: string
  fork?: boolean
}

export type GraphRemoveUnitPinDataData = {
  unitId: string
  type: IO
  pinId: string
  data: string
  fork?: boolean
}

export type GraphMoveUnitData = {
  id: string
  unitId: string
  inputId: string
  fork?: boolean
}

export type GraphAddUnitsData = {
  units: GraphUnitsSpec
  fork?: boolean
}

export type GraphRemoveUnitData = {
  unitId: string
  bundle?: UnitBundleSpec
  position?: Position
  pinPosition?: IOOf<Dict<Position>>
  layoutPositon?: Position
  parentId?: string | null
  merges?: GraphMergesSpec
  plugs?: GraphUnitPlugs
  fork?: boolean
  take?: boolean
}

export type GraphExposePinSetData = {
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
  data: any
  fork?: boolean
}

export type GraphExposePinData = {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
  fork?: boolean
}

export type GraphCoverPinData = {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
  fork?: boolean
}

export type GraphPlugPinData = {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
  fork?: boolean
}

export type GraphUnplugPinData = {
  type: IO
  pinId: string
  subPinId: string
  subPinSpec: GraphSubPinSpec
  take?: boolean
  fork?: boolean
}

export type GraphCoverPinSetData = {
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
  fork?: boolean
}

export type GraphCoverUnitPinSetData = {
  unitId: string
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
  position?: Position | undefined
  fork?: boolean
}

export type GraphExposeUnitPinSetData = {
  unitId: string
  type: IO
  pinId: string
  pinSpec: GraphPinSpec
  position?: Position | undefined
  fork?: boolean
}

export type GraphSetPinSetIdData = {
  type: IO
  pinId: string
  nextPinId: string
  fork?: boolean
}

export type GraphSetPinSetFunctionalData = {
  type: IO
  pinId: string
  functional: boolean
  fork?: boolean
}

export type GraphSetUnitPinSetId = {
  unitId: string
  type: IO
  pinId: string
  nextPinId: string
  fork?: boolean
}

export type GraphSetUnitPinConstant = {
  unitId: string
  type: IO
  pinId: string
  constant: boolean
  fork?: boolean
}

export type GraphSetUnitPinIgnoredData = {
  unitId: string
  type: IO
  pinId: string
  ignored: boolean
  fork?: boolean
}

export type GraphAddMergeData = {
  mergeId: string
  mergeSpec: GraphMergeSpec
  position?: Position | undefined
  fork?: boolean
}

export type GraphRemoveMergeData = {
  mergeId: string
  mergeSpec: GraphMergeSpec
  position: Position
  take?: boolean
  fork?: boolean
}

export type GraphAddMergesData = {
  merges: GraphMergesSpec
  fork?: boolean
}

export type GraphSetMergeDataData = {
  mergeId: string
  data: string
  fork?: boolean
}

export type GraphAddPinToMergeData = {
  mergeId: string
  unitId: string
  type: IO
  pinId: string
  fork?: boolean
}

export type GraphRemovePinFromMergeData = {
  mergeId: string
  unitId: string
  type: IO
  pinId: string
  take?: boolean
  fork?: boolean
}

export type GraphTakeUnitErrData = {
  unitId: string
  fork?: boolean
}

export type GraphRemoveUnitGhostData = {
  unitId: string
  nextUnitId: string
  nextUnitSpec: GraphSpec
  fork?: boolean
}

export type GraphAddUnitGhostData = {
  unitId: string
  nextUnitId: string
  nextUnitBundle: UnitBundleSpec
  nextUnitPinMap: IOOf<Dict<string>>
  fork?: boolean
}

export type GraphMoveSubComponentRootData = {
  parentId: string | null
  children: string[]
  slotMap: Dict<string>
  fork?: boolean
}

export type GraphReorderSubComponentData = {
  parentId: string | null
  childId: string
  to: number
  fork?: boolean
}

export type GraphSetUnitSizeData = {
  unitId: string
  width: number
  height: number
  prevHeight: number
  prevWidth: number
  fork?: boolean
}

export type GraphSetComponentSizeData = {
  width: number
  height: number
  prevHeight: number
  prevWidth: number
  fork?: boolean
}

export type GraphSetSubComponentSizeData = {
  unitId: string
  width: number
  height: number
  prevWidth: number
  prevHeight: number
  fork?: boolean
}

export type GraphSetMetadataData = {
  path: string[]
  data: any
  fork?: boolean
}

export type GraphSetUnitMetadataData = {
  unitId: string
  path: string[]
  data: any
  fork?: boolean
}

export type GraphBulkEditData = {
  actions: Action[]
  transaction?: boolean
  fork?: boolean
}
