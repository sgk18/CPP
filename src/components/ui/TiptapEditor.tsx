"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3,
  List, ListOrdered, Link2, Image as ImageIcon, Quote, Code,
  Table as TableIcon, Undo, Redo, Upload, Trash2, Plus, Loader2
} from "lucide-react";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {},
        orderedList: {},
        codeBlock: {
          HTMLAttributes: {
            class: "bg-gray-950 text-gray-100 p-4 rounded-xl font-mono text-sm my-4",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-[#2a9d8f] pl-4 italic text-white/70 my-4",
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#2a9d8f] hover:underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-2xl border border-white/10 my-6 mx-auto shadow-md",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "w-full border-collapse border border-white/10 my-4 text-sm text-left",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border-b border-white/5 hover:bg-white/[0.02] transition-colors",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-white/10 p-2.5 bg-white/[0.03] font-semibold text-white/90",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-white/10 p-2.5 text-white/70",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8 bg-white/[0.02] border border-white/10 rounded-2xl">
        <Loader2 className="animate-spin text-white/30" />
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertImageUrl = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.metadata) {
        editor.chain().focus().setImage({ src: data.metadata.url }).run();
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0d1f2d]/60 backdrop-blur">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white/[0.02] border-b border-white/10">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all ${editor.isActive("bold") ? "bg-white/10 text-white font-bold" : ""}`}
          title="Bold"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all ${editor.isActive("italic") ? "bg-white/10 text-white font-bold" : ""}`}
          title="Italic"
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all ${editor.isActive("underline") ? "bg-white/10 text-white font-bold" : ""}`}
          title="Underline"
        >
          <UnderlineIcon size={15} />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all ${editor.isActive("heading", { level: 1 }) ? "bg-white/10 text-white font-bold" : ""}`}
          title="Heading 1"
        >
          <Heading1 size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all ${editor.isActive("heading", { level: 2 }) ? "bg-white/10 text-white font-bold" : ""}`}
          title="Heading 2"
        >
          <Heading2 size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all ${editor.isActive("heading", { level: 3 }) ? "bg-white/10 text-white font-bold" : ""}`}
          title="Heading 3"
        >
          <Heading3 size={15} />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all ${editor.isActive("bulletList") ? "bg-white/10 text-white" : ""}`}
          title="Unordered List"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all ${editor.isActive("orderedList") ? "bg-white/10 text-white" : ""}`}
          title="Ordered List"
        >
          <ListOrdered size={15} />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all ${editor.isActive("link") ? "bg-white/10 text-white" : ""}`}
          title="Link"
        >
          <Link2 size={15} />
        </button>

        {/* Image insertion controls */}
        <button
          type="button"
          onClick={insertImageUrl}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
          title="Insert Image by URL"
        >
          <ImageIcon size={15} />
        </button>
        
        <label className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center" title="Upload Local Image">
          {uploading ? (
            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Upload size={14} />
          )}
          <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" disabled={uploading} />
        </label>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all ${editor.isActive("blockquote") ? "bg-white/10 text-white" : ""}`}
          title="Blockquote"
        >
          <Quote size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all ${editor.isActive("codeBlock") ? "bg-white/10 text-white" : ""}`}
          title="Code Block"
        >
          <Code size={15} />
        </button>

        {/* Table insertion controls */}
        <div className="w-px h-5 bg-white/10 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
          title="Insert Table (3x3)"
        >
          <TableIcon size={15} />
        </button>

        {editor.isActive("table") && (
          <>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="p-2 rounded-lg text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
              title="Delete Table"
            >
              <Trash2 size={15} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="p-2 rounded-lg text-white/50 hover:text-white transition-all flex items-center gap-0.5 text-[10px]"
              title="Add Column"
            >
              <Plus size={10} />Col
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="p-2 rounded-lg text-white/50 hover:text-white transition-all flex items-center gap-0.5 text-[10px]"
              title="Add Row"
            >
              <Plus size={10} />Row
            </button>
          </>
        )}

        <div className="flex-grow" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
          title="Undo"
        >
          <Undo size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30"
          title="Redo"
        >
          <Redo size={15} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 min-h-[300px] text-white/80 outline-none prose max-w-none prose-invert focus:outline-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
