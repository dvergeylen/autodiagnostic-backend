/// <reference types="svelte" />

interface DialogNode {
  id: number,
  text: {
    fr?: string | {
      m: string,
      f: string,
    },
    en?: string,
  },
  nextNodes: Array<string>,
  incomingNodes?: Array<string>,
  character: "Player" | "NPC1",
  attribution?: {
    leader?: number,
    bricoleur?: number,
    coequipier?: number,
    planificateur?: number,
    idealiste?: number,
    creatif?: number,
    audacieux?: number,
    explorateur?: number,
  }
  imagePath?: string,
}

interface Scenario {
  metadata: {
    part: string,
    chapter: string,
  };
  dialogNodes: {
    [id: string]: DialogNode,
  };
}