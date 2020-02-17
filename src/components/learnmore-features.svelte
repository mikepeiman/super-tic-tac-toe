<script>
  import { send, receive } from "./../crossfade.js";
</script>

<h2
  out:send={{ key: 'ui-and-features' }}
  in:receive={{ key: 'ui-and-features' }}
  class="heading">
  FEATURES:
</h2>
<div
  class="text-content"
  out:send={{ key: 'main-content' }}
  in:receive={{ key: 'main-content' }}>
  <ul>
    <li>Play with (theoretically) any number of players</li>
    <li>Set how many moves in a row to score</li>
    <li>
      Set a line bonus for scoring a complete line in any direction
      <ul>
        <li>
          <span class="note">
            NOTE: the full bonus only applies to the longer side if the board is
            asymmetrical.
          </span>
          Shorter side and diagonals receive (bonus / (long / short)) points.
          For example, a line bonus of 15 on a 10x15 board means the longer line
          bonus = 15 while the shorter line bonus = 10.
        </li>
      </ul>
    </li>
    <li>Player names and move-marks selected by players</li>
    <li>
      Score the game at any point, as often as you like - you can even change
      the moves-in-row or line bonus settings and see what the scores would be!
    </li>
  </ul>
</div>
