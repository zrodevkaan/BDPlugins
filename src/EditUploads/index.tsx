/**
 * @name EditUploads
 * @author Kaan
 * @version 1.0.0
 * @description Edit uploads before they are sent
 */

const {Webpack, Data, Utils, Components, React, Patcher} = new BdApi("EditUploads")
const Toolbar = Webpack.getBySource(/spoiler:!.{1,3}.spoiler/)
const ToolbarButton = Webpack.getByStrings('actionBarIcon')

/* skamt code ;p */
const Filters = BdApi.Webpack.Filters
const Modals = /*@__PURE__*/ Webpack.getMangled( /*@__PURE__*/ Filters.bySource("root", "headerIdIsManaged"), {
    ModalRoot: /*@__PURE__*/ Filters.byStrings("rootWithShadow"),
    ModalFooter: /*@__PURE__*/ Filters.byStrings(".footer"),
    ModalContent: /*@__PURE__*/ Filters.byStrings(".content"),
    ModalHeader: /*@__PURE__*/ Filters.byStrings(".header", "separator"),
    Animations: /*@__PURE__*/ a => a.SUBTLE,
    Sizes: /*@__PURE__*/ a => a.DYNAMIC
});

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

const CanvasHolder = ({fileBuffer, ...props}) => {
    const canvasRef = React.useRef(null);
    const [image, setImage] = React.useState(null);
    const [size, setSize] = React.useState({w: 0, h: 0});

    React.useEffect(() => {
        if (!canvasRef.current || !fileBuffer) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const blobUrl = URL.createObjectURL(fileBuffer);

        const img = new Image();
        img.onload = () => {
            setImage(img);
            setSize({w: img.width, h: img.height});

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.clearRect(0, 0, img.width, img.height);
            ctx.drawImage(img, 0, 0, img.width, img.height);

            URL.revokeObjectURL(blobUrl);
        };

        img.onerror = () => {
            console.error('Failed to load image');
            URL.revokeObjectURL(blobUrl);
        };

        img.src = blobUrl;
    }, [fileBuffer]);

    return (
        <Modals.ModalRoot {...props}>
            <Modals.ModalHeader>Edit Upload</Modals.ModalHeader>
            <Modals.ModalContent>
                <canvas
                    {...props}
                    ref={canvasRef}
                    style={{maxWidth: "100%", maxHeight: "500px"}}
                />
            </Modals.ModalContent>
        </Modals.ModalRoot>
    );
};

const ImageEdit16Filled = ({size}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
        <path fill="var(--interactive-normal)"
              d="M4.5 2A2.5 2.5 0 0 0 2 4.5v6.998c0 .51.152.983.414 1.379l4.383-4.383a1.7 1.7 0 0 1 2.404 0l.34.34l2.088-2.087a2.558 2.558 0 0 1 2.369-.689V4.5a2.5 2.5 0 0 0-2.5-2.5H4.5Zm6.998 3.501a1.002 1.002 0 1 1-2.003 0a1.002 1.002 0 0 1 2.003 0Zm1.764 1.506a1.554 1.554 0 0 0-.926.447L8.05 11.742a2.776 2.776 0 0 0-.73 1.29l-.304 1.21a.61.61 0 0 0 .74.74l1.21-.303a2.776 2.776 0 0 0 1.29-.73l4.288-4.288a1.56 1.56 0 0 0-1.28-2.654ZM8.835 9.541l-1.493 1.493a3.777 3.777 0 0 0-.994 1.755l-.302 1.209H4.5c-.51 0-.984-.153-1.379-.414L7.504 9.2a.7.7 0 0 1 .99 0l.34.34Z"/>
    </svg>
);

export default class EditUploads {
    start() {
        Patcher.after(Toolbar, 'Z', (_, [args], returnValue) => {
            if (returnValue?.props?.actions?.props?.children && args?.upload?.item?.file) {
                const fileBuffer = args.upload.item.file;

                returnValue.props.actions.props.children.unshift(
                    <ToolbarButton tooltip="Edit Upload" onClick={() => {
                        ModalSystem.openModal((modalProps) =>
                            <CanvasHolder {...modalProps} fileBuffer={fileBuffer}/>
                        );
                    }}>
                        <ImageEdit16Filled size="24px"/>
                    </ToolbarButton>
                );
            }
        });
    }

    stop() {
        Patcher.unpatchAll();
    }
}