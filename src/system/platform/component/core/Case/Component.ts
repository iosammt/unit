import Selection from '../../../../../client/component/Selection/Component'
import { Element } from '../../../../../client/element'
import { SPEC_ID_EMPTY } from '../../../../../client/empty'
import { getSpec } from '../../../../../client/spec'
import { applyTheme, NONE } from '../../../../../client/theme'
import { Dict } from '../../../../../types/Dict'
import Div from '../../../../platform/component/Div/Component'
import Class, {
  CLASS_DEFAULT_HEIGHT,
  CLASS_DEFAULT_WIDTH,
} from '../Class/Component'

export interface Props {
  id?: string
  style?: Dict<string>
}

const CASE_WIDTH = 180
const CASE_HEIGHT = (CASE_WIDTH * 3) / 4

export default class Case extends Element<HTMLDivElement, Props> {
  private _showcase: Div

  constructor($props: Props) {
    super($props)

    const { id = SPEC_ID_EMPTY, style } = $props

    const { $theme, $color } = this.$context

    const spec_name_path_color = applyTheme($theme, $color, 60)

    const spec = getSpec(id)
    const { name } = spec
    const spec_class = new Class({
      className: 'explorer-spec-class',
      style: {
        width: `${1.25 * CLASS_DEFAULT_WIDTH}px`,
        height: `${1.25 * CLASS_DEFAULT_HEIGHT}px`,
      },
      id: id,
    })

    const spec_name_comp = new Div({
      style: {
        maxWidth: '105px',
        fontSize: '14px',
        height: '30px',
        textAlign: 'center',
      },
      innerText: name,
    })

    const spec_path_comp = new Div({
      style: {
        fontSize: '10px',
        marginTop: '6px',
        height: '6px',
        textAlign: 'center',
        color: spec_name_path_color,
      },
      innerText: '',
    })
    const spec_selection = new Selection({
      width: CASE_WIDTH,
      height: CASE_HEIGHT,
      stroke: NONE,
    })
    const spec_overlay = new Div({
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
      },
    })
    const showcase = new Div({
      className: 'explorer-spec',
      style: {
        width: `${CASE_WIDTH}px`,
        height: `${CASE_HEIGHT}px`,
        color: 'white',
        position: 'relative',
        border: '1px solid',
        borderColor: NONE,
        // borderColor: WHITE,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '9px',
        cursor: 'pointer',
        flexDirection: 'column',
        ...style,
      },
    })
    showcase.setChildren([
      spec_selection,
      spec_class,
      spec_name_comp,
      spec_path_comp,
      spec_overlay,
    ])

    this._showcase = showcase

    this.$element = showcase.$element
    this.$slot['default'] = showcase.$slot['default']

    this.registerRoot(showcase)
  }

  onPropChanged(prop: string, current: any): void {}
}
