/// <reference types="svelte" />

interface Language {
  "fr",
  "en",
}

interface Gender {
  "m",
  "f",
}

interface DialogNode {
  text: {
    [lang: Language]: string | {
      [gender: Gender] : string,
    },
  },
  nextNodes: Array<string>,
  incomingNodes?: Array<string>,
  character: "Player" | "NPC1",
  attribution?: {
    bricoleur?: number,
    leader?: number,
    coequipier?: number,
    planificateur?: number,
    idealiste?: number,
    creatif?: number,
    audacieux?: number,
    explorateur?: number,
  }
  isTerminal: boolean,
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