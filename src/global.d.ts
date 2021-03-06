/// <reference types="svelte" />

interface DialogNodeOption {
  id: string,
  text: string,
}

interface DialogNode {
  id: string,
  text: {
    fr: string | {
      m: string,
      f: string,
    },
    en?: string,
  },
  nextNodes: Array<string>,
  character: "Player" | "NPC1" | "Narrator",
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