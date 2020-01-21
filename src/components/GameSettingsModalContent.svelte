<script>
  import SettingsMenu from "./SettingsMenu.svelte";

  export let message;
</script>

<style>
  .modal-title {
    font-size: 2rem;
    text-align: center;
    color: white;
  }
</style>

<h2 class="modal-title">{message}</h2>
<SettingsMenu />
