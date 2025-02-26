import { Graph } from '../../Class/Graph'
import { GraphMoveSubGraphIntoData } from '../../Class/Graph/interface'
import { G_EE } from '../../types/interface/G'
import { Moment } from './../Moment'

export interface GraphMoveSubgraphIntoMomentData
  extends GraphMoveSubGraphIntoData {
  path: string[]
}

export interface GraphMoveSubgraphIntoMoment
  extends Moment<GraphMoveSubgraphIntoMomentData> {}

export function watchGraphMoveSubgraphEvent(
  event: 'move_subgraph_into' | 'move_subgraph_out_of',
  graph: Graph,
  callback: (moment: GraphMoveSubgraphIntoMoment) => void
): () => void {
  const listener = (
    ...[
      graphId,
      spec,
      selection,
      mapping,
      moves,
      path,
    ]: G_EE['move_subgraph_into']
  ) => {
    callback({
      type: 'graph',
      event,
      data: {
        graphId,
        spec,
        selection,
        mapping,
        moves,
        path,
      },
    })
  }
  graph.prependListener(event, listener)
  return () => {
    graph.removeListener(event, listener)
  }
}
