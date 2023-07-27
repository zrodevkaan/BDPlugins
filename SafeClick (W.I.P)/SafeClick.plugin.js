/**
 * @name SafeClick
 * @description Saves you from middle click bypasses on links or from random links you clicked by accident!
 * @author imafrogowo
 * @version 1.0.0
 */

module.exports = class {
    constructor() {
      this.confirmModelListener = null;
    }
  
    confirmModal(event) {
      event.preventDefault();
      const link = event.target.getAttribute("href");
      BdApi.showConfirmationModal(
        "⚠️ Warning",
        `You clicked on a link which may not be safe for you to click. Do you wish to visit said site? ${link}`,
        {
          confirmText: "Visit Site!",
          cancelText: "No thanks.",
          onConfirm: () => {
            window.open(link);
          },
        }
      );
    }
  
    start() {
        this.confirmModelListener = (event) => {
          const { button, target } = event;
          const isLink = target.tagName === "A" && target.getAttribute("href")?.startsWith("/channels/") === false;
          (button <= 1 && isLink) && this.confirmModal(event);
        };
      
        window.addEventListener("mousedown", this.confirmModelListener);
    }
      
  
    stop() {
      window.removeEventListener("mousedown", this.confirmModelListener);
    }
  };
