/**
 * @name CMPT
 * @description 
 * @author Kaan
 * @version 1.0.0
 */

import { ContextMenuHelper } from "@helpers";

export default class CMPT {
    private unpatchAll: () => void = () => { };
    start() {
        this.unpatchAll = ContextMenuHelper([
            {
                navId: "message",
                patch: (res, props) => {
                    console.log(res, props)
                }
            }
        ])
    }
    stop() {
        this.unpatchAll()
    }
}