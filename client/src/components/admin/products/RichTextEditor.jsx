import { useEffect, useRef, useState } from "react";

const TOOLBAR_ACTIONS = [
  { icon: "B", command: "bold", title: "Bold", className: "font-semibold" },
  { icon: "I", command: "italic", title: "Italic", className: "italic" },
  {
    icon: "U",
    command: "underline",
    title: "Underline",
    className: "underline",
  },
  { icon: "•", command: "insertUnorderedList", title: "Bullet list" },
  { icon: "1.", command: "insertOrderedList", title: "Numbered list" },
];

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Describe the product…",
}) => {
  const editorRef = useRef(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (
      !preview &&
      editorRef.current &&
      editorRef.current.innerHTML !== value
    ) {
      editorRef.current.innerHTML = value;
    }
  }, [preview, value]);

  const handleExec = (command) => {
    document.execCommand(command, false, undefined);
    editorRef.current?.focus();
  };

  const handleInput = (event) => {
    onChange?.(event.currentTarget.innerHTML);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-neutralc-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20">
      <div className="flex items-center justify-between gap-2 border-b border-neutralc-200 bg-neutralc-100 px-3 py-2">
        <div className="flex items-center gap-1">
          {TOOLBAR_ACTIONS.map((tool) => (
            <button
              key={tool.command}
              type="button"
              onClick={() => handleExec(tool.command)}
              className={`rounded-lg px-3 py-1 text-sm text-neutralc-600 transition hover:bg-neutralc-200 ${
                tool.className ?? ""
              }`}
              title={tool.title}
            >
              {tool.icon}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPreview((prev) => !prev)}
          className={`rounded-lg px-3 py-1 text-xs font-medium transition ${
            preview
              ? "bg-primary-100 text-primary-700"
              : "text-neutralc-600 hover:bg-neutralc-200"
          }`}
        >
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      {preview ? (
        <div className="prose prose-sm max-w-none px-4 py-3 text-sm text-neutralc-600">
          {value ? (
            <div dangerouslySetInnerHTML={{ __html: value }} />
          ) : (
            <p className="italic text-neutralc-400">No description yet.</p>
          )}
        </div>
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onPaste={handlePaste}
          className="min-h-[140px] px-4 py-3 text-sm text-neutralc-600 outline-none [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-neutralc-400 [&:empty]:before:italic"
          data-placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
