//     This file is part of Play/Pause extension for Mozilla Firefox
//     https://github.com/DanielKamkha/PlayPause
//     (c) 2015-2017 Daniel Kamkha
//     Play/Pause is free software distributed under the terms of the MIT license.

(function() {
  "use strict";

  let browser = chrome || browser;

  let playersList = null;
  let activePlayer = null;
  let nextPlayerId = 0;

  function togglePlayPause(message) {
    if (message.message !== "toggle") {
      return;
    }

    let paused = getPausedState();
    if (paused !== null && paused !== message.paused) {
      if (paused) {
        activePlayer = activePlayer || playersList[0];
        activePlayer.play();
      } else {
        playersList.forEach(function(player) { player.pause(); });
      }
    }
  }

  function getPausedState() {
    if (playersList.length === 0) {
      return null;
    }
    // Accumulated 'paused' value:
    // null if all players are in null state,
    // true if all players are in paused state,
    // false otherwise
    return playersList.reduce(function(acc, player) {
      let paused = player.paused;
      if (paused === null) {
        return acc;
      }
      if (acc === null) {
        return paused;
      }
      return acc && paused;
    }, null);
  }

  function notifyStateChanged(id) {
    let paused = getPausedState();
    if (paused !== null) {
      if (!paused && id !== undefined) {
        activePlayer = playersList[id];
      }
      browser.runtime.sendMessage({message: "stateChanged", paused: paused});
    }
  }

  function doAttach() {
    playersList = [];
    let player = PlayPause.detectPlayer(nextPlayerId, window);
    if (player) {
      ++nextPlayerId;
      playersList.push(player);
    }
    let iframes = document.querySelectorAll("iframe");
    for (let i = 0; i < iframes.length; i++) {
      player = PlayPause.detectPlayer(nextPlayerId, iframes[i].contentWindow);
      if (player) {
        ++nextPlayerId;
        playersList.push(player);
      }
    }
    if (playersList.length === 0) {
      playersList = null;
      return;
    }

    browser.runtime.onMessage.addListener(togglePlayPause);
  }

  window.PlayPause.notifyStateChanged = notifyStateChanged;

  doAttach();
})();
