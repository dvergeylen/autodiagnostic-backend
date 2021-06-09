<script lang="ts">
  import DialogNode from "./DialogNode.svelte";
  import { scene } from './stores/scene';

  export let gender: string;
  export let language: string;
  let files; // always a FileList of max. 1 element
  let orphanDialogNodeIds: Array<number> = [];
  let multipleIncomingNodesIds: Array<number> = [];


  async function loadFile(): Promise<void> {
    const text = await files[0].text();
    const parsedScene: Scenario = JSON.parse(text);

    /* Browse all nodes and infer incoming vertices */
    Object.entries(parsedScene.dialogNodes).forEach(([id, dialogNode]) => {
      dialogNode.nextNodes.forEach((nextNodeId) => {
        parsedScene.dialogNodes[nextNodeId].incomingNodes = [...(parsedScene.dialogNodes[nextNodeId].incomingNodes || []), id];
      });
    });
    scene.set(parsedScene);
  }


  $: orphanDialogNodeIds = Object.keys($scene.dialogNodes).reduce((acc, dialogNodeId) => (
    !$scene.dialogNodes[dialogNodeId].incomingNodes && dialogNodeId !== "1" ? [ ...acc, dialogNodeId] : acc
  ), []);
  $: multipleIncomingNodesIds = Object.keys($scene.dialogNodes).reduce((acc, dialogNodeId) => (
    $scene.dialogNodes[dialogNodeId]?.incomingNodes?.length > 1 ? [ ...acc, dialogNodeId] : acc
  ), []);
</script>

<main>
  <h1>Auto-Diagnostique</h1>
  <h2>Outil d'édition de dialogues</h2>

  <input bind:files
    on:change={loadFile}
    accept="application/json"
    type="file" id="scenarioFile">

  {#if Object.keys($scene.dialogNodes).length > 0}
    <h3>Partie {$scene.metadata.part}: Chapitre {$scene.metadata.chapter}</h3>

    <h4>Noeud Racine:</h4>
    <ul>
      <DialogNode {gender} {language} bind:dialogNode={$scene.dialogNodes["1"]}/>
    </ul>

    {#if multipleIncomingNodesIds.length > 0}
      <h4 title="Noeuds liés par plusieurs répliques">Noeud(s) à incidences multiples:</h4>
      <ul>
        {#each multipleIncomingNodesIds as childNodeId, i (i)}
          <DialogNode {gender} {language} bind:dialogNode={$scene.dialogNodes[childNodeId]}/>
        {/each}
      </ul>
    {/if}

    {#if orphanDialogNodeIds.length > 0}
      <h4 title="Noeuds n'étant la réplique d'aucun autre (et n'étant pas le noeud racine)">Noeud(s) orphelin(s):</h4>
      <ul>
        {#each orphanDialogNodeIds as childNodeId, i (i)}
          <DialogNode {gender} {language} bind:dialogNode={$scene.dialogNodes[childNodeId]}/>
        {/each}
      </ul>
    {/if}
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
  h4 {
    text-align: left;
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