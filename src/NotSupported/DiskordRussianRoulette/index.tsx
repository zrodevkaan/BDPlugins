/**
 * @name DiskordRussianRoulette
 * @author Kaan
 * @version x.x.x
 * @description cedrick sucks lol
 */

const {Webpack, Data, Utils, Components, Patcher} = new BdApi('DiskordRussianRoulette');
const SendMessageModule = Webpack.getByKeys("sendMessage")

function is15Percent() {
    return Math.random() < 0.15;
}

export default class Signal {
    start() {
        Patcher.after(SendMessageModule, "_sendMessage", (a, args, res) => {
            if (is15Percent()) {
                DiscordErrors.softCrash({message: "You've been coconut malled! :coconut:", stack: {error: 'omegalullulullulul troll', message: 'omegalullulullulul troll'}});
                window.open('https://youtu.be/dQw4w9WgXcQ','_blank');
            }
        })
    }

    stop() {
        Patcher.unpatchAll();
    }
}