//     This file is part of Play/Pause extension for Chrome and Firefox
//     https://github.com/DanielKamkha/PlayPause
//     (c) 2015-2017 Daniel Kamkha
//     Play/Pause is free software distributed under the terms of the MIT license.

(function() {
  "use strict";

  const generalPlayers = [
    {  // YouTube HTML5 on-site
      regex: /.*youtube\.com.*/,
      selector: "button.ytp-play-button",
      indicatorSelector: "div.html5-video-player",
      playingClass: "playing-mode",
      waitForButton: true,
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Last.fm
      regex: /.*\.last\.fm.*/,
      selector: "button.js-play-pause",
      playingClass: "player-bar-btn--pause",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // SoundCloud on-site
      regex: /.*soundcloud\.com.*/,
      selector: "button.playControl",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Hype Machine
      regex: /.*hypem\.com.*/,
      selector: "#playerPlay",
      playingClass: "pause",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Pandora // TODO: broken
      regex: /.*\.pandora\.com.*/,
      selector: "button.PlayButton",
      indicatorTypeAttribute: true,
      playingClass: "data-qa",
      create: PlayPause.SingleButtonGenericPlayer
    },
    {  // Twitch.tv on-site // TODO: broken
      regex: /.*twitch\.tv.*/,
      selector: "button.player-button--playpause",
      indicatorSelector: "#player",
      indicatorTypeAttribute: true,
      playingClass: "data-paused",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // MySpace // TODO: unverified
      regex: /.*myspace\.com.*/,
      selector: "button.play",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Silver.ru
      regex: /.*silver\.ru.*/,
      selector: "div.js-play-pause",
      create: PlayPause.MultiButtonHtml5Player
    },
    
    { // Deezer
      regex: /.*\.deezer\.com.*/,
      selector: "button.control-play",
      indicatorSelector: "button.control-play svg.svg-icon",
      playingClass: "svg-icon-pause",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Jango
      regex: /.*\.jango\.com.*/,
      selector: "#btn-playpause",
      playingClass: "pause",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // iHeartRadio
      regex: /.*\.iheart\.com.*/,
      selector: "button.playButton",
      playingClass: "play-PlayButton",
      invertedCheck: true,
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Slacker
      regex: /.*\.slacker\.com.*/,
      selector: "a.play",
      indicatorSelector: "li.playpause",
      playingClass: " play", // HACK: preceding space is important!
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Spotify
      regex: /.*open\.spotify\.com.*/,
      selector: "button.spoticon-play-16, button.spoticon-pause-16",
      playingClass: "spoticon-pause-16",
      waitForButton: true,
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Pocket Casts
      regex: /.*play\.pocketcasts\.com.*/,
      selector: "div.play_pause_button",
      playingClass: " pause_button", // HACK: preceding space is important!
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Mixcloud
      regex: /.*\.mixcloud\.com.*/,
      selector: "div.player-control",
      playingClass: "pause-state",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Tidal
      regex: /.*listen\.tidal\.com.*/,
      playButtonSelector: "button.play-controls__play",
      pauseButtonSelector: "button.play-controls__pause",
      waitForButton: true,
      create: PlayPause.TwoButtonGenericPlayer
    },
    { // Gaana
      regex: /.*gaana\.com.*/,
      selector: "a.playPause",
      playingClass: " pause", // HACK: preceding space is important!
      waitForButton: true,
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Pleer.net
      regex: /.*pleer\.net.*/,
      selector: "#play",
      playingClass: "pause",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Google Play Music
      regex: /.*play\.google\.com\/music.*/,
      selector: "#player-bar-play-pause",
      playingClass: "playing",
      waitForButton: true,
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Yandex Music
      regex: /.*music\.yandex\.ru.*/,
      selector: "div.player-controls__btn_play",
      playingClass: " player-controls__btn_pause", // HACK: preceding space is important!
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // vk.com
      regex: /.*vk\.com.*/,
      selector: "button.top_audio_player_play",
      indicatorSelector: "#top_audio_player",
      playingClass: "top_audio_player_playing",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // TED talks
      regex: /.*www\.ted\.com.*/,
      playButtonSelector: "a.controls__play",
      pauseButtonSelector: "a.controls__pause",
      indicatorSelector: "div.controls",
      waitForButton: true,
      create: PlayPause.TwoButtonGenericPlayer
    },
    { // player.fm
      regex: /.*player\.fm.*/,
      playButtonSelector: "button.play",
      pauseButtonSelector: "button.pause",
      waitForButton: true,
      create: PlayPause.TwoButtonGenericPlayer
    },
    { // franceculture.fr
      regex: /.*franceculture\.fr.*/,
      selector: "#player button.player-button.play",
      playingClass: "playing",
      create: PlayPause.SingleButtonGenericPlayer
    },
    { // Qobuz
      regex: /.*play\.qobuz\.com.*/,
      selector: "span.pct-player-play, span.pct-player-pause",
      playingClass: "pct-player-pause",
      create: PlayPause.SingleButtonGenericPlayer
    },
    {  // Bandcamp // TODO: bugged in Chrome
      selector: "a.play-btn, div.playbutton, span.item_link_play",
      create: PlayPause.MultiButtonHtml5Player
    }
  ];

  const embedPlayers = [
    {  // Ooyala Flash embedded
      selector: "object, embed",
      srcRegex: /.*player\.ooyala\.com.*/,
      stateGetterName: "getState",
      playStateValue: "playing",
      playFuncName: "playMovie",
      pauseFuncName: "pauseMovie",
      create: PlayPause.DirectAccessFlashPlayer
    },
    {  // Generic catch-all HTML5 media
      selector: PlayPause.mediaSelector,
      create: PlayPause.ButtonlessHtml5Player
    }
  ];

  function detectPlayer(id, win) {
    // Test for win.document access, fail gracefully for unexpected iframes
    try {
      //noinspection JSUnusedLocalSymbols, JSHint
      let dummy = win.document;
    } catch (exception) {
      if (exception.message.toLowerCase().indexOf("permission denied") !== -1) {
        return null;
      } else {
        throw exception;
      }
    }

    let playerDataList = generalPlayers.concat(embedPlayers);
    for (let i = 0; i < playerDataList.length; i++) {
      let playerData = playerDataList[i];
      let player = null;
      if (!playerData.regex || playerData.regex.test(win.location.href)) {
        player = playerData.create.preCondition(win, playerData.selector, playerData) ?
          new playerData.create(id, win, playerData.selector, playerData) :
          null;
      }
      if (player) {
        return player;
      }
    }
    return null;
  }

  window.PlayPause = window.PlayPause || {};
  window.PlayPause.detectPlayer = detectPlayer;
})();
