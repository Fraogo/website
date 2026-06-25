'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
  Bold, Italic, Strikethrough, Heading2, Heading3,
  List, ListOrdered, Quote, Link2, Image as ImageIcon, Undo2, Redo2,
} from 'lucide-react'

function ToolbarButton({
  onClick, active, disabled, label, children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${
        active ? 'bg-[#1B4AD4] text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', prev || 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt('Image URL (https://...)', 'https://')
    if (url && url !== 'https://') editor.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/60 rounded-t-xl">
      <ToolbarButton label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <span className="w-px h-5 bg-gray-200 mx-1" />

      <ToolbarButton label="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <span className="w-px h-5 bg-gray-200 mx-1" />

      <ToolbarButton label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
        <Quote className="w-4 h-4" />
      </ToolbarButton>

      <span className="w-px h-5 bg-gray-200 mx-1" />

      <ToolbarButton label="Add link" onClick={setLink} active={editor.isActive('link')}>
        <Link2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Add image by URL" onClick={addImage}>
        <ImageIcon className="w-4 h-4" />
      </ToolbarButton>

      <span className="w-px h-5 bg-gray-200 mx-1" />

      <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo2 className="w-4 h-4" />
      </ToolbarButton>
    </div>
  )
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (html: string) => void
}) {
  const editor = useEditor({
    immediatelyRender: false, // required for Next.js SSR — avoids hydration mismatch
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer nofollow' } }),
      Image,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'tiptap-content focus:outline-none px-4 py-3 min-h-[320px]',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
