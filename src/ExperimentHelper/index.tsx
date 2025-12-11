/**
 * @name ExperimentHelper
 * @description A ton of experiment based helpers
 */

const {React, Webpack, Data, Patcher, ContextMenu, UI} = new BdApi('ExperimentHelper')

const UserStore = Webpack.getStore("UserStore")
const ExperimentStore = Webpack.getStore("ExperimentStore")
const ExperimentsLocation = Webpack.getModule(x => String(x).includes('Search experiments'), {raw: true})
const Icon = Webpack.getByKeys('Icon').Icon

function murmurhash3_32_gc(key: string, seed: number = 0): number {
    var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
        k1 =
            ((key.charCodeAt(i) & 0xff)) |
            ((key.charCodeAt(++i) & 0xff) << 8) |
            ((key.charCodeAt(++i) & 0xff) << 16) |
            ((key.charCodeAt(++i) & 0xff) << 24);
        ++i;

        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
        case 3:
            k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2:
            k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1:
            k1 ^= (key.charCodeAt(i) & 0xff);

            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
}

function checkExperiment(userId: string, experimentName: string, rolloutPercentage: number = 50): boolean {
    const hashInput = `${experimentName}:${userId}`;
    const hash = murmurhash3_32_gc(hashInput, 0);
    const position = (hash >>> 0) % 10000;
    const threshold = rolloutPercentage * 100;
    return position < threshold;
}

function getRolloutPosition(userId: string, experimentName: string): number {
    const hashInput = `${experimentName}:${userId}`;
    const hash = murmurhash3_32_gc(hashInput, 0);
    return (hash >>> 0) % 10000;
}

var ModalSystem = Webpack.getMangled(".modalKey?", {
    openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
    openModal: Webpack.Filters.byStrings(",instant:"),
    closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
    closeAllModals: Webpack.Filters.byStrings(".getState();for")
});

const Modal = Webpack.getModule(x => x.Modal).Modal
const TextInput = Webpack.getByStrings('setShouldValidate', {searchExports: true})

const ArrowUpRightDashes = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
        <path fill="var(--interactive-icon-default)"
              d="M11 3a1 1 0 1 0 0 2h6.586l-2.293 2.293a1 1 0 0 0 1.414 1.414L19 6.414V13a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1zm2.707 8.707a1 1 0 0 0-1.414-1.414l-3 3a1 1 0 1 0 1.414 1.414zm-6 6a1 1 0 1 0-1.414-1.414l-3 3a1 1 0 1 0 1.414 1.414z"></path>
    </svg>
)

function ExperimentModal({user}) {
    const [customUserId, setCustomUserId] = React.useState('')
    const [customExperimentId, setCustomExperimentId] = React.useState('')
    const [validUser, setValidUser] = React.useState(user)
    const [treats, setTreats] = React.useState(() =>
        Object.keys(arven.Stores.ExperimentStore.getRegisteredExperiments()).concat(Object.keys(arven.Stores.ApexExperimentStore.getRegisteredExperiments()))
    )

    const [query, setQuery] = React.useState('')

    const results = React.useMemo(() => {
        const allResults = [];
        for (const yes of treats) {
            const rolloutPos = getRolloutPosition(validUser.id, yes);
            allResults.push({id: yes, user_id: validUser.id, rolloutPos: rolloutPos});
        }
        return allResults;
    }, [treats, validUser]);

    const filteredResults = React.useMemo(() => {
        if (!query) return results;
        return results.filter(x => x.id.replaceAll('_', ' ').toLowerCase().includes(query.toLowerCase()));
    }, [results, query]);

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <TextInput
                placeholder={"Search Experiment"}
                value={query}
                onChange={setQuery}
            />
            <div style={{display: 'flex', gap: '8px'}}>
                <TextInput
                    placeholder={"User ID"}
                    value={customUserId}
                    onChange={setCustomUserId}
                />
                <TextInput
                    placeholder={"Experiment ID"}
                    value={customExperimentId}
                    onChange={setCustomExperimentId}
                />
            </div>
            {customUserId && customExperimentId && (
                <div style={{
                    padding: '12px 16px',
                    backgroundColor: 'var(--background-base-low)',
                    borderRadius: '8px',
                    border: '1px solid var(--background-base-lowest)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    alignItems: 'center'
                }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <Icon icon={ArrowUpRightDashes} text={"yes"}
                              onClick={() => window.open(`https://nelly.tools/experiments/${murmurhash3_32_gc(customExperimentId)}`, 'blank')}/>
                        <span style={{fontWeight: '500', color: 'var(--text-default)'}}>
                            {customExperimentId.replaceAll('_', ' ')}
                        </span>
                    </div>
                    <span style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.9em',
                    }}>
                        {getRolloutPosition(customUserId, customExperimentId)}
                    </span>
                </div>
            )}
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {filteredResults.sort((a, b) => a.rolloutPos - b.rolloutPos).map(x => {
                    const rolloutPos = x.rolloutPos
                    return (
                        <div
                            key={x.id}
                            style={{
                                padding: '12px 16px',
                                backgroundColor: 'var(--background-base-low)',
                                borderRadius: '8px',
                                border: '1px solid var(--background-base-lowest)',
                                textAlign: 'left',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <Icon icon={ArrowUpRightDashes} text={"yes"}
                                      onClick={() => window.open(`https://nelly.tools/experiments/${murmurhash3_32_gc(x.id)}`, 'blank')}/>
                                <span style={{fontWeight: '500', color: 'var(--text-default)'}}>
                                    {x.id.replaceAll('_', ' ').replaceAll('-', ' ')}
                                </span>
                            </div>
                            <span style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.9em',
                            }}>
                                {rolloutPos}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default class ExperimentHelper {
    start() {
        const PreviousExperiments: string[] = Data.load("Experiments") ?? []
        const CurrentExperiments = Object.keys(ExperimentStore.getAllExperimentAssignments())
        const NewExperiments = CurrentExperiments.filter(x => !PreviousExperiments.includes(x))

        if (NewExperiments.length > 0) {
            UI.showNotification({
                title: 'New Experiment',
                content: `Found ${NewExperiments.length} new experiment${NewExperiments.length > 1 ? 's' : ''}: ${NewExperiments.join(', ')}`,
            })
        }

        Data.save("Experiments", CurrentExperiments)

        Patcher.after(ExperimentsLocation.exports, 'Z', (a, b, res) => {
            const experiments = res.props.children[1]
            experiments.forEach(x => {
                if (!x.props.originalExperimentId) {
                    x.props.originalExperimentId = x.props.experiment.title;
                }
                const rolloutPos = getRolloutPosition(
                    UserStore.getCurrentUser().id,
                    x.props.experimentId,
                );
                x.props.experiment = {
                    ...x.props.experiment,
                    title: `${x.props.originalExperimentId} - (${rolloutPos})`
                };
            })
        })

        ContextMenu.patch('user-context', this.UECM)
    }

    UECM(res, data) {
        res.props.children.push(
            <ContextMenu.Item id={'ts-is-ass'} label={"Experiment Information"}
                              action={() => ModalSystem.openModal((props) => <Modal size="lg"
                                                                                    title={"Experiment Rollout Checker"}
                                                                                    subtitle={"Check a users rollout position on any experiment"} {...props}><ExperimentModal
                                  user={UserStore.getUser(data.user.id)}/></Modal>)}/>
        )
    }

    stop() {
        Patcher.unpatchAll()
        ContextMenu.unpatch('user-context', this.UECM)
    }
}