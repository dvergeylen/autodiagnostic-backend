<svelte:head>
  <base href="/autodiagnotic">
</svelte:head>

<script lang="ts">
  import DialogNode from "./DialogNode.svelte";
  import { scene } from './stores/scene';

  export let gender: string;
  export let language: string;
  let files: FileList; // always a FileList of max. 1 element
  let filename: string;
  let orphanDialogNodesIds: Array<string> = [];
  let multipleIncomingNodesIds: Array<string> = [];

  /* Browse all nodes and infer incoming vertices */
  function inferIncomingVertices(): void {
    // Reset
    Object.entries($scene.dialogNodes).forEach(([_, dialogNode]) => {
      dialogNode.incomingNodes = [];
    });

    // Recompute
    Object.entries($scene.dialogNodes).forEach(([id, dialogNode]) => {
      dialogNode.nextNodes.forEach((nextNodeId) => {
        $scene.dialogNodes[nextNodeId].incomingNodes = [...($scene.dialogNodes[nextNodeId].incomingNodes || []), id];
      });
    });
  }
  function findOrphanDialogNodesIds(): Array<string> {
    return Object.keys($scene.dialogNodes).reduce((acc, dialogNodeId) => (
      $scene.dialogNodes[dialogNodeId]?.incomingNodes?.length === 0
      && dialogNodeId !== "1" ? [ ...acc, dialogNodeId] : acc
    ), []);
  }

  function findMultipleIncomingNodesIds(): Array<string> {
    return Object.keys($scene.dialogNodes).reduce((acc, dialogNodeId) => (
      $scene.dialogNodes[dialogNodeId]?.incomingNodes?.length > 1 ? [ ...acc, dialogNodeId] : acc
    ), []);
  }

  function updateNodeLists(): void {
    inferIncomingVertices();
    orphanDialogNodesIds = findOrphanDialogNodesIds();
    multipleIncomingNodesIds = findMultipleIncomingNodesIds();
  }

  async function loadFile(): Promise<void> {
    const text = await files[0].text();
    filename = files[0].name;
    scene.set(JSON.parse(text));

    updateNodeLists();
  }

  function downloadFile(): void {
    const link = document.createElement('a');
    const blob = new Blob([JSON.stringify($scene, null, 2)], {type : 'application/json'});
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;

    // Download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

</script>

<main>
  <h1>Auto-Diagnostique</h1>
  <h2>Outil d'édition de dialogues</h2>

  <input bind:files
    on:change={loadFile}
    accept="application/json"
    type="file" id="scenarioFile">

  {#if Object.keys($scene.dialogNodes).length > 0}

    <a id="downloadLink" on:click={downloadFile}>Exporter Scénario</a>
    <h3>Partie {$scene.metadata.part}: Chapitre {$scene.metadata.chapter}</h3>

    <h4>Noeud Racine:</h4>
    <ul>
      <DialogNode {gender} {language}
      bind:dialogNode={$scene.dialogNodes["1"]}
      on:updateNodeLists={updateNodeLists}/>
    </ul>

    {#if multipleIncomingNodesIds.length > 0}
      <h4 title="Noeuds liés par plusieurs répliques">Noeud(s) à incidences multiples:</h4>
      <ul>
        {#each multipleIncomingNodesIds as childNodeId, i (i)}
          <DialogNode {gender} {language}
          bind:dialogNode={$scene.dialogNodes[childNodeId]}
          on:updateNodeLists={updateNodeLists}/>
        {/each}
      </ul>
    {/if}

    {#if orphanDialogNodesIds.length > 0}
      <h4 title="Noeuds n'étant la réplique d'aucun autre (et n'étant pas le noeud racine)">Noeud(s) orphelin(s):</h4>
      <ul>
        {#each orphanDialogNodesIds as childNodeId, i (i)}
          <DialogNode {gender} {language} parentNodeId={'1'}
          bind:dialogNode={$scene.dialogNodes[childNodeId]}
          on:updateNodeLists={updateNodeLists}/>
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
</style>