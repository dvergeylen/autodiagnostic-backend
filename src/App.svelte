<script lang="ts">
  import DialogNode from "./DialogNode.svelte";

  export let gender: string;
  export let language: string;
  let files; // always a FileList of max. 1 element
  let scene: Scenario;

  async function loadFile(): Promise<void> {
    const text = await files[0].text();
    scene = JSON.parse(text);
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
      <DialogNode {scene} id={1} dialogNode={scene.dialogNodes["1"]} {gender} {language}/>
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