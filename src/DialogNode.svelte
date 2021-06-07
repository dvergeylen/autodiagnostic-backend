<script lang="ts">
  export let language: string;
  export let gender: string;
  export let scene: Scenario;
  export let id: number;
  export let dialogNode: DialogNode;

  const t = (text): string => {
    return text?.[language]?.[gender] || text?.[language]?.m || text?.[language] || text.fr;
  }

  const normalizedId = `${'0'.repeat(5-String(id).length)}${id}`;
</script>

<li>
  <p>
    <strong>#{normalizedId}</strong>: {t(dialogNode.text)}
  </p>
  <ul>
    {#each dialogNode.nextNodes as nodeId, i (i)}
      {#if !scene.dialogNodes[nodeId].isTerminal}
        <svelte:self id={nodeId} {scene} dialogNode={scene.dialogNodes[nodeId]} {gender} {language}/>
      {/if}
    {/each}
  </ul>
</li>

<style>
p {
  list-style: none;
  text-align: left;
  border: 1px black solid;
  padding: 0.5em;
}
</style>