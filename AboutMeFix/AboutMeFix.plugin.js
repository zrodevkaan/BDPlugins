/**
 * @name AboutMeFix
 * @author imafrogowo
 * @description Fixes if a users about me is to long (e.g.. "Hello W ..." which is actually "Hello World") and about all text white space wrapping
 */

class AboutMeFix {
    constructor() { }
    start() {
        BdApi.DOM.addStyle('AboutMeFix', `.markup-eYLPri { white-space: normal;}`)
    }
    stop() {
        BdApi.DOM.removeStyle("AboutMeFix")
    }
}