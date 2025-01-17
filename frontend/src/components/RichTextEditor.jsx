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

const RichTextEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Bold,
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

  return (
    <div className="p-4">
      {/* Toolbar */}
      <div className="toolbar mb-2 flex gap-2">
  <button
    type="button" // Add this
    onClick={() => editor.chain().focus().toggleBold().run()}
    className={`px-2 py-1 border rounded ${
      editor.isActive("bold") ? "bg-blue-500 text-white" : ""
    }`}
  >
    Bold
  </button>
  <button
    type="button" // Add this
    onClick={() => editor.chain().focus().toggleItalic().run()}
    className={`px-2 py-1 border rounded ${
      editor.isActive("italic") ? "bg-blue-500 text-white" : ""
    }`}
  >
    Italic
  </button>
  <button
    type="button" // Add this
    onClick={() => editor.chain().focus().toggleUnderline().run()}
    className={`px-2 py-1 border rounded ${
      editor.isActive("underline") ? "bg-blue-500 text-white" : ""
    }`}
  >
    Underline
  </button>
  <input
    type="color"
    onChange={(e) =>
      editor.chain().focus().setColor(e.target.value).run()
    }
    className="px-2 py-1 border rounded"
  />
  <button
    type="button" // Add this
    onClick={() => editor.chain().focus().setTextAlign("left").run()}
    className="px-2 py-1 border rounded"
  >
    Align Left
  </button>
  <button
    type="button" // Add this
    onClick={() => editor.chain().focus().setTextAlign("center").run()}
    className="px-2 py-1 border rounded"
  >
    Align Center
  </button>
  <button
    type="button" // Add this
    onClick={() => editor.chain().focus().setTextAlign("right").run()}
    className="px-2 py-1 border rounded"
  >
    Align Right
  </button>
</div>


      {/* Editor */}
      <div className="border p-2 rounded-md">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
