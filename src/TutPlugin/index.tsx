/**
 * @name TutPlugin
 * @author based
 * @version 1.0.0
 */
import type {ReactNode} from "react";

const {Patcher, Hooks, Utils, Webpack} = new BdApi("TutPlugin")

// doggy, if you are reading this
// i typed all of this because I had to mentally
// map out how any of this will work if its a BD
// core api or used as a default export somewhere for plugins
// SEE I CAN TYPE THINGS JUST FINE.
// although my naming scheme still sucks.

type Data = {
    spacing: number,
    popoutPosition: string
}

type CompData = {
    title: string | ReactNode[] | ReactNode,
    body: string | ReactNode[] | ReactNode,
    isLongText: boolean,
}

type TutorialDataArgs = {
    comp: CompData,
    config: Data,
    popoutOffset: {
        x: number,
        y: number
    },
    enabled: boolean,
}

const TestTutorial: TutorialDataArgs = {
    comp: {
        title: "Tutorial Test",
        body: "Discords tutorial system is complete booty butt juice-- although this was not intended for client mod users to use it.. It has three different modules for it and you need to use a component which makes this idea kinda annoying to make unless we expose an api for this.",
        isLongText: false, // no idea what this is.
    },
    config: {
        spacing: 8,
        popoutPosition: "right",
    },
    popoutOffset: {
        x: -50,
        y: 50
    },
    enabled: true,
}

const TutorialStoreNew = new class TSN extends Utils.Store {
    private data: Record<string, TutorialDataArgs> = {"tut-test": TestTutorial}

    addTutorial(name: string, data: TutorialDataArgs) {
        this.data[name] = data
        this.emitChange();
        return true
    }

    getTutorial(name: string): TutorialDataArgs {
        return this.data?.[name]
    }

    getTutorialNames() {
        return Object.keys(this.data)
    }

    shouldShow(name: string) {
        return this.data[name].enabled
    }

    disableTutorial(name: string) {
        this.data[name] = {...this.data[name], enabled: false}
        this.emitChange();
    }
}

const TutorialStore = arven.Stores.TutorialIndicatorStore // patch getData
const TutorialComponentModule = n(574842) // patch F
const TutorialComponent = n(728321).A
const TutorialConfigs = n(31456) // patch p
const TutorialIndicatorShowModule = n(166649).A
// this is helper method that I literally have no idea why it exists.
// tutorials are literally only really used once?
// im kinda upset tutorials are react component based and not just an element wrapped in a popout

// this is used internally for configuring where it should show on the component as it uses absolute positioning.
const config = {
    origin: {
        x: 100,
        y: 20
    },
    targetWidth: 0,
    targetHeight: 0,
    offset: {
        x: 0,
        y: 0
    }
};

const openModal = Webpack.getByKeys("openModal") // YAY unmangled!!
const Modal = Webpack.getByKeys("Modal").Modal // mana modal~

function Gargle()
{
    const tutData = Hooks.useStateFromStores(TutorialStoreNew, () => TutorialStoreNew.getTutorial('tut-test'))

    return tutData.enabled ? <TutorialComponent tutorialId="tut-test" inlineSpecs={config} position={"right"}>
        <BdApi.Components.Button onClick={() => TutorialStoreNew.disableTutorial("tut-test")}>
            Tutorial Component
        </BdApi.Components.Button>
    </TutorialComponent> : "HAHAHA NO MORE TUTORIAL.. HOPE YOU LEARNED WHAT TO DO.!!>!>>!>!>!>"
}

export default class stuff {
    start() {
        openModal.openModal((props) => {
            return <Modal {...props}>
                <Gargle />
            </Modal>
        });

        Patcher.instead(TutorialComponentModule, 'F', (_this, args, ret) => {
            const tutorialTarget = args[0]
            const hasNewTutorial = TutorialStoreNew.getTutorial(tutorialTarget)
            let data = ret(tutorialTarget)

            if (hasNewTutorial) {
                data = hasNewTutorial.comp
            }

            return data
        })

        Patcher.instead(TutorialConfigs, 'p', (_this, args, ret) => {
            const tutorialTarget = args[0]
            const hasNewTutorial = TutorialStoreNew.getTutorial(tutorialTarget)
            let data = ret(tutorialTarget)

            if (hasNewTutorial) {
                data = hasNewTutorial.config
            }

            return data
        })

        Patcher.instead(TutorialStore, 'getData', (_this, args, ret) => {
            const tutorialTarget = args[0]
            const data = ret(tutorialTarget)

            const newData = {...data}
            // the original object is frozen for god knows why.
            // why freeze it if its apparently never gonna change and has not in like 5 years?

            TutorialStoreNew.getTutorialNames().forEach((name) => {
                Object.defineProperty(newData, name, {
                    value: {
                        popoutOffset: TutorialStoreNew.getTutorial(name).popoutOffset
                    },
                    writable: true,
                    enumerable: true,
                    configurable: true
                })
            })

            return newData
        })

        Patcher.instead(TutorialStore, 'shouldShow', (_this, args, ret) => {
            return args && TutorialStoreNew.getTutorialNames().includes(args[0]) ? TutorialStoreNew.shouldShow(args[0]) : false; // this is only ever stated once...
        })
    }

    stop() {
        Patcher.unpatchAll()
    }
}