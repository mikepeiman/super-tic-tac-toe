<script>
import {onMount} from 'svelte'
export let settings, players

onMount(() => {
  console.log(`MainMenu onMount(), settings`)
  console.log(settings)
})

function initializePlayers() {
  console.log(`MainMenu component, clicked to test countPoints: `, players)
}
function triggerGameBoardUpdate() {
  console.log(`MainMenu component, clicked to test countPoints: `, players)
}
function updateGameSettings() {
  console.log(`MainMenu component, clicked to test countPoints: `, players)
}
</script>

<style lang="scss">

</style>

    <h2>Layout and Game Options</h2>
    <div class="form-wrap">
      <label for="players">
        # Of Players:
        <input
          id="players"
          name="players"
          type="number"
          placeholder={settings.numberOfPlayers}
          bind:value={settings.numberOfPlayers}
          on:input={initializePlayers}
          style="width: 2.5ch;" />
      </label>
      <label for="rows">
        Rows:
        <input
          id="rows"
          name="rows"
          type="number"
          placeholder={settings.rows}
          value={settings.rows}
          on:input={triggerGameBoardUpdate}
          style="width: 2.5ch;" />
      </label>
      <label for="columns">
        Columns:
        <input
          id="columns"
          name="columns"
          type="number"
          placeholder={settings.columns}
          value={settings.columns}
          on:input={triggerGameBoardUpdate}
          style="width: 2.5ch;" />
      </label>
      <label for="size">
        Square size (px):
        <input
          id="size"
          name="size"
          type="number"
          placeholder="24"
          value={settings.size}
          step="4"
          on:input={triggerGameBoardUpdate}
          style="width: 2.5ch;" />
      </label>
      <label for="gutter">
        Gutter (px):
        <input
          id="gutter"
          name="gutter"
          type="number"
          placeholder={settings.gutter}
          value={settings.gutter}
          on:input={triggerGameBoardUpdate}
          style="width: 1.5ch;" />
      </label>
      <label for="movesPerTurn">
        Moves Per Turn:
        <input
          id="movesPerTurn"
          name="movesPerTurn"
          type="number"
          placeholder={settings.movesPerTurn}
          bind:value={settings.movesPerTurn}
          on:input={updateGameSettings}
          style="width: 1.5ch;" />
      </label>
      </div>