/**
 * @name SettingsRepro
 * @author Kaan
 * @version 1.0.0
 */

const { Webpack, Patcher, React } = new BdApi("SettingsRepro")

const RootSectionModule = Webpack.getModule(x => x.E?.key == "$Root")
const layoutUtils = Webpack.getMangled(Webpack.Filters.bySource('$Root', '.ACCORDION'),
    {
        Pane: x => String(x).includes('.PANE,'),
        Panel: x => String(x).includes('.PANEL,'),
        Button: x => String(x).includes('.SIDEBAR_ITEM,'),
        Section: x => String(x).includes('.SECTION,')
    }
)
// m7 sidebar item
// wf panel
// x1 pane

const TestPane = layoutUtils.Pane("test_pane", {
    StronglyDiscouragedCustomComponent: () => React.createElement('div',{},'hi'),
    buildLayout: () => [],
    render: () => (
        <div>hi ;3</div>
    )
});

const TestPanel = layoutUtils.Panel("test_panel", {
    useTitle: () => "Test Settings",
    useBadge: () => 3,
    buildLayout: () => [TestPane],
});

const TestSettingsItem = layoutUtils.Button("test_sidebar_item", {
    icon: () => <div>X</div>,
    useTitle: () => "Test Settings",
    legacySearchKey: "test_settings",
    buildLayout: () => [TestPanel],
    type: 2,
});

const NewTestSection = layoutUtils.Section('test_section', {
    type: 1,
    useLabel: () => "Test Settings",
    key: 'test_section',
    buildLayout: () => [TestSettingsItem]
})

export default class SettingsRepro {
    start() {
        console.log(layoutUtils)
        Patcher.after(RootSectionModule.E, "buildLayout", (_, args, returnValue) => {
            returnValue.push(NewTestSection);
            console.log(returnValue)
            return returnValue;
        });
    }
    stop() {
        Patcher.unpatchAll()
    }
}