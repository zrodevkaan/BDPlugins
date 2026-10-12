import {React} from "../shared.ts";

export function MenuItemLabel({title, subtext}: { title: string, subtext?: string }) {
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <span>{title}</span>
            {subtext && <span style={{fontSize: "12px", color: "var(--text-feedback-critical)"}}>{subtext}</span>}
        </div>
    );
}