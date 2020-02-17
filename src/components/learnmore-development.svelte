<script>
  import { send, receive } from "./../crossfade.js";
</script>

<div
  class="text-content"
  out:send={{ key: 'main-content' }}
  in:receive={{ key: 'main-content' }}>
  <h2
    class="heading"
    out:send={{ key: 'development-thoughts' }}
    in:receive={{ key: 'development-thoughts' }}>
    DEVELOPMENT (tentative roadmap):
  </h2>
  <div class="text-content">
    <ul>
      <li>Incremental point bonuses and other scoring variations</li>
      <li>A range of gameplay features, too numerous to list here....</li>
      <li>Save and load games via local file system</li>
      <li>User authentication/login, save games and profile to DB</li>
      <li>Make solid mobile layout (currently designed for desktop)</li>
      <li>
        MULTI-DEVICE PLAY! Yes, making this a real multiplayer game, where you
        can set a lobby name and have friends join from their devices.
      </li>
      <li>Publish in the app stores.</li>
    </ul>
  </div>
</div>
