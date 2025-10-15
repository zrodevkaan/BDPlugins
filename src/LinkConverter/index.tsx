/**
 * @name LinkConverter
 * @description Converts all links into a configurable embed link
 * @author Kaan
 * @version 1.0.0
 */
const { Webpack, Patcher, Data, React, Components, DOM, ContextMenu } = new BdApi("LinkConverter")
const { useState } = React;
const { Button, ColorInput } = Components
const SelectableSearch = Webpack.getByStrings('customMatchSorter', { searchExports: true })
const Textarea = Webpack.getByStrings('setShouldValidate', 'trailingContent', { searchExports: true })
const Sanitize = Webpack.getByKeys('sanitizeUrl')
const LinkWrapper = Webpack.getModule(x => x.Z.type.toString().includes('sanitizeUrl'))
const MessageActions = Webpack.getByKeys('_sendMessage')
const Modal = Webpack.getModule(x => x.Modal).Modal
const ModalSystem = Webpack.getMangled(".modalKey?", {
    openModalLazy: Webpack.Filters.byStrings(".modalKey?"),
    openModal: Webpack.Filters.byStrings(",instant:"),
    closeModal: Webpack.Filters.byStrings(".onCloseCallback()"),
    closeAllModals: Webpack.Filters.byStrings(".getState();for")
});

const DataStore = new Proxy(
    {},
    {
        get: (_, key) => {
            return Data.load(key);
        },
        set: (_, key, value) => {
            Data.save(key, value);
            return true;
        },
        deleteProperty: (_, key) => {
            Data.delete(key);
            return true;
        },
    }
);

const defaultLinks = [
  {
    type: 'reddit',
    replacements: [
      'https://rxddit.com',
      'https://vxreddit.com'
    ],
    selected: 0
  },
  {
    type: 'twitter',
    replacements: [
      'https://fxtwitter.com',
      'https://fixupx.com',
      'https://vxtwitter.com',
      'https://fixvx.com',
      'https://twittpr.com'
    ],
    selected: 0
  },
  {
    type: 'instagram',
    replacements: ['https://vxinstagram.com'],
    selected: 0
  },
  {
    type: 'tiktok',
    replacements: [
      'https://tnktok.com',
      'https://tfxktok.com'
    ],
    selected: 0
  },
  {
    type: 'youtube',
    replacements: [
      'https://yout-ube.com'
    ],
    selected: 0
  },
  {
    type: 'bluesky',
    replacements: [
      'https://fxbsky.app'
    ],
    selected: 0
  }
];

const replacementsToSelectable = (linkObject: any) => (linkObject?.replacements || []).map((x: string) => ({ label: x, value: x }))
const getReplacementsByDomain = (domain: string) => (DataStore as any).settings.find((x: any) => x.type == domain)

function generateFaviconURL(website) {
    const domain = website.includes('.') ? website : `${website}.com`;
    const url = new URL(`https://twenty-icons.com/${domain}`)
    return url.href;
}

function DomainCard({ domainObj, onChange }: { domainObj: { type: string; replacements?: string[]; selected?: number }, onChange: () => void }) {
    const [editing, setEditing] = useState(false);
    const [didError, setDidError] = useState(false);
    const [newReplacement, setNewReplacement] = useState('');
    const [replacementError, setReplacementError] = useState('');

    const linkObject = getReplacementsByDomain(domainObj.type) as any;
    const replacements = (linkObject?.replacements || []) as string[];

    const setDefault = (index: number) => {
        const org = (DataStore as any).settings as any[];
        const i = org.findIndex((a: any) => a.type == domainObj.type);
        if (i === -1) return;
        org[i].selected = index;
        (DataStore as any).settings = org;
        onChange();
    };

    const addReplacement = () => {
        if (!newReplacement) return;
        if (!newReplacement.startsWith('https://')) {
            setReplacementError('URL must start with https://');
            return;
        }
        const org = (DataStore as any).settings as any[];
        const i = org.findIndex((a: any) => a.type == domainObj.type);
        if (i === -1) return;
        org[i].replacements.push(newReplacement);
        (DataStore as any).settings = org;
        setNewReplacement('');
        setReplacementError('');
        onChange();
        setEditing(e => !e)
    };

    const removeReplacement = (r: string) => {
        const org = (DataStore as any).settings as any[];
        const i = org.findIndex((a: any) => a.type == domainObj.type);
        if (i === -1) return;
        org[i].replacements = org[i].replacements.filter((x: string) => x !== r);
        if (org[i].selected >= org[i].replacements.length) org[i].selected = 0;
        if (org[i].replacements.length === 0) {
            (DataStore as any).settings = org.filter((x: any) => x.type !== domainObj.type);
        } else {
            (DataStore as any).settings = org;
        }
        onChange();
    };

    const deleteDomain = () => {
        const settings = (DataStore as any).settings as any[];
        (DataStore as any).settings = settings.filter((item: any) => item.type !== domainObj.type);
        onChange();
    };

    return (
        <div style={{
            border: '1px solid #2c2f33',
            borderRadius: 8,
            marginBottom: '12px',
            width: '100%',
            padding: 12,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {!didError ? <img style={{ width: '24px' }} onError={() => setDidError(prev => !prev)} src={generateFaviconURL(domainObj.type)} /> : <span>{domainObj.type.substring(0, 1).toUpperCase()}</span>}
                    </div>
                    <div style={{ fontWeight: 600 }}>{domainObj.type}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button onClick={() => setEditing(e => !e)} size={Button.Sizes.SMALL}>{editing ? 'Done' : 'Edit'}</Button>
                    <Button color={Button.Colors.RED} onClick={deleteDomain} size={Button.Sizes.SMALL}>Delete</Button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                <div style={{ width: '100%' }}>
                    <SelectableSearch
                        placeholder={replacements.length ? 'Select default replacement' : 'No replacements yet'}
                        onChange={(e) => {
                            const index = replacements.findIndex((r: string) => r === e)
                            if (index !== -1) setDefault(index)
                        }}
                        options={replacementsToSelectable(linkObject)}
                        value={replacementsToSelectable(linkObject)[linkObject?.selected]}
                        isDisabled={replacements.length === 0}
                    />
                </div>
                {editing && (
                    <>
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }} className="discor-moment">
                            <Textarea
                                placeholder="https://replacement.com"
                                value={newReplacement}
                                onChange={(e) => setNewReplacement(e)}
                                error={replacementError}
                            />
                            <Button onClick={addReplacement}>Add</Button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
                            {replacements.map((replacement, index) => (
                                <div key={replacement} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: 4 }}>
                                    <span style={{ wordBreak: 'break-all' }}>{replacement}</span>
                                    <Button
                                        color={Button.Colors.RED}
                                        size={Button.Sizes.SMALL}
                                        onClick={() => removeReplacement(replacement)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function SettingsPanel() {
    const [, forceUpdate] = useState({});

    const refresh = () => forceUpdate({});

    const handleAddDomain = (type, replacement) => {
        if (!type) return;
        const settings = DataStore.settings;
        const existing = settings.find(x => x.type === type);

        if (existing) {
            if (replacement) existing.replacements.push(replacement);
        } else {
            settings.push({
                type,
                replacements: replacement ? [replacement] : [],
                selected: 0
            });
        }

        DataStore.settings = settings;
        refresh();
    };

    return (
        <div style={{ maxWidth: 720, margin: '0 auto', padding: 6, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {DataStore.settings.length === 0 && <div style={{ color: '#888' }}>No domains configured yet. Add one above.</div>}
                {DataStore.settings.map(d => (
                    <DomainCard key={d.type} domainObj={d} onChange={refresh} />
                ))}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <AddDomainInline onAdd={handleAddDomain} />
            </div>
        </div>
    );
}

function AddDomainInline({ onAdd }) {
    const [type, setType] = useState('');
    const [replacement, setReplacement] = useState('');
    const [error, setError] = useState('');

    const handleAdd = () => {
        if (!type) return;
        if (!replacement.startsWith('https://')) {
            setError('URL must start with https://');
            return;
        }
        onAdd(type.trim().toLowerCase(), replacement.trim());
        setType('');
        setReplacement('');
        setError('');
    };

    return (
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', width: '100%' }}>
            <div style={{ flex: 2 }}>
                <Textarea
                    placeholder="Domain (e.g. reddit or reddit.com)"
                    value={type}
                    onChange={(e) => setType(e)}
                    style={{ marginBottom: 0 }}
                />
            </div>
            <div style={{ flex: 3 }}>
                <Textarea
                    placeholder="Replacement URL (e.g. https://rxddit.com)"
                    value={replacement}
                    onChange={(e) => setReplacement(e)}
                    style={{ marginBottom: 0 }}
                    error={error}
                />
            </div>
            <Button
                onClick={handleAdd}
                disabled={!type.trim()}
                size={Button.Sizes.MEDIUM}
                style={{ height: 36 }}
            >
                Add
            </Button>
        </div>
    );
}

export default class LinkConverter {
    load() { DataStore.settings ??= defaultLinks }
    start() {
        DOM.addStyle('link-convert', '.discor-moment textarea {max-height: 36px !important; min-height: 36x !important;}')
        ContextMenu.patch('textarea-context', this.PTAC)
        Patcher.before(MessageActions, 'sendMessage', (a, b, c) => {
            const obj = b[1];
            obj.content = obj.content.replace(/https?:\/\/(?:[a-zA-Z0-9-]+\.)*([a-zA-Z0-9-]+\.[a-zA-Z]{2,})((?:[\/?#][^\s]*)?)/gm, (url: string, domain: string, path: string) => {
                const baseDomain = domain.split('.').slice(-2).join('.');
                let s = DataStore.settings.find(x => x.type === baseDomain);
                if (!s) {
                    const mainDomain = domain.split('.').slice(-2)[0];
                    s = DataStore.settings.find(x => x.type === mainDomain);
                }
                return s ? s.replacements[s.selected] + (path || '') : url;
            });
        });

        Patcher.before(LinkWrapper.Z, 'type', (_: any, b: any, original: any) => {
            const originalUrl = b[0].href;
            const urlObj = new URL(originalUrl);
            const baseDomain = urlObj.host.split('.').slice(-2).join('.');
            let data = (DataStore as any).settings.find((x: any) => x.type === baseDomain);
            if (!data) {
                const mainDomain = urlObj.host.split('.').slice(-2)[0];
                data = (DataStore as any).settings.find((x: any) => x.type === mainDomain);
            }

            if (!data) return;

            const replacementDomain = new URL(data.replacements[data.selected]).host;
            const newUrl = originalUrl.replace(urlObj.host, replacementDomain);

            b[0].href = newUrl;
            b[0].title = newUrl;
            b[0].children = [<span>{newUrl}</span>];
            return b
        })

        Patcher.instead(Sanitize, 'sanitizeUrl', (_: any, [props]: [string], original: any) => {
            if (!props) return original;
            const urlObj = new URL(props);
            const baseDomain = urlObj.host.split('.').slice(-2).join('.');
            let data = (DataStore as any).settings.find((x: any) => x.type === baseDomain);
            if (!data) {
                const mainDomain = urlObj.host.split('.').slice(-2)[0];
                data = (DataStore as any).settings.find((x: any) => x.type === mainDomain);
            }

            if (!data) return props;

            const replacementDomain = new URL(data.replacements[data.selected]).host;
            return props.replace(urlObj.host, replacementDomain);
        })
    }
    PTAC(res: any, props: any) {
        res.props.children.push(
            ContextMenu.buildItem({
                label: 'LinkConverter',
                id: 'link-converter-settings',
                action: () => ModalSystem.openModal((props: any) => <Modal {...props} title="LinkConverter Settings">
                    <SettingsPanel />
                </Modal>)
            })
        )
    }
    stop() {
        DOM.removeStyle('link-convert')
        ContextMenu.unpatch('textarea-context', this.PTAC)
        Patcher.unpatchAll()
    }
    getSettingsPanel() {
        return <SettingsPanel />
    }
}