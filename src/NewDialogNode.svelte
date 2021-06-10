<script lang="ts">
  import { dialogNodeList } from './stores/scene';
  import DialogNodeSettings from './DialogNodeSettings.svelte';
  let selectedDialogNodeId: string;
  let newDialogNode: DialogNode = {
    "id": "",
    "text": {
      "fr": '',
      "en": ''
    },
    "nextNodes": [],
    "character": "NPC1",
    "attribution": {
      "leader": 0,
      "bricoleur": 0,
      "coequipier": 0,
      "planificateur": 0,
      "idealiste": 0,
      "creatif": 0,
      "audacieux": 0,
      "explorateur": 0
    }
  };

  function addExistingDialogNode() {
    console.log('TODO: add Existing DialogNode');
  }
  function addNewDialogNode() {
    console.log('TODO: add New DialogNode');
  }
</script>

<h5>Réplique existante</h5>

<select bind:value={selectedDialogNodeId}>
  {#each $dialogNodeList as dialogNode}
    <option value={dialogNode.id}>
      {dialogNode.text}
    </option>
  {/each}
</select>

<button on:click={addExistingDialogNode}>Ajouter</button>

<h5>Nouvelle réplique</h5>
 <DialogNodeSettings bind:dialogNode={newDialogNode}/>
<button on:click={addNewDialogNode}>Ajouter</button>