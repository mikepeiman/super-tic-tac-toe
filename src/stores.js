import { writable } from "svelte/store";

 const settings = writable({});
 const state = writable({});
 const directionArrays = writable([]);
 const currentPlayer = writable({});
 const gameInProgress = writable(false);
 const preservePlayerDetails = writable(false);
 const movesPlayedHistory = writable([]);
 const players = writable([]);

// storeSettings, storeState, storePlayers, storeCurrentPlayer, storeDirectionArrays, storeGameInProgress, storeMovesPlayedHistory, storePreservePlayerDetails

export let storeSettings = {
  subscribe: settings.subscribe,
  updateSettings: (newSettings) => {
    settings.set(newSettings)
  }
}

export let storeState = {
  subscribe: state.subscribe,
  set: newState => {
    state.set(newState)
    localStorage.setItem('storeState', JSON.stringify(newState))
    // localStorage.setItem('storeState', JSON.stringify(newState))
  }
}

export let storePlayers = {
  subscribe: players.subscribe,
}

export let storeDirectionArrays = {
  subscribe: directionArrays.subscribe,
}

export let storeGameInProgress = {
  subscribe: gameInProgress.subscribe,
}

export let storeCurrentPlayer = {
  subscribe: currentPlayer.subscribe,
}

export let storePreservePlayerDetails = {
  subscribe: preservePlayerDetails.subscribe,
}

export let storeMovesPlayedHistory = {
  subscribe: movesPlayedHistory.subscribe,
}
