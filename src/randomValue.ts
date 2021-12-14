import { randomInArray } from './client/id'
import {
  getTree,
  NULL_TREE,
  TreeNode,
  TreeNodeType,
  _applyGenerics,
  _findGenerics,
} from './spec/parser'
import { Dict } from './types/Dict'
import { rangeArray } from './util/array'

export function propValue<T>({ value }: { value: T }): T {
  return value
}

export function mapTree(values: string[]): TreeNode[] {
  return values.map((v) => getTree(v))
}

const TREE_VALUE_NUMBER = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const TREE_VALUE_STRING = [`'foo'`, `'bar'`, `'zaz'`]
const TREE_VALUE_BOOLEAN = ['true', 'false']
const TREE_VALUE_OBJECT = ['{}', '{foo:"bar"}']
const TREE_VALUE_ARRAY = ['[]', '[0]', '[0,1,2]']

const TREE_NUMBER = mapTree(TREE_VALUE_NUMBER)
const TREE_STRING = mapTree(TREE_VALUE_STRING)
const TREE_BOOLEAN = mapTree(TREE_VALUE_BOOLEAN)
const TREE_OBJECT = mapTree(TREE_VALUE_OBJECT)
const TREE_ARRAY = mapTree(TREE_VALUE_ARRAY)

const LITERAL_TREE_NODE_TYPE: TreeNodeType[] = [
  TreeNodeType.Number,
  TreeNodeType.String,
  TreeNodeType.Boolean,
  TreeNodeType.ObjectExpression,
  TreeNodeType.ArrayExpression,
]

export const MAP_TYPE_EXPRESSION_TO_LITERAL = {
  [TreeNodeType.ArrayExpression]: TreeNodeType.ArrayLiteral,
  [TreeNodeType.ObjectExpression]: TreeNodeType.ObjectLiteral,
}

export const randomLiteralType = () => {
  return randomInArray(LITERAL_TREE_NODE_TYPE)
}

export const getTreeNodeTypeName = (tree_node_type: TreeNodeType) => {
  switch (tree_node_type) {
    case TreeNodeType.Number:
      return 'number'
    case TreeNodeType.String:
      return 'string'
    case TreeNodeType.Boolean:
      return 'boolean'
    case TreeNodeType.ObjectExpression:
      return 'string{}' // TODO
    case TreeNodeType.ArrayExpression:
      return 'number[]' // TODO
  }
}

export function randomValueOfObjectLiteral(type_tree: TreeNode): string {
  return propValue(randomTreeOfObjectLiteral(type_tree))
}

export function randomTreeOfObjectLiteral(type_tree: TreeNode): TreeNode {
  const children = []

  for (const type_key_value of type_tree.children) {
    const [type_key_tree, type_value_tree] = type_key_value.children

    const { value: key } = type_key_tree

    let _key: string = key

    let value_tree: TreeNode

    if (key.endsWith('?')) {
      if (Math.random() > 0.5) {
        _key = key.substr(0, key.length - 1)
        value_tree = randomTreeOfType(type_value_tree)
      }
    } else {
      value_tree = randomTreeOfType(type_value_tree)
    }

    if (value_tree) {
      const key_tree = getTree(_key)
      const key_value_tree = {
        value: `${key_tree.value}:${value_tree.value}`,
        children: [key_tree, value_tree],
        type: TreeNodeType.KeyValue,
      }
      children.push(key_value_tree)
    }
  }
  return {
    value: `{${children.map(propValue).join(',')}}`,
    children,
    type: TreeNodeType.ObjectLiteral,
  }
}

export function randomValueOfArrayLiteral(tree_type: TreeNode): string {
  return propValue(randomTreeOfArrayLiteral(tree_type))
}

export function randomTreeOfArrayLiteral(tree_type: TreeNode): TreeNode {
  const children: TreeNode[] = []

  for (const type_child of tree_type.children) {
    const child_tree = randomTreeOfType(type_child)

    children.push(child_tree)
  }

  return {
    value: `[${children.map(propValue).join(',')}]`,
    type: TreeNodeType.ArrayLiteral,
    children,
  }
}

export function randomValueOfTypeExpression(
  type_tree: TreeNode,
  delimiter_open: string,
  delimiter_close: string
) {
  return propValue(
    randomTreeOfTypeExpression(type_tree, delimiter_open, delimiter_close)
  )
}

export function randomTreeOfTypeExpression(
  type_tree: TreeNode,
  delimiter_open: string,
  delimiter_close: string
): TreeNode {
  const { children: type_children, type: type_type } = type_tree

  const type_type_tree = type_children[0]

  const generics = _findGenerics(type_type_tree)

  const generic_type_map: Dict<string> = {}

  if (generics.size > 0) {
    for (const generic of generics) {
      const chosen_tree_type = randomInArray(LITERAL_TREE_NODE_TYPE)
      const chosen_type = getTreeNodeTypeName(chosen_tree_type)

      generic_type_map[generic] = chosen_type
    }
  }

  const literal_type_tree = _applyGenerics(type_type_tree, generic_type_map)

  const size = Math.floor(Math.random() * 3)

  const range = rangeArray(size)

  const children = range.map(() => randomTreeOfType(literal_type_tree))
  const value = `${delimiter_open}${children
    .map(propValue)
    .join(',')}${delimiter_close}`
  const type = MAP_TYPE_EXPRESSION_TO_LITERAL[type_type]

  return {
    value,
    children,
    type,
  }
}

export function randomValueOfOr(tree: TreeNode): string {
  return randomInArray(tree.children.map((c) => randomValueOfType(c)))
}

export function randomTreeOfOr(tree: TreeNode): TreeNode {
  const { children } = tree

  const child = randomInArray(children)

  const child_type = randomTreeOfType(child)

  return randomTreeOfType(child_type)
}

export function randomValueOfAnd(type_tree: TreeNode): string {
  return propValue(randomTreeOfAnd(type_tree))
}

export function randomTreeOfAnd(type_tree: TreeNode): TreeNode {
  // TODO

  return NULL_TREE
}

export function randomValueOfType(type_tree: TreeNode): string {
  return propValue(randomTreeOfType(type_tree))
}

export function randomTreeOfType(type_tree: TreeNode): TreeNode {
  const { type } = type_tree

  if (type === TreeNodeType.Or) {
    return randomTreeOfOr(type_tree)
  } else if (type === TreeNodeType.And) {
    return randomTreeOfAnd(type_tree)
  } else if (type === TreeNodeType.ObjectLiteral) {
    return randomTreeOfObjectLiteral(type_tree)
  } else if (type === TreeNodeType.ArrayLiteral) {
    return randomTreeOfArrayLiteral(type_tree)
  } else if (type === TreeNodeType.ArrayExpression) {
    return randomTreeOfTypeExpression(type_tree, '[', ']')
  } else if (type === TreeNodeType.ObjectExpression) {
    return randomTreeOfTypeExpression(type_tree, '{', '}')
  } else {
    return randomTreeOfTypeLiteral(type)
  }
}

export function randomTreeOfTypeLiteral(type_tree: TreeNodeType): TreeNode {
  if (type_tree === TreeNodeType.Number) {
    return randomInArray(TREE_NUMBER)
  } else if (type_tree === TreeNodeType.String) {
    return randomInArray(TREE_STRING)
  } else if (type_tree === TreeNodeType.Boolean) {
    return randomInArray(TREE_BOOLEAN)
  } else if (type_tree === TreeNodeType.Object) {
    return randomInArray(TREE_OBJECT)
  } else if (type_tree === TreeNodeType.Generic) {
    return randomTreeOfTypeLiteral(randomLiteralType())
  } else if (type_tree === TreeNodeType.Class) {
    return getTree(randomInArray(Object.keys(globalThis.__specs)))
  } else if (type_tree === TreeNodeType.Any) {
    return randomTreeOfTypeLiteral(randomInArray(LITERAL_TREE_NODE_TYPE))
  }
  return NULL_TREE
}

export function randomValueOfTypeLiteral(type_tree: TreeNodeType): string {
  return propValue(randomTreeOfTypeLiteral(type_tree))
}
