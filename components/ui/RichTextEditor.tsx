'use client';

import { useEditor, EditorContent, Editor, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Extension, mergeAttributes } from '@tiptap/core';
import { useEffect, useState } from 'react';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Indent as IndentIcon,
  Outdent,
  Image as ImageIcon,
} from 'lucide-react';
import { upload } from '@vercel/blob/client';

declare module '@tiptap/core' {
  interface Storage {
    folderName?: string;
  }
  interface Commands<ReturnType> {
    indent: {
      indent: () => ReturnType;
      outdent: () => ReturnType;
    }
  }
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  folderName?: string;
  disableImages?: boolean;
}

const Toolbar = ({ editor, disableImages }: { editor: Editor | null; disableImages?: boolean }) => {
  if (!editor) {
    return null;
  }

  const buttonClasses = (isActive: boolean) =>
    `p-2 rounded transition-colors ${
      isActive
        ? 'bg-gray-200 dark:bg-gray-700'
        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = (folderName?: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const uploads = Array.from(files).map(async (file) => {
          const sanitizedFolderName = folderName ? folderName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'content';
          const pathname = `media/images/${sanitizedFolderName}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

          try {
            const blob = await upload(pathname, file, {
              access: 'public',
              handleUploadUrl: '/api/v1/creator/upload',
            });
            return { url: blob.url, name: file.name };
          } catch (error) {
            console.error('Error uploading image:', file.name, error);
            return null;
          }
        });

        const results = await Promise.all(uploads);
        results.forEach((result) => {
          if (result) {
            editor.chain().focus().setImage({ src: result.url, alt: result.name }).run();
          }
        });
      }
    };
    input.click();
  };

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

      <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      {/* Alignment */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={buttonClasses(editor.isActive({ textAlign: 'left' }))} title="Align Left">
        <AlignLeft size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={buttonClasses(editor.isActive({ textAlign: 'center' }))} title="Align Center">
        <AlignCenter size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={buttonClasses(editor.isActive({ textAlign: 'right' }))} title="Align Right">
        <AlignRight size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={buttonClasses(editor.isActive({ textAlign: 'justify' }))} title="Justify">
        <AlignJustify size={16} />
      </button>

      <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      {/* Lists & Indentation */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClasses(editor.isActive('bulletList'))} title="Bullet List">
        <List size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClasses(editor.isActive('orderedList'))} title="Ordered List">
        <ListOrdered size={16} />
      </button>
      <button type="button" onClick={() => {
        if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
          editor.chain().focus().sinkListItem('listItem').run();
        } else {
          editor.chain().focus().indent().run();
        }
      }} className="p-2 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50" title="Indent">
        <IndentIcon size={16} />
      </button>
      <button type="button" onClick={() => {
        if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
          editor.chain().focus().liftListItem('listItem').run();
        } else {
          editor.chain().focus().outdent().run();
        }
      }} className="p-2 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50" title="Outdent">
        <Outdent size={16} />
      </button>

      <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      {/* Links */}
      <button type="button" onClick={setLink} className={buttonClasses(editor.isActive('link'))} title="Set Link">
        <LinkIcon size={16} />
      </button>
      <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} className="p-2 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50" title="Unlink">
        <Unlink size={16} />
      </button>

      <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      {/* Images */}
      {!disableImages && (
        <button type="button" onClick={() => addImage(editor.storage.folderName)} className={buttonClasses(false)} title="Add Image">
          <ImageIcon size={16} />
        </button>
      )}
    </div>
  );
};

const ImageNodeView = ({ node, updateAttributes, selected }: any) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const imageElement = (e.target as HTMLElement).parentElement?.querySelector('img');
    const startWidth = imageElement?.offsetWidth || 0;

    const onMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const diffX = currentX - startX;
      const newWidth = Math.max(50, startWidth + diffX);
      updateAttributes({ width: `${newWidth}px` });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const textAlign = node.attrs.textAlign || 'left';
  const justifyContent = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start';

  return (
    <NodeViewWrapper className="my-4 flex" style={{ justifyContent }}>
      <div className="relative group">
        <img
          src={node.attrs.src}
          alt={node.attrs.alt}
          className={`rounded-lg transition-all ${selected || isResizing ? 'ring-2 ring-primary' : ''}`}
          style={{
            width: node.attrs.width || 'auto',
            height: 'auto',
            maxWidth: '100%',
            display: 'block',
          }}
        />
        {(selected || isResizing) && (
          <div
            className="absolute bottom-2 right-2 w-3 h-3 bg-primary border-2 border-white rounded-full cursor-nwse-resize shadow-sm z-10"
            onMouseDown={handleMouseDown}
          />
        )}
      </div>
    </NodeViewWrapper>
  );
};

const Indent = Extension.create({
  name: 'indent',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      indentLevels: [0, 30, 60, 90, 120, 150, 180, 210],
      defaultIndentLevel: 0,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: this.options.defaultIndentLevel,
            renderHTML: (attributes) => {
              if (!attributes.indent || attributes.indent === 0) {
                return {};
              }
              return {
                style: `margin-left: ${attributes.indent}px`,
              };
            },
            parseHTML: (element) => {
              const marginLeft = element.style.marginLeft;
              return marginLeft ? parseInt(marginLeft, 10) : this.options.defaultIndentLevel;
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      indent: () => ({ tr, state, dispatch }) => {
        const { selection } = state;
        tr = tr.setSelection(selection);
        
        tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            const currentIndent = node.attrs.indent || 0;
            const indentLevels = this.options.indentLevels;
            const currentIndex = indentLevels.indexOf(currentIndent);
            if (currentIndex < indentLevels.length - 1) {
               const nextIndent = indentLevels[currentIndex + 1];
               tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                indent: nextIndent,
              });
            }
          }
        });

        if (dispatch) {
          dispatch(tr);
        }
        return true;
      },
      outdent: () => ({ tr, state, dispatch }) => {
        const { selection } = state;
        tr = tr.setSelection(selection);

        tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            const currentIndent = node.attrs.indent || 0;
            const indentLevels = this.options.indentLevels;
            const currentIndex = indentLevels.indexOf(currentIndent);
            if (currentIndex > 0) {
              const prevIndent = indentLevels[currentIndex - 1];
              tr = tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                indent: prevIndent,
              });
            }
          }
        });

        if (dispatch) {
          dispatch(tr);
        }
        return true;
      },
    };
  },
  
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        if (this.editor.isActive('bulletList') || this.editor.isActive('orderedList')) {
          return false;
        }
        return this.editor.commands.indent();
      },
      'Shift-Tab': () => {
        if (this.editor.isActive('bulletList') || this.editor.isActive('orderedList')) {
          return false;
        }
        return this.editor.commands.outdent();
      },
    };
  },
});

const CustomImage = TiptapImage.extend({
  group: 'block',
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {};
          }
          return {
            style: `width: ${attributes.width}`,
          };
        },
        parseHTML: (element) => {
          return element.style.width;
        },
      },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    const textAlign = node.attrs.textAlign;
    let className = 'rounded-lg my-4 max-w-full h-auto';

    if (textAlign === 'center') {
      className += ' mx-auto block';
    } else if (textAlign === 'right') {
      className += ' ml-auto block';
    } else {
      className += ' block';
    }

    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { class: className })];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

const RichTextEditor = ({ value, onChange, folderName, disableImages }: RichTextEditorProps) => {
  // Force re-render on editor updates to ensure toolbar state is current
  const [, forceUpdate] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-6 my-2',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-6 my-2',
          },
        },
        blockquote: false,
        codeBlock: false,
      }),
      TextStyle,
      FontFamily,
      FontSize,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer',
        },
      }),
      Indent,
      CustomImage,
    ],
    content: '', // Start with empty content on the server
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onTransaction: () => {
      forceUpdate((n) => n + 1);
    },
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none p-4 min-h-[250px] focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  if (editor) {
    editor.storage.folderName = folderName;
  }

  // Set content on the client side to avoid SSR hydration errors
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // The `emitUpdate` flag should be part of the options object.
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div className="rounded-lg border" style={{ backgroundColor: 'var(--color-input)', borderColor: 'var(--color-inputBorder)' }}>
      <Toolbar editor={editor} disableImages={disableImages} />
      <EditorContent editor={editor} style={{ color: 'var(--color-textPrimary)' }} />
    </div>
  );
};

export default RichTextEditor;