import { Node } from "@tiptap/core";

const Hashtag = Node.create({
  name: "hashtag",

  group: "inline",

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      tag: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-hashtag]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      {
        ...HTMLAttributes,
        "data-hashtag": "",
        class: "hashtag",
        style: "color: blue; font-weight: bold;",
      },
      `#${HTMLAttributes.tag}`,
    ];
  },

  addKeyboardShortcuts() {
    return {
      Space: ({ editor }) => {
        const { from, to, text } = editor.state.selection.$from.parent.textBetween(
          editor.state.selection.from - 1,
          editor.state.selection.from
        );

        if (text?.[0] === "#") {
          const tag = text.substring(1);
          editor
            .chain()
            .deleteRange({ from, to })
            .insertContent({ type: this.name, attrs: { tag } })
            .run();

          return true;
        }
        return false;
      },
    };
  },
});

export default Hashtag;
