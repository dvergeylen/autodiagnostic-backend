// This store represents a loaded scenario (from an external json file)
import { writable, Writable } from 'svelte/store';

const dummyScene: Scenario = {
  metadata: {
    part: 'I',
    chapter: '1'
  },
  dialogNodes: {}
};

export const scene: Writable<Scenario> = writable(dummyScene);