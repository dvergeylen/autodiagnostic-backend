<script lang="ts">
  export let language: string;
  export let gender: string;
  export let scene: Scenario;
  export let nodeId: number;
  let dialogNode: DialogNode;
  let showChildNodes = false;

  const t = (text): string => {
    return text?.[language]?.[gender] || text?.[language]?.m || text?.[language] || text.fr;
  }

  const normalizedId = `${'0'.repeat(5-String(nodeId).length)}${nodeId}`;

  function toggleShowChildNodes() { showChildNodes = !showChildNodes }

  $: dialogNode = scene.dialogNodes[nodeId];
</script>

<li>
  <p on:click={toggleShowChildNodes}>
    <span class:hidden={showChildNodes}>▷</span>
    <span class:hidden={!showChildNodes}>▽</span>
    <strong>#{normalizedId}</strong>: {t(dialogNode.text)} <span class="is-primary">({dialogNode.nextNodes.length})</span>
  </p>
  <ul class:hidden={!showChildNodes}>
    {#each dialogNode.nextNodes as nodeId, i (i)}
      {#if !scene.dialogNodes[nodeId].isTerminal}
        <svelte:self {nodeId} {scene} {gender} {language}/>
      {/if}
    {/each}
  </ul>
</li>

<style>
  ul {
    list-style: none;
  }
  p {
    text-align: left;
    border: 1px black solid;
    padding: 0.5em;
  }
  .hidden {
    display: none;
  }
  .is-primary {
    color: rgb(0, 174, 255);
  }
</style>