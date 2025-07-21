/**
 * @name Quoter
 * @description Quote your friends wild statements.
 * @author Kaan
 * @version 1.0.0
 */

const { Webpack, Patcher, ContextMenu } = new BdApi("Quoter")

const generateQuoteImage = async (imageUrl, text, attribution, width = 1250, height = 530) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        function calculateFontSize(text, maxWidth, maxHeight) {
            let baseSize = Math.max(12, Math.min(60, 800 / text.length));

            const wordCount = text.split(' ').length;
            if (wordCount <= 3) baseSize *= 1;
            else if (wordCount <= 6) baseSize *= 1.3;

            return baseSize
        }

        function wrapTextCentered(ctx, text, x, y, maxWidth, lineHeight) {
            var words = text.split(' ');
            var lines = [];
            var line = '';

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = ctx.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    lines.push(line.trim());
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            if (line.trim()) {
                lines.push(line.trim());
            }

            var totalHeight = lines.length * lineHeight;

            var startY = y - (totalHeight / 2) + lineHeight;

            var currentY = startY;
            for (var i = 0; i < lines.length; i++) {
                var lineWidth = ctx.measureText(lines[i]).width;
                var centeredX = x + (maxWidth - lineWidth) / 2;
                ctx.fillText(lines[i], centeredX, currentY);
                currentY += lineHeight;
            }

            return currentY;
        }

        const img = new Image();

        img.onload = () => {
            try {
                ctx.drawImage(img, 0, 0, 600, height);

                const grad = ctx.createLinearGradient(0, 45, 530, 0);
                grad.addColorStop(0, "rgba(0, 0, 0, 0)");
                grad.addColorStop(1, "rgba(0, 0, 0, 1)");
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, height);

                const availableWidth = 400;
                const availableHeight = height;

                const fontSize = calculateFontSize(text, availableWidth, availableHeight) * 1.3
                const lineHeight = fontSize * 1.2;

                ctx.fillStyle = "white";
                ctx.font = `bold ${fontSize * 1.4}px Arial`;

                const centerX = 650;
                const centerY = height / 2;

                const endY = wrapTextCentered(ctx, text, centerX, centerY, availableWidth, lineHeight);

                ctx.fillStyle = "rgba(104, 104, 104, 1)";
                ctx.font = "italic 20px Arial";

                const attrWidth = ctx.measureText(attribution).width;
                const attrX = centerX + (availableWidth - attrWidth) / 2;
                ctx.fillText("- @" + attribution, attrX - 10, endY + 10);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                }, 'image/png');

            } catch (err) {
                reject(err);
            }
        };

        img.onerror = () => {
            reject(new Error('Failed to load image')); // high chance to break from CORS and ISP issues.
        };

        img.crossOrigin = 'anonymous';
        img.src = imageUrl;
    });
};

const CloudUploader = Webpack.getByStrings('uploadFileToCloud', { searchExports: true })
const SelectedStore = Webpack.getStore('SelectedChannelStore')
const UserStore = Webpack.getStore("UserStore")
const Chatbar = Webpack.getBySource('channelTextAreaDisabled', 'handleSubmit')

let onSubmit;

async function upload(a, b, c) {
    const yeah = await generateQuoteImage(a, b, c);

    const file = new File([yeah], 'quote.png', { type: 'image/png' });

    const upload = new CloudUploader({ file }, SelectedStore.getCurrentlySelectedChannelId());

    onSubmit({
        value: "",
        stickers: [],
        uploads: [upload]
    });
}

export default class Quoter {
    constructor() {
        this.contextMenuPatch = null;
    }

    async start() {
        Patcher.before(Chatbar.Z.type, 'render', (a, args) => onSubmit = args[0]?.onSubmit);

        this.contextMenuPatch = ContextMenu.patch('message', (res, props) => {
            res.props.children.props.children.push(ContextMenu.buildItem({
                label: 'Quote User',
                action: async () => {
                    const yesImage = UserStore.getUser(props.message.author.id).getAvatarURL({ size: 1280, animated: true })
                    const img = yesImage.slice(0, yesImage.length - 2) + 1280, text = props.message.content, attribution = props.message.author.username
                    await upload(img, text, attribution);
                }
            }));
        });
    }

    stop() {
        Patcher.unpatchAll();
        if (this.contextMenuPatch) {
            this.contextMenuPatch();
            this.contextMenuPatch = null;
        }
    }
}