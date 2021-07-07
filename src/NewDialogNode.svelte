<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { dialogNodeList } from './stores/scene';
  import DialogNodeSettings from './DialogNodeSettings.svelte';
  import { scene } from './stores/scene';

  export let parentDialogNode: DialogNode;
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

  const dispatch = createEventDispatcher();

  function addExistingDialogNode() {
    if (!parentDialogNode.nextNodes.includes(selectedDialogNodeId)) {
      $scene.dialogNodes[parentDialogNode.id].nextNodes = [...$scene.dialogNodes[parentDialogNode.id].nextNodes, selectedDialogNodeId];
    }
    dispatch('toggleShowNewDialogNode', {toggleChildNodes: false});
  }

  function addNewDialogNode() {
    // Computing first available ID
    const keys: Array<string> = Object.keys($scene.dialogNodes);
    let newId = keys.reduce((max, i) => Number(i) > max ? Number(i) : max, 1) + 1;
    newDialogNode.id = String(newId);

    // Updating parent nextNodes
    $scene.dialogNodes[String(newId)] = newDialogNode;
    $scene.dialogNodes[parentDialogNode.id].nextNodes = [...$scene.dialogNodes[parentDialogNode.id].nextNodes, String(newId)];
    dispatch('toggleShowNewDialogNode', {toggleChildNodes: false});
  }
</script>

<h5>Nouvelle réplique</h5>
 <DialogNodeSettings bind:dialogNode={newDialogNode}/>

<button on:click={addNewDialogNode}>Ajouter</button>


<h5>Réplique existante</h5>

<select bind:value={selectedDialogNodeId}>
  {#each $dialogNodeList as dialogNode}
    <option value={dialogNode.id}>
      {dialogNode.text}
    </option>
  {/each}
</select>

<button on:click={addExistingDialogNode}>Ajouter</button>