<script lang="ts">
  import DialogNode from "./DialogNode.svelte";

  export let gender: string;
  export let language: string;
  let files; // always a FileList of max. 1 element
  let scene: Scenario;
  let rootDialogNodeIds = [];

  async function loadFile(): Promise<void> {
    const text = await files[0].text();
    const parsedScene: Scenario = JSON.parse(text);

    /* Browse all nodes and infer incoming vertices */
    Object.entries(parsedScene.dialogNodes).forEach(([id, dialogNode]) => {
      dialogNode.nextNodes.forEach((nextNodeId) => {
        parsedScene.dialogNodes[nextNodeId].incomingNodes = [...(parsedScene.dialogNodes[nextNodeId].incomingNodes || []), id];
      });
    });
    scene = parsedScene;
  }

  $: if (scene) {
    rootDialogNodeIds = Object.keys(scene.dialogNodes).reduce((acc, nodeId) => {
      const dialogNode = scene.dialogNodes[nodeId];
      if (!dialogNode.incomingNodes || dialogNode.isTerminal || dialogNode.incomingNodes.length > 1) {
        return [ ...acc, nodeId];
      } else {
        return acc;
      }
    }, []);
  }
</script>

<main>
  <h1>Auto-Diagnostique</h1>
  <h2>Outil d'édition de dialogues</h2>

  <input bind:files
    on:change={loadFile}
    accept="application/json"
    type="file" id="scenarioFile">

  {#if scene}
    <h3>Partie {scene.metadata.part}: Chapitre {scene.metadata.chapter}</h3>

    <ul>
      {#each rootDialogNodeIds as nodeId, i (i)}
        <DialogNode {scene} {nodeId} {gender} {language}/>
      {/each}
    </ul>
  {:else}
    <p>Veuillez charger un fichier de scénario JSON.</p>
  {/if}
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
  ul {
    list-style: none;
  }
</style>