/**
 * @name ChannelDMs
 * @author Kaan
 * @version 1.0.0
 * @description Recreates sterns old ChannelDms plugin that a allows you to open DMs from a server channel on the memberlist
 */
const {Patcher, Webpack, Utils, React, Components, Hooks} = new BdApi("ChannelDMs")
const {Button} = Components
const Popout = Webpack.getModule((m) => m?.Animation, {searchExports: true, raw: true}).exports.y;
const MemberItem = Webpack.getBySource('onClickPremiumGuildIcon', 'itemProps').Z
const [TextArea] = Webpack.getBulk({
    filter: Webpack.Filters.byStrings(`"text-input"`),
    searchExports: true
})
const {Stores, modules} = Webpack

// This is the main channel component - module 287746
const ChannelComponent = Webpack.getBySource('providedChannel', 'showHeaderGuildBreadcrumb')?.Z
const PrivateChannelHelpers = Webpack.getByKeys('getDMChannelFromUserId')
const AppRoot = Webpack.getModule(Webpack.Filters.bySource("Shakeable"))

const DataStore = new class DataStore extends Utils.Store {
    private state = "server" // friends, server
    private channelsOpen: string[] = []

    getState() {
        return this.state
    }

    setState(state: "friends" | "server") {
        this.state = state
        this.emitChange()
    }

    getChannelsOpen() {
        return this.channelsOpen
    }

    addChannelOpen(id: string) {
        this.channelsOpen.push(id)
        this.emitChange();
    }

    removeChannel(id: string) {
        this.channelsOpen = this.channelsOpen.filter(i => i != id)
        this.emitChange();
    }

    isFriends = () => this.state == "friends"
    isServer = () => this.state == "server"
}

const MemberList = (() => {
    const {
        id,
        exports
    } = Webpack.getModule(Webpack.Filters.bySource('thin', 'none', 'fade', 'ResizeObserver'), {raw: true})
    const source = modules[id].toString()
    return exports[source.match(new RegExp(`(\\w+):\\(\\)=>${source.match(/let (\w+)=/)[1]}`))[1]]
})()

/*
 <Popout
            targetElementRef={ref}
            shouldShow={showPopout}
            onRequestClose={() => setShowPopout(false)}
            renderPopout={() => {
                if (!existingPrivateChannel) {
                    return <div style={{padding: '10px'}}>No DM channel exists</div>
                }

                return (
                    <div style={{width: '500px', height: '400px', overflow: 'hidden'}}>
                        <ChannelComponent providedChannel={existingPrivateChannel}/>
                    </div>
                )
            }}
            position="left"
            children={() => org}
        />
 */

const PrivateChannelComponent = Webpack.getBySource('.getRecipientId())),', 'isMultiUserDM').ZP

const Dragger = ({children, onDrag}) => {
    const ref = React.useRef(null)
    const [isDragging, setIsDragging] = React.useState(false)
    const startPos = React.useRef({x: 0, y: 0})

    const handleMouseDown = (e) => {
        setIsDragging(true)
        startPos.current = {x: e.clientX, y: e.clientY}
        e.preventDefault()
    }

    React.useEffect(() => {
        if (!isDragging) return

        const handleMouseMove = (e) => {
            const dx = e.clientX - startPos.current.x
            const dy = e.clientY - startPos.current.y
            onDrag?.(dx, dy)
            startPos.current = {x: e.clientX, y: e.clientY}
        }

        const handleMouseUp = () => setIsDragging(false)

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, onDrag])

    return (
        <div ref={ref} onMouseDown={handleMouseDown} style={{cursor: isDragging ? 'grabbing' : 'grab'}}>
            {children}
        </div>
    )
}

const FriendsElement = () => {
    const IDs: string[] = Stores.PrivateChannelSortStore.getSortedChannels()[1]

    const handleClick = (e, id) => {
        e.stopPropagation()
        e.preventDefault()
        e.nativeEvent.stopImmediatePropagation()
        console.log(id, Stores.ChannelStore.getChannel(id))
        DataStore.addChannelOpen(id)
        return false
    }

    return IDs.slice(0,3).map(id => <div
        onClick={(e) => handleClick(e, id.channelId)}
        onClickCapture={(e) => handleClick(e, id.channelId)}
        onMouseDown={(e) => handleClick(e, id.channelId)}
        onMouseDownCapture={(e) => handleClick(e, id.channelId)}
        key={id}
    >
        <PrivateChannelComponent
            selected={false}
            guild={undefined}
            channel={Stores.ChannelStore.getChannel(id.channelId)}
            unread={false}
            mentionCount={0}
            userCount={1}
        />
    </div>)
}

const EntireMemberList = ({org}) => {
    const [isFriends, setState] = React.useState(Hooks.useStateFromStores(DataStore, () => DataStore.getState()))

    const startSetState = (state: "friends" | "server") => {
        setState(state)
        DataStore.setState(state)
    }

    return (
        <React.Fragment>
            <div style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                gap: 8,
                padding: '8px'
            }}>
                <Button onClick={() => startSetState("server")}>Members</Button>
                <Button onClick={() => startSetState("friends")}>DMs</Button>
            </div>
            {isFriends == "friends" && (
                <div style={{padding: '0 8px 8px 8px'}}>
                    <TextArea placeholder={"Find or start a conversation"}/>
                </div>
            )}
            {isFriends == "friends" ? <FriendsElement/> : org}
        </React.Fragment>
    )
}

const PopoutMonitor = () => {
    const windows = Hooks.useStateFromStores(
        DataStore,
        () => DataStore.getChannelsOpen().concat()
    );

    const positionsRef = React.useRef({});
    const [, forceRender] = React.useReducer(x => x + 1, 0);

    return <div>
        {windows.map(id => {
            const pos = positionsRef.current[id] || {x: 0, y: 0};

            return (
                <Dragger
                    key={id}
                    onDrag={(dx, dy) => {
                        const prev = positionsRef.current[id] || {x: 0, y: 0};
                        positionsRef.current[id] = {
                            x: prev.x + dx,
                            y: prev.y + dy
                        };
                        forceRender();
                    }}
                >
                    <div style={{
                        position: 'fixed',
                        transform: `translate(${pos.x}px, ${pos.y}px)`,
                        width: '500px',
                        height: '400px',
                        backgroundColor: 'var(--background-base-low)',
                        border: '1px solid var(--background-modifier-accent)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.24)',
                        zIndex: 1000
                    }}>
                        <div
                            onClick={() => {
                                DataStore.removeChannel(id);
                            }}
                            style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '20px',
                                height: '20px',
                                lineHeight: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                fontWeight: 600,
                                borderRadius: '4px',
                                background: 'var(--background-modifier-hover)',
                                zIndex: 1001,
                                userSelect: 'none'
                            }}
                        >
                            ×
                        </div>

                        <ChannelComponent
                            providedChannel={Stores.ChannelStore.getChannel(id)}
                        />
                    </div>
                </Dragger>
            );
        })}
    </div>;
};


export default class ChannelDMs {
    start() {
        arven.Utils.forceUpdateApp()

        Patcher.after(MemberList, 'render', (_, __, res) => {
            const RenderList = res.props.children[0].props.children.props
            if (__[0].innerAriaLabel == "Members") {
                RenderList.children = <EntireMemberList org={RenderList.children}/>
            }
        })

        Patcher.after(AppRoot.Z, 'type', (_, __, tree) => {
            tree.props.children.unshift(<PopoutMonitor/>)
        })
    }

    stop() {
        Patcher.unpatchAll();
    }
}