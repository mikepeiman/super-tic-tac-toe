<script>
  import { send, receive } from "./../crossfade.js";
</script>

<h2
  class="heading"
  out:send={{ key: 'issues-and-gotchas' }}
  in:receive={{ key: 'issues-and-gotchas' }}>
  GOTCHA'S / ISSUES
</h2>

<div
  class="text-content"
  out:send={{ key: 'main-content' }}
  in:receive={{ key: 'main-content' }}>
  <p>Actually, it all works surprisingly well.</p>
  <p>
    <span class="note">
      If you run into issues, reload, and if it breaks, clear localStorage and
      reload.
    </span>
  </p>
  <ul>
    <li>
      You can change number of players on-the-fly, but that obviously messes
      with the scoring. Likewise with rows and columns. These functions are
      surprisingly resilient though, and you can actually maintain some
      semblence of continuity depending on your adjustments.
      <p>
        <span class="note">
          TL;DR: Be careful not to change players, rows, columns on the fly!
        </span>
      </p>
    </li>
    <li>
      <span class="cool">
        Cool feature! ~ You
        <span class="bold">CAN</span>
        change the number-of-moves-in-a-row-to-score, and the line bonus on the
        fly and recalculate scoring!
      </span>
      We've discovered that there definitely are different winning strategies
      based on different settings.
    </li>
  </ul>
</div>
