import { writeFileSync } from 'fs'
import { readJSONSync } from 'fs-extra'
import * as glob from 'glob'
import { PATH_SRC_SYSTEM } from '../path'
import { removeLastSegment } from '../removeLastSegment'

const cwd = PATH_SRC_SYSTEM

let count = 0

glob
  .sync(`**/**/spec.json`, {
    cwd,
  })
  .map((path) => removeLastSegment(path))
  .forEach((_) => {
    const spec_file_path = `${cwd}/${_}/spec.json`
    const spec = readJSONSync(spec_file_path)
    const segments = _.split('/')
    const l = segments.length
    const tags = segments.slice(0, l - 1)
    spec.metadata = spec.metadata || {}
    spec.metadata.tags = tags

    const { type, base } = spec

    if (!type) {
      if (base) {
        spec.type = '`U`'
      } else {
        spec.type = '`G`'
      }
    }

    writeFileSync(spec_file_path, JSON.stringify(spec, null, 2))
  })
