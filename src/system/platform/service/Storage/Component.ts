import { Component } from '../../../../client/component'
import DataTree from '../../../../client/component/DataTree/Component'
import parentElement from '../../../../client/parentElement'
import { userSelect } from '../../../../client/style/userSelect'
import { getTree } from '../../../../spec/parser'
import { stringify } from '../../../../spec/stringify'
import { Dict } from '../../../../types/Dict'
import Div from '../../component/Div/Component'

export interface Props {
  style?: Dict<string>
}

export const DEFAULT_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  overflowY: 'auto',
  paddingTop: '3px',
  paddingBottom: '3px',
}

export type CloudStorageSpec = Dict<any>

export async function getCloueStorageData(): Promise<CloudStorageSpec> {
  return {
    foo: 'bar',
    bar: 'zaz',
    zaz: 'bum',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  }
}

export default class StorageService extends Component<HTMLDivElement, Props> {
  private _root: Div
  private _tree: DataTree

  constructor($props: Props) {
    super($props)

    const { style } = $props

    const root = new Div({
      style: {
        ...DEFAULT_STYLE,
        ...style,
      },
    })
    this._root = root

    const tree = new DataTree({
      data: getTree(''),
      style: {
        display: 'none',
        height: 'fit-content',
        margin: 'auto',
        ...userSelect('none'),
      },
    })
    root.registerParentRoot(tree)
    this._tree = tree

    const $element = parentElement()

    this.$element = $element
    this.$slot = root.$slot
    this.$unbundled = false

    this.registerRoot(root)
  }

  onPropChanged(prop: string, current: any): void {
    // console.log('StorageService', 'onPropChanged', prop, current)
    if (prop === 'style') {
      this._root.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    }
  }

  onMount(): void {
    getCloueStorageData().then((_data: CloudStorageSpec) => {
      const value = stringify(_data)
      const data = getTree(value)
      this._tree.setProp('data', data)
    })
  }
}
