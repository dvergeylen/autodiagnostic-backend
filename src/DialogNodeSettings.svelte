<script lang="ts">
  export let dialogNode: DialogNode;
  let showGenderDetails: boolean;

  function toggleShowGenderDetails() {
    if (typeof dialogNode.text.fr === 'object') {
      dialogNode.text.fr = dialogNode.text.fr.m;
    } else {
      dialogNode.text.fr = {
        m: dialogNode.text.fr,
        f: dialogNode.text.fr,
      }
    }
  }

  $: showGenderDetails = (typeof dialogNode.text.fr === 'object');
</script>

<div class="properties" class:background-gray={dialogNode.character !== "Player"}>
  <div class="mb-3">
    Protagoniste:
      <select bind:value={dialogNode.character}>
        <option value="Player">Joueur</option>
        <option value="NPC1">NPC1</option>
      </select>
  </div>

  <div class="mb-3">
    FR:
    {#if typeof dialogNode.text.fr === 'string'}
      <input type="text" bind:value={dialogNode.text.fr}>
    {/if}
     <span on:click={toggleShowGenderDetails} class:is-enabled={showGenderDetails}>m|f</span>
  </div>
  {#if typeof dialogNode.text.fr === 'object'}
    <div class="details">
      <p>
        m: <input type="text" bind:value={dialogNode.text.fr.m}>
      </p>
      <p>
        f: <input type="text" bind:value={dialogNode.text.fr.f}>
      </p>
    </div>
  {/if}


  <div class="mb-3">
    EN:
    <input type="text" bind:value={dialogNode.text.en}>
  </div>

  <div class="mb-3">
    URL Image:
      <input type="text" bind:value={dialogNode.imagePath}>
  </div>

  <div>
    Attributions:
    <div class="attribution-container">
      <div><input type="number" bind:value={dialogNode.attribution.leader}> Leader</div>
      <div><input type="number" bind:value={dialogNode.attribution.bricoleur}> Bricoleur</div>
      <div><input type="number" bind:value={dialogNode.attribution.coequipier}> Coequipier</div>
      <div><input type="number" bind:value={dialogNode.attribution.planificateur}>Planificateur</div>
      <div><input type="number" bind:value={dialogNode.attribution.idealiste}> Idealiste</div>
      <div><input type="number" bind:value={dialogNode.attribution.creatif}> Creatif</div>
      <div><input type="number" bind:value={dialogNode.attribution.audacieux}>Audacieux</div>
      <div><input type="number" bind:value={dialogNode.attribution.explorateur}> Explorateur</div>
    </div>
    <span class="is-small is-italic">chiffres entiers positifs ou négatifs</span>
  </div>
</div>

<style>
  div.properties{
    margin: 0.5em;
    padding: 1em;
    font-family: monospace;
    font-size: 1.2em;
  }
  div.properties.background-gray {
    background-color: #f6f8fa;
  }
  .is-enabled {
    font-weight: bold;
    padding-top: 0.25em;
    border: 1px solid black;
    border-radius: 0.2em;
    padding-bottom: 0.25em;
    padding-left: 0.5em;
    padding-right: 0.5em;
  }
  div.details {
    margin-left: 1em;
  }
  div.details p{
    margin: 0;
  }
  .attribution-container {
    display: grid;
    grid-template-columns: auto auto;
    margin-top: 1em;
    max-width: 50%;
  }
  input[type="text"] {
    width: 90%;
    max-width: 50em;
  }
  input[type="number"] {
    width: 3em;
  }
</style>