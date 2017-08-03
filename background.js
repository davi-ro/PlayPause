//     This file is part of Play/Pause extension for Chrome and Firefox
//     https://github.com/DanielKamkha/PlayPause
//     (c) 2015-2017 Daniel Kamkha
//     Play/Pause is free software distributed under the terms of the MIT license.

// TODO: add page action, change command to "_execute_browser_action"

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

      for (let tab of smartPausedTabs) {
        browser.tabs.sendMessage(tab.id, {message: "toggle", paused: tabsArePlaying});
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

  function onCommand(command) {
    if (command === "toggle-play-pause") {
      smartPause();
    }
  }

  browser.tabs.onUpdated.addListener(onTabUpdated);
  browser.runtime.onMessage.addListener(onMessage);
  browser.commands.onCommand.addListener(onCommand);
})();
