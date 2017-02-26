//     This file is part of Play/Pause extension for Mozilla Firefox
//     https://github.com/DanielKamkha/PlayPauseFirefox
//     (c) 2015-2017 Daniel Kamkha
//     With contributions from R0maric
//     https://github.com/R0maric
//     Play/Pause is free software distributed under the terms of the MIT license.

(function () {
  "use strict";

  function stop(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function listKey(e) {
    let str = [];
    if (e.ctrlKey) {
      str.push("Ctrl");
    }
    if (e.metaKey) {
      str.push("Accel");
    }
    if (e.shiftKey) {
      str.push("Shift");
    }
    if (e.altKey) {
      str.push("Alt");
    }
    str.push(String.fromCharCode(e.keyCode));
    return str.join("-");
  }

  function downedToggle(e) {
    e.preventDefault();
    if (e.repeat) {
      return;
    }

    let str = listKey(e);
    if (str.match(/[^\x20-\x7E]+/) === null) {
      e.target.value = str;
      self.port.emit("hotkey", str);
    }
  }

  self.port.on("init", function (msg) {
    let inputToggle = document.getElementById("inputToggle");

    inputToggle.select();
    inputToggle.value = msg;

    inputToggle.addEventListener("keydown", downedToggle, false);
    inputToggle.addEventListener("keyup", stop, false);
    inputToggle.addEventListener("keypress", stop, false);
  });
})();
