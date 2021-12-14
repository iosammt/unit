import { Callback } from '../../Callback'
import { GraphSpec } from '../../types'
import { $Graph } from './$Graph'

export const $PO_METHOD_CALL = []

export const $PO_METHOD_WATCH = []

export const $PO_METHOD_REF = ['refGlobalUnit']

export const $V_METHOD = [
  ...$PO_METHOD_CALL,
  ...$PO_METHOD_WATCH,
  ...$PO_METHOD_REF,
]

export interface $PO_C {
  $getSpecs(data: {}, callback: Callback<GraphSpec>): void
}

export interface $PO_W {}

export interface $PO_R {
  $refGlobalUnit(data: { id: string; _: string[] }): any

  $graph(data: {}): $Graph
}

export interface $PO extends $PO_C, $PO_W, $PO_R {}
