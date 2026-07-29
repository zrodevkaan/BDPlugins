/**
 * @name WhoReacted
 * @author Kaan
 * @version 1.0.0
 */
import {wpGetBySource} from "@helpers";

const {Webpack, Patcher} = new BdApi("WhoReacted");

export default class WhoReacted {
    start() {
        const ReactionType = wpGetBySource(["getReactionPickerAnimation"], {
            searchDefault: false,
            declarationFilter: x => String(x.type).includes("getReactionPickerAnimation")
        })

        Patcher.after(ReactionType, 'type', (a, b, c) => {
            console.log(a,b,c)
            return
            const data = b[0]

            const message = data.message
            const emoji = data.emoji

            console.log(c.props.children)
            c.props.children[1].push(
                <div>
                    hi owo
                </div>
            )
        })
    }

    stop() {
        Patcher.unpatchAll();
    }
}