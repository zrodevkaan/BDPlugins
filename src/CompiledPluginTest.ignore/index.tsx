/**
 * @name CompiledPluginTest
 * @author Kaan
 * @version 1.0.1
 * @description startTyping compiler test
 */

const App = new BdApi("CompiledPluginTest");
const {Patcher, Webpack} = App;

const Typing = Webpack.getModule(x=>x.startTyping);

class CompiledPluginTest {
    start() {
        Patcher.instead(Typing, "startTyping" as never, (that, args, res) => {
            return null;
        })
    }
    stop()
    {
        Patcher.unpatchAll();
    }
}

export default CompiledPluginTest;