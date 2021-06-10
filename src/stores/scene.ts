// This store represents a loaded scenario (from an external json file)
import { writable, Writable, derived, Readable } from 'svelte/store';

function normalizeId(id) {
  return `${'0'.repeat(5 - String(id).length)}${id}`;
}

const dummyScene: Scenario = {
  metadata: {
    part: 'I',
    chapter: '1'
  },
  dialogNodes: {}
};

export const scene: Writable<Scenario> = writable(dummyScene);

export const dialogNodeList: Readable<Array<any>> = derived(
  scene,
  $scene => Object.keys($scene.dialogNodes).map((dnKey) => ({
    id: dnKey,
    text: `#${normalizeId(dnKey)} - ${$scene.dialogNodes[dnKey].text.fr?.m || $scene.dialogNodes[dnKey].text.fr}`,
  }),
  )
);