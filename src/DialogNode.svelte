<script lang="ts">
  import { onMount } from 'svelte';
  import DialogNodeSettings from './DialogNodeSettings.svelte';
  import NewDialogNode from './NewDialogNode.svelte';
  import { scene } from './stores/scene';
  import { nodeIncomingVertices } from './stores/tree';

  export let language: string;
  export let gender: string;
  export let dialogNode: DialogNode;
  export let parentNodeId: string = '1';
  export let renderMultiIncomingVerticesNodeChildren: boolean = false;
  let showChildNodes: boolean = false;
  let multipleIncomingNodes: boolean = false;
  let terminalNode: boolean = false;
  let showSettings: boolean = false;
  let showNewDialogNode: boolean = false;

  const t = (text: DialogNode["text"]): string => {
    return text?.[language]?.[gender] || text?.[language]?.m || text?.[language] || text.fr;
  }

  function toggleShowChildNodes() {
    showChildNodes = !showChildNodes;

    // Hide settings if uncollapsed
    if (!showChildNodes) {
      showSettings = showChildNodes;
      showNewDialogNode = showChildNodes;
    }
  }
  function toggleShowSettingsAndChildNodes() {
    showSettings = !showSettings;
    showChildNodes = showSettings;

    // Hide new DialogNode if displaying settings
    if (showSettings) {
      showNewDialogNode = false;
    }
  }
  function toggleShowNewDialogNode(event) {
    showNewDialogNode = !showNewDialogNode;

    // We check for false explicitely, as falsy is acceptable
    if (!(event?.detail?.toggleChildNodes === false)) {
      showChildNodes = showNewDialogNode;
    }

    // Hide settings if displaying new DialogNode
    if (showNewDialogNode) {
      showSettings = false;
    }
  }

  function removeAffiliation() {
    $scene.dialogNodes[parentNodeId].nextNodes = $scene.dialogNodes[parentNodeId].nextNodes.filter((id) => id !== dialogNode.id);
  }

  function removeNode() {
    // Remove references
    Object.keys($scene.dialogNodes).forEach((dialogNodeId) => {
      $scene.dialogNodes[dialogNodeId].nextNodes = $scene.dialogNodes[dialogNodeId].nextNodes.filter((id) => id !== dialogNode.id);
    });

    delete $scene.dialogNodes[dialogNode.id];
  }

  $: multipleIncomingNodes = ($nodeIncomingVertices[dialogNode?.id]?.length > 1 ) || false;
  $: terminalNode = dialogNode?.nextNodes?.length === 0;
</script>
<li>
  <div class="dialog-node" class:is-player={dialogNode.character === "Player"}>
    <p>
      {#if !terminalNode}
        <svg on:click={toggleShowChildNodes} class:is-hidden={showChildNodes}>
          <use href='assets/sprite_icons.svg#angle-double-right' />
        </svg>
        <svg on:click={toggleShowChildNodes} class:is-hidden={!showChildNodes}>
          <use href='assets/sprite_icons.svg#angle-double-down' />
        </svg>
        <span class="is-primary"
          title="Ce noeud mène à {dialogNode.nextNodes.length} réplique(s)"
          on:click={toggleShowChildNodes}>
          ({dialogNode.nextNodes.length})
          </span>
      {:else}
        <span title="Noeud terminal">¤</span>
      {/if}
      <strong on:click={toggleShowChildNodes}>{dialogNode.character}</strong>:
      <span  on:click={toggleShowChildNodes} class="italic">"{t(dialogNode.text)}"</span>

      <svg on:click={toggleShowSettingsAndChildNodes}>
        <use href='assets/sprite_icons.svg#edit' />
      </svg>

      <span class:is-hidden={!multipleIncomingNodes} class="is-primary"
        title="{$nodeIncomingVertices[dialogNode.id]?.length || 0} répliques mène(nt) à ce noeud">
        ⇶ {$nodeIncomingVertices[dialogNode.id]?.length || 0} - 
      </span>

      <span title="Ajouter une sous-réplique">
        <svg on:click={toggleShowNewDialogNode}>
          <use href='assets/sprite_icons.svg#plus-square' />
        </svg>
      </span>

      {#if dialogNode.id !== "1"}
        <span title="Supprimer le noeud (irréversible)">
          <svg on:click={removeNode} class="is-float-right ml-1">
            <use href='assets/sprite_icons.svg#times-circle-solid' />
          </svg>
        </span>
      {/if}
      {#if $nodeIncomingVertices[dialogNode.id]?.length > 0}
        <span title="Supprimer la filiation (le noeud ne sera pas supprimé, seul son lien avec son noeud parent)">
          <svg on:click={removeAffiliation} class="is-float-right">
            <use href='assets/sprite_icons.svg#times-circle-regular' />
          </svg>
        </span>
      {/if}
    </p>

    {#if showSettings}
      <DialogNodeSettings bind:dialogNode={dialogNode}/>
    {/if}

    {#if showNewDialogNode}
      <NewDialogNode parentDialogNode={dialogNode} on:toggleShowNewDialogNode={toggleShowNewDialogNode}/>
    {/if}
  </div>

  <!-- Don't render multi-incoming nodes to avoid node tree bloating.
   This property is always given at root level and never propagated to avoid
   child node tree bloating.
   Nodes having only (max) 1 child are rendered ok
   -->
  {#if renderMultiIncomingVerticesNodeChildren ||
      !$nodeIncomingVertices[dialogNode.id] ||
      $nodeIncomingVertices[dialogNode.id]?.length <= 1}
    <ul class:is-hidden={!showChildNodes}>
      {#each dialogNode.nextNodes as childNodeId, i (i)}
        <svelte:self {gender} {language} parentNodeId={dialogNode.id}
        bind:dialogNode={$scene.dialogNodes[childNodeId]}/>
      {/each}
    </ul>
  {/if}
</li>

<style>
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
  .is-player {
    background-color: #f2f9ff;
  }
</style>