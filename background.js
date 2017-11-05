//     This file is part of Play/Pause extension for Chrome and Firefox
//     https://github.com/DanielKamkha/PlayPause
//     (c) 2015-2017 Daniel Kamkha
//     Play/Pause is free software distributed under the terms of the MIT license.

// TODO: browser action dynamic tooltip and icon
// TODO: dark theme icons
// TODO: investigate auto-mute side effect
// TODO: investigate Facebook support
// TODO: Chrome store icon and screenshots

(function() {
  "use strict";

  let browser = chrome || browser;
  let smartPausedTabs = [];

  function smartPause() {
    browser.tabs.query({audible: true, muted: false}, function(tabs) {
      let tabsArePlaying = false;
      if (tabs.length > 0) {
        smartPausedTabs = tabs;
        tabsArePlaying = true;
      }

      if (smartPausedTabs.length > 0) {
        for (let tab of smartPausedTabs) {
          browser.tabs.sendMessage(tab.id, {message: "toggle", paused: tabsArePlaying});
        }
      } else if (!tabsArePlaying) {
        browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
          let tab = tabs[0];
          if (tab) {
            browser.tabs.sendMessage(tab.id, {message: "toggle", paused: false});
          }
        });
      }
    });
  }

  function onTabUpdated(tabId, changeInfo, tab) {
    if (!!changeInfo && !!changeInfo.mutedInfo) {
      browser.tabs.sendMessage(tabId, {message: "toggle", paused: changeInfo.mutedInfo.muted});
    }
  }

  function onMessage(message, sender) {
    if (message.message !== "stateChanged") {
      return;
    }
    if (!!sender && !!sender.tab && sender.tab.id !== undefined) {
      browser.tabs.update(sender.tab.id, {muted: message.paused});
    }
  }

  browser.tabs.onUpdated.addListener(onTabUpdated);
  browser.runtime.onMessage.addListener(onMessage);
  browser.browserAction.onClicked.addListener(smartPause);
})();

