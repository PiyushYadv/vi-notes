import React, { useState, useRef, useEffect } from "react";
import type { Note } from "../types/Note";
import { calcTypingSpeed } from "../hooks/calcTypingSpeed";

interface Props {
    onAdd: (title: string, content: string, tag: string, tps: number) => void;
    editingNote?: Note | null;
}

type KeystrokeTiming = {
    holdTime: number;
    gapTime: number;
};

const NoteForm: React.FC<Props> = ({ onAdd, editingNote }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tag, setTag] = useState("");

    const keyDownTime = useRef<number | null>(null);
    const lastKeyUpTime = useRef<number | null>(null);
    const [data, setData] = useState<KeystrokeTiming[]>([]);

    useEffect(() => {
        if (editingNote) {
            setTitle(editingNote.title);
            setContent(editingNote.content);
            setTag(editingNote.tag || "");
        }
    }, [editingNote]);

    const handleKeyDown = () => {
        const now = Date.now();

        let gap = 0;
        if (lastKeyUpTime.current !== null) {
            gap = now - lastKeyUpTime.current;
        }

        keyDownTime.current = now;
        (keyDownTime as any).gap = gap;
    };

    const handleKeyUp = () => {
        const now = Date.now();

        if (keyDownTime.current === null) return;

        const hold = now - keyDownTime.current;
        const gap = (keyDownTime as any).gap || 0;

        const entry: KeystrokeTiming = {
            holdTime: hold,
            gapTime: gap,
        };

        setData((prev) => [...prev, entry]);
        lastKeyUpTime.current = now;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        // ✅ calculate typing speed HERE
        const result = calcTypingSpeed(data); // { cps, wpm }

        const finalTps = result.wpm; // ya wpm bhi le sakta hai

        // ✅ pass to parent
        onAdd(title, content, tag, finalTps);

        // reset
        setTitle("");
        setContent("");
        setTag("");
        setData([]); // important reset
    };

    return (
        <form className="note-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                type="text"
                placeholder="Tag (e.g. Work, Personal)"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
            />

            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
            />

            <button type="submit">
                {editingNote ? "Update Note" : "Add Note"}
            </button>
        </form>
    );
};

export default NoteForm;