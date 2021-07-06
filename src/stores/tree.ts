// This store represents the displayed tree, node IDs lists.
// It's not the content itself, which is found in scene.ts
import { derived, Readable } from 'svelte/store';
import { scene } from './scene';

// Computes a key value store of incoming nodes, per node.
// e.g { '4': ['1', '2']} means node '4' has two incoming nodes, '1' and '2
export const nodeIncomingVertices: Readable<{ [nodeId: string]: Array<string> }> = derived(
  scene,
  $scene => Object.entries($scene.dialogNodes).reduce((acc: { [nodeId: string]: Array<string> }, [id, dialogNode]) => {
    dialogNode.nextNodes.forEach((nextNodeId) => {
      acc[nextNodeId] = [...(acc[nextNodeId] || []), id];
    });
    return acc;
  }, {}),
);

export const orphanDialogNodesIds: Readable<Array<string>> = derived(
  [scene, nodeIncomingVertices], // stores[0], stores[1]
  $stores => Object.keys($stores[0].dialogNodes).reduce((acc: string[], dialogNodeId) => (
    !$stores[1][dialogNodeId] && dialogNodeId !== "1" ? [...acc, dialogNodeId] : acc
  ), []),
);

export const multipleIncomingNodesIds: Readable<Array<string>> = derived(
  [scene, nodeIncomingVertices], // stores[0], stores[1]
  $stores => Object.keys($stores[0].dialogNodes).reduce((acc: string[], dialogNodeId) => (
    $stores[1][dialogNodeId]?.length > 1 ? [...acc, dialogNodeId] : acc
  ), []),
);
