

        <h2
          class="heading"
          out:send={{ key: 'how-to-play' }}
          in:receive={{ key: 'how-to-play' }}>
          HOW TO PLAY:
        </h2>
        <div
          class="text-content"
          out:send={{ key: 'main-content' }}
          in:receive={{ key: 'main-content' }}>
          <ol>
            <li>Set your game settings (# of players, cells to score, etc)</li>
            <li>
              Set your player names and chosen marks (single ASCII character)
            </li>
            <li>
              Play! You'll get visual indications for turns remaining and turn
              changeovers
            </li>
            <li>
              See your current score anytime with the "Tally Scores" button, or
              wait until the game is done to see who is the champion!
            </li>
          </ol>
        </div>
      