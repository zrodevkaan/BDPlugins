/**
 * @name oneko
 * @description cat follow mouse (real)
 * @author Ven, adryd
 * @version 1.0.0
 */

class NekoAnimation {
  start() {
    fetch("https://raw.githubusercontent.com/zrodevkaan/oneko.js/main/oneko.js")
    .then((response) => response.text())
    .then((script) => {
      const replacementxDD = script.replace(
        "./oneko.gif",
        "https://raw.githubusercontent.com/adryd325/oneko.js/14bab15a755d0e35cd4ae19c931d96d306f99f42/oneko.gif"
      );
      eval(replacementxDD);
    });

      setTimeout(function() {
        const neko = document.getElementById('oneko');
        neko.style.zIndex = 99999999999999;
    }, 100);

  }

  stop() {
    clearInterval(window.onekoInterval);
    delete window.onekoInterval;
    const element = document.getElementById("oneko");
    if (element) {
      element.remove();
    }
  }
}
  
  module.exports = NekoAnimation;  
