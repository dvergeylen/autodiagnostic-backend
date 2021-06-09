<script lang="ts">
  import DialogNodeSettings from './DialogNodeSettings.svelte';

  export let language: string;
  export let gender: string;
  export let scene: Scenario;
  export let nodeId: number;
  let dialogNode: DialogNode;
  let showChildNodes: boolean = false;
  let multipleIncomingNodes: boolean = false;
  let readonly: boolean = false;
  let showSettings: boolean = false;

  const t = (text): string => {
    return text?.[language]?.[gender] || text?.[language]?.m || text?.[language] || text.fr;
  }

  const normalizedId: string = `${'0'.repeat(5-String(nodeId).length)}${nodeId}`;

  function toggleShowChildNodes() { showChildNodes = !showChildNodes }
  function toggleShowSettings() { showSettings = !showSettings }

  $: dialogNode = scene.dialogNodes[nodeId];
  $: multipleIncomingNodes = (dialogNode?.incomingNodes?.length > 1 ) || false;
  $: readonly = dialogNode.isTerminal || dialogNode?.incomingNodes?.length > 1;
</script>

<li id="{normalizedId}">
  <div class="dialog-node" class:is-player={dialogNode.character === "Player"}>
    <p>
      {#if !readonly}
        <span on:click={toggleShowSettings} class:is-hidden={showChildNodes}>▷</span>
        <span on:click={toggleShowSettings} class:is-hidden={!showChildNodes}>▽</span>
      {:else}
        <span title="Noeud terminal">¤</span>
      {/if}
      <strong on:click={toggleShowSettings}>{dialogNode.character}</strong>:
      <span  on:click={toggleShowSettings} class:italic={readonly}>{t(dialogNode.text)}</span>

      <span on:click={() => showSettings = !showSettings}>⚙️</span>
      ⊞

      [<span class:is-hidden={!multipleIncomingNodes} class="is-primary"
            title="{dialogNode.incomingNodes?.length || 0} répliques mène(nt) à ce noeud">
            ⇶ {dialogNode.incomingNodes?.length || 0} - 
        </span>
        <span class="is-primary"
        title="Ce noeud mène à {dialogNode.nextNodes.length} réplique(s)"
        on:click={toggleShowChildNodes}>
        💬 {dialogNode.nextNodes.length}
        </span>
      ]
    </p>

    {#if showSettings}
      <DialogNodeSettings />
    {/if}
  </div>

  <ul class:is-hidden={!showChildNodes}>
    {#each dialogNode.nextNodes as nodeId, i (i)}
      <svelte:self {nodeId} {scene} {gender} {language}/>
    {/each}
  </ul>
</li>

<style>
  ul {
    list-style: none;
  }
  div.dialog-node {
    text-align: left;
    border: 1px black solid;
    padding: 0.5em;
    margin-bottom: 0.75em;
  }
  div.dialog-node span,
  div.dialog-node strong {
    cursor: pointer;
  }
  div.dialog-node p {
    margin: 0;
  }
  .is-hidden {
    display: none;
  }
  .italic {
    font-style: italic;
  }
  .is-primary {
    color: rgb(0, 174, 255);
  }
  .is-player {
    background-color: #f2f9ff;
  }
</style>