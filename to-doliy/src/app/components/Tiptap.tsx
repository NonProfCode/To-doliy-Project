'use client';


import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Placeholder from '@tiptap/extension-placeholder'

import { useEffect } from 'react'

interface TiptapProps {
  content: string
  onContentChange: (newContent: string) => void
}

const Tiptap = ({ content, onContentChange }: TiptapProps) => {

 const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2],
      },
    }),

    Bold,

    Placeholder.configure({
      placeholder: "Write your thoughts here...",
    }),
  ],

  content, // IMPORTANT

  onUpdate: ({ editor }) => {
  onContentChange(editor.getHTML());
},


  editorProps: {
    attributes: {
      class:
        "bg-[#FDFF9E] text-heading text-sm rounded-base block w-full shadow-xs resize-y focus:outline-none",
    },
  },

  immediatelyRender: false,
});

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  const buttonClass =
    "px-3 py-1 rounded bg-[#FDFF9E] hover:bg-yellow-200 border border-yellow-300 text-sm"

  const activeClass = "bg-yellow-300"

  return (
    <div className="w-full">

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3">

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`${buttonClass} ${editor.isActive('bold') ? activeClass : ''}`}
        >
          Bold
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${buttonClass} ${editor.isActive('italic') ? activeClass : ''}`}
        >
          Italic
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${buttonClass} ${editor.isActive('strike') ? activeClass : ''}`}
        >
          Strike
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`${buttonClass} ${editor.isActive('code') ? activeClass : ''}`}
        >
          Code
        </button>

        {/* Headings */}

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`${buttonClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : ''}`}
        >
          H1
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${buttonClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}
        >
          H2
        </button>

        {/* Lists */}

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${buttonClass} ${editor.isActive('bulletList') ? activeClass : ''}`}
        >
          Bullet
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${buttonClass} ${editor.isActive('orderedList') ? activeClass : ''}`}
        >
          Numbered
        </button>

        {/* Blockquote */}

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${buttonClass} ${editor.isActive('blockquote') ? activeClass : ''}`}
        >
          Quote
        </button>

        {/* Undo / Redo */}

        <button
          onClick={() => editor.chain().focus().undo().run()}
          className={buttonClass}
        >
          Undo
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className={buttonClass}
        >
          Redo
        </button>

      </div>

      {/* Editor */}

      <EditorContent editor={editor} />

    </div>
  )
}

export default Tiptap