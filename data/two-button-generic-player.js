//     This file is part of Play/Pause extension for Chrome and Firefox
//     https://github.com/DanielKamkha/PlayPause
//     (c) 2015-2017 Daniel Kamkha
//     Play/Pause is free software distributed under the terms of the MIT license.

(function() {
  "use strict";

  //noinspection JSUnusedLocalSymbols, JSHint
  function TwoButtonGenericPlayer(id, win, selector, playerData) {
    this._playButton = win.document.querySelector(playerData.playButtonSelector);
    this._pauseButton = win.document.querySelector(playerData.pauseButtonSelector);
    this._observer = null;

    if (playerData.indicatorSelector) {
      this._indicator = win.document.querySelector(playerData.indicatorSelector);
    }

    let that = this;
    function initButtonObserver() {
      let indicator = that.getIndicator();
      if (indicator) {
        that._observer = new MutationObserver(() => { PlayPause.notifyStateChanged(id); });
        that._observer.observe(indicator, {attributes: true});
      }
    }

    if (!this._playButton || !this._pauseButton) {
      PlayPause.waitForElementPromise(playerData.playButtonSelector, win.document.body)
        .then(function(buttonElem) {
          that._playButton = buttonElem;
          that._pauseButton = that._playButton.parentNode.querySelector(playerData.pauseButtonSelector);
          initButtonObserver();
          PlayPause.notifyStateChanged(id);
        }
      );
    } else {
      initButtonObserver();
    }
  }

  TwoButtonGenericPlayer.preCondition = function(win, selector, playerData) { // jshint ignore:line
    return playerData.waitForButton ||
      !!( win.document.querySelector(playerData.playButtonSelector) &&
          win.document.querySelector(playerData.pauseButtonSelector) );
  };
  TwoButtonGenericPlayer.prototype = Object.create(PlayPause.PlayerBase.prototype);

  Object.defineProperty(
    TwoButtonGenericPlayer.prototype,
    "paused",
    {
      get: function() {
        return this._playButton ? getComputedStyle(this._playButton).getPropertyValue("display") !== "none" : null;
      }
    }
  );
  TwoButtonGenericPlayer.prototype.play = function() { if (this.paused) { this._playButton.click(); } };
  TwoButtonGenericPlayer.prototype.pause = function() { if (!this.paused) { this._pauseButton.click(); } };
  TwoButtonGenericPlayer.prototype.getIndicator = function() { return this._indicator || this._playButton; };
  TwoButtonGenericPlayer.prototype.destroy = function() { if (this._observer) { this._observer.disconnect(); } };

  window.PlayPause = window.PlayPause || {};
  window.PlayPause.TwoButtonGenericPlayer = TwoButtonGenericPlayer;
})();
