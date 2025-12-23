'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import { useEffect } from 'react';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontSize } from '@/components/ui/FontSize';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Code,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const buttonClasses = (isActive: boolean) =>
    `p-2 rounded transition-colors ${
      isActive
        ? 'bg-gray-200 dark:bg-gray-700'
        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  return (
    <div className="flex items-center flex-wrap gap-1 p-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
      <select
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        value={editor.getAttributes('textStyle').fontFamily || 'Inter'}
        className="p-1 rounded bg-transparent text-sm hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
      >
        <option value="Inter">Inter</option>
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Verdana">Verdana</option>
      </select>

      <select
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        value={editor.getAttributes('textStyle').fontSize || '16px'}
        className="p-1 rounded bg-transparent text-sm hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
      >
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px (Normal)</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
      </select>

      <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClasses(editor.isActive('bold'))} title="Bold">
        <Bold size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClasses(editor.isActive('italic'))} title="Italic">
        <Italic size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClasses(editor.isActive('underline'))} title="Underline">
        <UnderlineIcon size={16} />
      </button>
    </div>
  );
};

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
      }),
      TextStyle,
      FontFamily,
      FontSize,
      Underline,
    ],
    content: '', // Start with empty content on the server
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none p-4 min-h-[250px] focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  // Set content on the client side to avoid SSR hydration errors
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // The `emitUpdate` flag should be part of the options object.
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div className="rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)' }}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} style={{ color: 'var(--color-textPrimary)' }} />
    </div>
  );
};

export default RichTextEditor;