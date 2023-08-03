import removeIndex from '../../system/core/array/RemoveIndex/f'
import assocPath from '../../system/core/object/AssocPath/f'
import pathGet from '../../system/core/object/DeepGet/f'
import dissocPath from '../../system/core/object/DeletePath/f'
import $indexOf from '../../system/f/array/IndexOf/f'
import { _insert } from '../../system/f/array/Insert/f'
import merge from '../../system/f/object/Merge/f'
import _set from '../../system/f/object/Set/f'
import { GraphComponentSpec, GraphSubComponentSpec } from '../../types'
import { reorder } from '../../util/array'
import { pathSet, set } from '../../util/object'

export type State = GraphComponentSpec

export const defaultState: State = {}

export const appendChild = (
  { unitId }: { unitId: string },
  state: State
): void => {
  const children = state.children || []

  set(state, 'children', [...children, unitId])
}

export const insertChild = (
  { id, at }: { id: string; at: number },
  state: State
): State => {
  const children = state.children || []
  return _set(state, 'children', _insert(children, at, id))
}

export const removeChild = ({ id }, state: State): State => {
  const children = [...(state.children || [])]
  const index = children.indexOf(id)
  if (index > -1) {
    children.splice(index, 1)
    return _set(state, 'children', children)
  }
  return state
}

export const setSubComponent = (
  { unitId, spec }: { unitId: string; spec: GraphSubComponentSpec },
  state: State
): void => {
  pathSet(state, ['subComponents', unitId], spec)
}

export const removeSubComponent = (
  { id }: { id: string },
  state: State
): State => {
  state = dissocPath(state, ['subComponents', id])
  return state
}

export const setSize = (
  {
    defaultWidth,
    defaultHeight,
  }: { defaultWidth: number; defaultHeight: number },
  state: State
): State => {
  return merge(state, { defaultWidth, defaultHeight })
}

export const setChildren = (
  { children }: { children: string[] },
  state: State
): State => {
  return _set(state, 'children', children)
}

export const setSubComponentSize = (
  { id, width, height }: { id: string; width: number; height: number },
  state: State
): State => {
  return assocPath(
    state,
    ['subComponents', id],
    merge(state.subComponents[id], { width, height })
  )
}

export const setSubComponentChildren = (
  { id, children }: { id: string; children: string[] },
  state: State
): State => {
  return assocPath(state, ['subComponents', id, 'children'], children)
}

export const removeSubComponentChild = (
  { id, childId }: { id: string; childId: string },
  state: State
): State => {
  const children = pathGet(state, ['subComponents', id, 'children'])
  const { i } = $indexOf({ 'a[]': children, a: childId })
  const { a: _children } = removeIndex({ a: children, i })
  state = assocPath(state, ['subComponents', id, 'children'], _children)
  return state
}

export const appendSubComponentChild = (
  { id, childId }: { id: string; childId: string },
  state: State
): State => {
  const { subComponents } = state
  const subComponent = subComponents[id] || {}
  const { children = [] } = subComponent
  return assocPath(
    state,
    ['subComponents', id, 'children'],
    [...children, childId]
  )
}

export const insertSubComponentChild = (
  { id, childId, at }: { id: string; childId: string; at: number },
  state: State
): State => {
  const { subComponents } = state
  const subComponent = subComponents[id] || {}
  const { children = [] } = subComponent
  return assocPath(
    state,
    ['subComponents', id, 'children'],
    _insert(children, at, childId)
  )
}

export const reorderSubComponent = (
  { parentId, childId, to }: { parentId: string; childId: string; to: number },
  state: State
): void => {
  if (parentId) {
    reorder(state.subComponents[parentId].children ?? [], childId, to)
  } else {
    reorder(state.children, childId, to)
  }
}
