/**
 * @name RenderRawMedia
 * @author Kaan
 * @version 1.0.0
 * @description Renders the direct TikTok, Media or more links in chat
 */
const { Webpack, Net, React } = new BdApi("RenderRawMedia")

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

const SimpleMarkdownWrapper = Webpack.getModule((m) => m.defaultRules && m.parse)
const isSecureLink = (str: string) => /https?:\/\/[^\s]+/.test(str)

const SupportedMedia = [
    {
        name: 'tiktok',
        videoRegex: /"bitrateInfo".*?"UrlList":\s*\[\s*"([^"]+)"/,
        host: 'www.tiktok.com',
        isLink: (content: string) => {
            try {
                return new URL(content).host === 'www.tiktok.com'
            } catch {
                return false
            }
        }
    }
]

const ffmpeg = new FFmpeg()

const getRequestHeaders = () => ({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
});

const getVideoHeaders = () => ({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
});

const convertToMp4 = async (blob: Blob): Promise<Blob> => {
    try {
        if (!ffmpeg.loaded) {
            await ffmpeg.load()
        }

        const inputData = await fetchFile(blob)
        
        await ffmpeg.writeFile('input.video', inputData)
        
        await ffmpeg.exec([
            '-i', 'input.video',
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-crf', '23',
            '-c:a', 'aac',
            '-b:a', '128k',
            'output.mp4'
        ])
        
        const data = await ffmpeg.readFile('output.mp4')
        
        await ffmpeg.deleteFile('input.video')
        await ffmpeg.deleteFile('output.mp4')
        
        return new Blob([data], { type: 'video/mp4' })
    } catch (error) {
        console.error('FFmpeg conversion failed:', error)
        return blob
    }
}

const ParseTiktokShenanigans = async (url: string): Promise<Blob | null> => {
    try {
        const response = await Net.fetch(url, {
            headers: getRequestHeaders()
        });
        const text = await response.text();
        const match = text.match(SupportedMedia[0]?.videoRegex);

        const rawUrl = JSON.parse(`"${match[1]}"`);
        
        const videoResponse = await Net.fetch(rawUrl);

        if (!videoResponse.ok) {
            throw new Error(`Failed to fetch video: ${videoResponse.status}`);
        }
        
        const videoBlob = await videoResponse.blob();
        
        const mimeType = videoBlob.type.toLowerCase();
        if (mimeType.includes('mp4') || mimeType.includes('video/mp4')) {
            return videoBlob;
        }
        
        return await convertToMp4(videoBlob);
    } catch (error) {
        console.error('Error parsing TikTok URL:', error);
        return null;
    }
}

const MediaComponent = ({ url }: { url: string }) => {
    const [mediaUrl, setMediaUrl] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    
    React.useEffect(() => {
        let objectUrl: string | null = null;
        
        const loadMedia = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const blob = await ParseTiktokShenanigans(url);
                if (blob) {
                    objectUrl = URL.createObjectURL(blob);
                    setMediaUrl(objectUrl);
                } else {
                    setError('Failed to load media');
                }
            } catch (err) {
                setError('Error loading media: ' + (err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        
        loadMedia();
        
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [url]);
    
    if (loading) {
        return <div style={{ padding: '10px', fontStyle: 'italic' }}>Loading media...</div>;
    }
    
    if (error) {
        return <div style={{ padding: '10px', color: 'red' }}>Error: {error}</div>;
    }
    
    return mediaUrl ? (
        <video 
            src={mediaUrl} 
            controls 
            style={{ maxWidth: '100%', maxHeight: '400px' }}
            onError={() => setError('Failed to play video')}
        />
    ) : null;
}

export default class RenderRawMedia {
    start() {
        for (const type of SupportedMedia) {
            SimpleMarkdownWrapper.defaultRules[type.name] = {
                order: 0,
                match: (content: string) => {
                    return isSecureLink(content) && type.isLink(content) ? [content] : null
                },
                parse: (capture: string[]) => {
                    return {
                        type: type.name,
                        content: capture[0]
                    }
                },
                react: (node: any, output: any, state: any) => {
                    return React.createElement(MediaComponent, { url: node.content });
                }
            }
        }
        SimpleMarkdownWrapper.parse = SimpleMarkdownWrapper.reactParserFor(SimpleMarkdownWrapper.defaultRules);
    }
    
    stop() {
        for (const type of SupportedMedia) {
            delete SimpleMarkdownWrapper.defaultRules[type.name]
        }
        SimpleMarkdownWrapper.parse = SimpleMarkdownWrapper.reactParserFor(SimpleMarkdownWrapper.defaultRules);
    }
}