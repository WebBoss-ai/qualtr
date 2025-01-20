import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Mention from "@tiptap/extension-mention";
import Hashtag from "./Hashtag";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import { BoldIcon, ItalicIcon, UnderlineIcon, AlignLeft, AlignCenter, AlignRight, Palette } from 'lucide-react';

const RichTextEditor = ({ content, setContent }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Bold.extend({
                addOptions() {
                    return {
                        HTMLAttributes: {
                            style: 'font-weight: 500;',
                        },
                    };
                },
            }),
            Italic,
            Underline,
            Color.configure({ types: ["textStyle"] }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Mention.configure({
                HTMLAttributes: { class: "mention" },
                suggestion: {
                    items: ({ query }) => {
                        const users = ["john", "doe", "jane", "smith"];
                        return users
                            .filter((user) =>
                                user.toLowerCase().includes(query.toLowerCase())
                            )
                            .map((user) => ({ label: user }));
                    },
                },
            }),
            Hashtag,
        ],
        content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    const ToolbarButton = ({ onClick, isActive, icon: Icon }) => (
        <button
            type="button"
            onClick={onClick}
            className={`p-2 rounded-md transition-all duration-200 ease-in-out ${
                isActive 
                    ? "bg-gray-800 text-white" 
                    : "text-gray-600 hover:bg-gray-200"
            }`}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <div className="bg-white rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="toolbar p-2 bg-gray-100 border-b border-gray-200 flex items-center gap-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    icon={BoldIcon}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    icon={ItalicIcon}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive("underline")}
                    icon={UnderlineIcon}
                />
                <div className="relative">
                    <ToolbarButton
                        onClick={() => {}}
                        isActive={false}
                        icon={Palette}
                    />
                    <input
                        type="color"
                        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
                <div className="h-6 w-px bg-gray-300 mx-1" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    isActive={editor.isActive({ textAlign: "left" })}
                    icon={AlignLeft}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    isActive={editor.isActive({ textAlign: "center" })}
                    icon={AlignCenter}
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    isActive={editor.isActive({ textAlign: "right" })}
                    icon={AlignRight}
                />
            </div>

            {/* Editor */}
            <div className="p-4">
                <EditorContent 
                    editor={editor} 
                    className="prose max-w-none focus:outline-none"
                />
            </div>
        </div>
    );
};

export default RichTextEditor;