<script>
  import SettingsMenu from "./SettingsMenu.svelte";

  export let message;
</script>

<style>
  .modal-title {
    grid-area: title;
    font-size: 2rem;
    text-align: center;
    color: #32c8ff;
  }
</style>

<h2 class="modal-title">{message}</h2>
<SettingsMenu />
