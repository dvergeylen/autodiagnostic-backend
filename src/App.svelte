<script lang="ts">
import { identity } from "svelte/internal";
import DialogNode from "./DialogNode.svelte";

  export let gender: string;
  export let language: string;

  const scene: Scenario = {
    metadata: {
      part: 'I',
      chapter: '1'
    },
    dialogNodes: {
      1: {
        text: {
          fr: {
            m: 'Quelle est votre couleur préférée?',
            f: 'Quelle est votre couleur préférée?',
          }
        },
        nextNodes: ['2', '5'],
        isTerminal: false,
        character: 'NPC1',
      },
      2: {
        text: {
          fr: 'Le bleu'
        },
        nextNodes: ['3'],
        isTerminal: false,
        character: 'Player',
      },
      3: {
        text: {
          fr: 'Le bleu? Moi aussi!'
        },
        nextNodes: ['4'],
        isTerminal: false,
        character: 'NPC1',
      },
      4: {
        text: {
          fr: 'Mais le rouge est sympa aussi'
        },
        nextNodes: ['8'],
        isTerminal: false,
        character: 'NPC1',
      },
      5: {
        text: {
          fr: 'Le rouge'
        },
        nextNodes: [6],
        isTerminal: false,
        character: 'Player',
      },
      6: {
        text: {
          fr: `Le rouge? Moi je n'aime pas trop`
        },
        nextNodes: ['7'],
        isTerminal: false,
        character: 'NPC1',
      },
      7: {
        text: {
          fr: 'En fait je préfère le bleu..'
        },
        nextNodes: ['8'],
        isTerminal: false,
        character: 'NPC1',
      },
      8: {
        text: {
          fr: 'A bientôt!'
        },
        nextNodes: [],
        isTerminal: true,
        character: 'Player',
      }
    }
  }
</script>

<main>
	<h1>Auto-Diagnostique</h1>
  <h2>Outil d'édition de dialogues</h2>
  <h3>Partie {scene.metadata.part}: Chapitre {scene.metadata.chapter}</h3>

  <ul>
    <DialogNode {scene} id={1} dialogNode={scene.dialogNodes["1"]} {gender} {language}/>
  </ul>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>