/**
 * @name ReactPluginTest
 * @author Kaan
 * @version 1.0.1
 * @description pushes react node into something clan related.
 */

const App = new BdApi("ReactPluginTest");
const {Patcher, Webpack, React} = App;

const ClanTag = Webpack.getBySource('chipletContainerInner')

class ReactPluginTest {
    start() {
        Patcher.after(ClanTag.m0, "type" as never, (that, args, res) => {
            res.props.children.props.children.push(React.createElement('div',null, "ReactPluginTest.ignore DIV"))
        })
    }
    stop()
    {
        Patcher.unpatchAll();
    }
}

export default ReactPluginTest;