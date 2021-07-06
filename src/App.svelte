<script lang="ts">
  import DialogNode from "./DialogNode.svelte";
  import { scene } from './stores/scene';
  import { orphanDialogNodesIds, multipleIncomingNodesIds } from './stores/tree';

  let gender: string = 'm';
  let language: string = 'fr';
  let files: FileList; // always a FileList of max. 1 element
  let filename: string;

  async function loadFile(): Promise<void> {
    const text = await files[0].text();
    filename = files[0].name;
    scene.set(JSON.parse(text));
  }

  function downloadFile(): void {
    // Prepare json content
    const indexLookup: {[k: string]: string} = Object.keys($scene.dialogNodes).reduce((acc, oldIndex, newIndex) => ({...acc, [oldIndex]: String(newIndex + 1)}), {});
    const output = {
      metadata: {...$scene.metadata},
      dialogNodes: {...Object.fromEntries(Object.entries($scene.dialogNodes).map(([key, d], newIndex) => {
        let newNode = Object.assign({}, d);
        newNode.nextNodes = newNode.nextNodes.map<string>((oldIndex) => indexLookup[oldIndex]);
        newNode.id = String(newIndex + 1);
        return [newIndex + 1, newNode];
      }))},
    };

    // Transform JSON into downloadable output
    const link = document.createElement('a');
    const blob = new Blob([JSON.stringify(output, null, 2)], {type : 'application/json'});
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
    <button id="downloadlink" on:click={downloadFile}>Exporter Scénario</button>
    <h3>Partie {$scene.metadata.part}: Chapitre {$scene.metadata.chapter}</h3>

    <h4>Noeud Racine:</h4>
    <ul>
      <DialogNode {gender} {language}
      bind:dialogNode={$scene.dialogNodes["1"]}/>
    </ul>
  {:else}
    <p>Veuillez charger un fichier de scénario JSON.</p>
  {/if}

  {#if $multipleIncomingNodesIds.length > 0}
    <h4 title="Noeuds liés par plusieurs répliques">Noeud(s) à incidences multiples:</h4>
    <ul>
      {#each $multipleIncomingNodesIds as childNodeId, i (i)}
        <DialogNode {gender} {language} renderMultiIncomingVerticesNodeChildren={true}
        bind:dialogNode={$scene.dialogNodes[childNodeId]}/>
      {/each}
    </ul>
  {/if}

  {#if $orphanDialogNodesIds.length > 0}
    <h4 title="Noeuds n'étant la réplique d'aucun autre (et n'étant pas le noeud racine)">Noeud(s) orphelin(s):</h4>
    <ul>
      {#each $orphanDialogNodesIds as childNodeId, i (i)}
        <DialogNode {gender} {language} parentNodeId={'1'}
        bind:dialogNode={$scene.dialogNodes[childNodeId]}/>
      {/each}
    </ul>
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

  #downloadlink {
    cursor: pointer;
  }
</style>