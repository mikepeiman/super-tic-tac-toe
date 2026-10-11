<script>
  import { send, receive } from "./../crossfade.js";
</script>

<h2 class="heading">HOW TO PLAY</h2>
<div class="text-content">
  <div class="subsection" id="how-to-play_winning">
    <h3>Winning The Game</h3>
    <div class="text-content-block" id="two-setup-methods">
      <h4>Scoring Points</h4>
      <div class="text-sub-block">
        <span class="orange bordered">
          The player with the most points at the end wins!
        </span>
      </div>
    </div>
  </div>

  <div class="subsection" id="how-to-play_gameplay">
    <h3>Gameplay Mechanics</h3>
    <div class="text-content-block" id="two-setup-methods">
      <h4>Playing Moves</h4>
      <div class="text-sub-block">
        <p>
          Play a number of moves in a straight line to score points. This number
          is determined in game settings.
        </p>
        <p>
          Just like in tiny-tic-tac-toe, lines can be in any direction: vertical
          <img class="icon" src="tictactoe-vertical.png" alt="" />
          , horizontal
          <img class="icon" src="tictactoe-horizontal.png" alt="" />
          , and both diagonals
          <img class="icon" src="tictactoe-diagonal-down-right.png" alt="" />
          <img class="icon" src="tictactoe-diagonal-down-left.png" alt="" />
          .
        </p>
        <p>
          We can also assign a line bonus for any line that spans uninterrupted
          from one side to the opposite side of the board. This makes the
          strategy a bit more complex.
        </p>
        <div class="text-image-block">
          <p>
            This line earns a full bonus because it spans the long dimension.
            The bonus will be whatever was selected in settings.
          </p>
          <img src="sttt-4x8-linebonus-long (1).png" alt="" />
        </div>
        <div class="text-image-block">
          <p>
            These lines are each partial line bonuses; they are calculated as
            (linebonus / (longer / shorter)). So, in this example with a
            linebonus set at 8, with 8 columns and 4 rows, that means the
            partial bonus is (8 / (8 / 4)) === (8 / 2) === 4 for each of these
            lines (yes, I chose these figures for easy math)
          </p>
          <img src="sttt-4x8-linebonus-short (1).png" alt="" />
        </div>
        <p>
          Unlike traditional (tiny) tic-tac-toe, in Super-Tic-Tac-Toe you play
          on an expanded gameboard of your choosing, up to hundreds of squares.
          You also select how many moves each player gets per turn, and how many
          cells (squares) in a row earns the first point.
        </p>

      </div>
    </div>
    <div class="mixed-content-block">
      <h4>Winning The Game</h4>
      <div class="text-sub-block">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores ipsum
          blanditiis omnis quos illum, error eum debitis porro voluptates,
          incidunt modi nam laboriosam nemo nobis facilis asperiores dolore
          laudantium eveniet ullam veritatis? Dolore ipsam quas consequuntur,
          deleniti, totam quasi beatae eligendi, repellat ex culpa expedita quia
          mollitia. Enim, odit quisquam molestias minima laboriosam eum
          accusamus illum architecto. Tenetur id minus quasi vero in dicta
          suscipit quam ab rem sequi porro qui, odio quod molestias natus dolor
          doloremque veritatis culpa sint aspernatur. Veritatis in modi atque
          nulla illo rerum itaque eligendi, quaerat ullam vel doloremque ab. Rem
          labore ut officia doloremque!
        </p>
      </div>
      <img src="game-settings-config-choice.png" alt="" />
    </div>
  </div>
  <div class="subsection" id="how-to-play_settings">
    <h3>Game Setup</h3>
    <div class="text-content-block" id="two-setup-methods">
      <h4>Choose between two setup methods</h4>
      <div class="text-sub-block">
        <p>
          In every game, you determine the number of players (between 2-8), and
          features like how many points in a row to score, how many points as a
          bonus for a complete line, and how large the gameboard will be
          relative to the viewport.
        </p>
        <p>
          However, not all configurations will result in a game with an equal
          number of turns per player, or even a whole number of turns per round.
          Therefore there are two setup choices provided, both of which compute
          and limit your options to yield an equitable game configuration.
        </p>
        <ol>
          <li>Setup game by board size in rows and columns</li>
          <li>Setup game by number of moves in each turn,</li>
        </ol>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores ipsum
          blanditiis omnis quos illum, error eum debitis porro voluptates,
          incidunt modi nam laboriosam nemo nobis facilis asperiores dolore
          laudantium eveniet ullam veritatis? Dolore ipsam quas consequuntur,
          deleniti, totam quasi beatae eligendi, repellat ex culpa expedita quia
          mollitia. Enim, odit quisquam molestias minima laboriosam eum
          accusamus illum architecto. Tenetur id minus quasi vero in dicta
          suscipit quam ab rem sequi porro qui, odio quod molestias natus dolor
          doloremque veritatis culpa sint aspernatur. Veritatis in modi atque
          nulla illo rerum itaque eligendi, quaerat ullam vel doloremque ab. Rem
          labore ut officia doloremque!
        </p>
      </div>
    </div>
    <div class="mixed-content-block">
      <h4>Choose Which Method To Setup Your Game</h4>
      <div class="text-sub-block">
        <p>
          In every game, you determine the number of players (between 2-8), and
          features like how many points in a row to score, how many points as a
          bonus for a complete line, and how large the gameboard will be
          relative to the viewport.
        </p>
      </div>
      <img src="game-settings-config-choice.png" alt="" />
    </div>
    <div class="mixed-content-block">
      <h4>Choose Which Method To Setup Your Game</h4>
      <div class="text-sub-block">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores ipsum
          blanditiis omnis quos illum, error eum debitis porro voluptates,
          incidunt modi nam laboriosam nemo nobis facilis asperiores dolore
          laudantium eveniet ullam veritatis? Dolore ipsam quas consequuntur,
          deleniti, totam quasi beatae eligendi, repellat ex culpa expedita quia
          mollitia. Enim, odit quisquam molestias minima laboriosam eum
          accusamus illum architecto. Tenetur id minus quasi vero in dicta
          suscipit quam ab rem sequi porro qui, odio quod molestias natus dolor
          doloremque veritatis culpa sint aspernatur. Veritatis in modi atque
          nulla illo rerum itaque eligendi, quaerat ullam vel doloremque ab. Rem
          labore ut officia doloremque!
        </p>
      </div>
      <img src="game-settings-config-choice.png" alt="" />
    </div>
  </div>
  <div class="subsection" id="how-to-play_strategies">
    <h3>Strategies</h3>
    <div class="mixed-content-block">
      <h4>Blocks and Lines</h4>
      <div class="text-sub-block">
        <p>
          The lower the cells-in-a-row to score the more powerful blocks are, because you score points in all four directions. The higher the cells-in-a-row to score (the longer the line required to score), the stronger the strategy of building long lines.
        </p>
      </div>
      <img src="game-settings-config-choice.png" alt="" />
    </div>
  </div>
</div>
