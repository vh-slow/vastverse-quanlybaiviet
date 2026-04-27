import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 text-gray-600 rounded-t-xl">
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
                <span className="font-bold">H2</span>
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
                <span className="font-semibold">H3</span>
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
                <i className="fa-solid fa-bold"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
                <i className="fa-solid fa-italic"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${editor.isActive('strike') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
                <i className="fa-solid fa-strikethrough"></i>
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
                <i className="fa-solid fa-list-ul"></i>
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
                <i className="fa-solid fa-list-ol"></i>
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
                <i className="fa-solid fa-quote-left"></i>
            </button>
        </div>
    );
};

export default function RichTextEditor({
    content,
    onChange,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-lg prose-blue max-w-none prose-p:my-2 focus:outline-none min-h-[500px] p-6',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="flex flex-col flex-1 border border-gray-200 rounded-xl mt-4">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="cursor-text" />
        </div>
    );
}
