import { useEffect, useRef, useState } from "react";

interface EditableTextProps {
  /** Stable storage key so edits persist across reloads */
  storageKey: string;
  /** Initial text used only when nothing has been saved yet */
  defaultText?: string;
  placeholder?: string;
  className?: string;
  /** Accessible label for screen readers */
  label?: string;
}

/**
 * A contentEditable region whose text is persisted to localStorage,
 * letting the card owner personalize messages without touching code.
 */
export default function EditableText({
  storageKey,
  defaultText = "",
  placeholder = "Write your message here…",
  className = "",
  label = "Editable text",
}: EditableTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const saved = localStorage.getItem(storageKey);
    el.innerText = saved !== null ? saved : defaultText;
    // Only on mount: later external changes would clobber the caret.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = () => {
    const el = ref.current;
    if (!el) return;
    localStorage.setItem(storageKey, el.innerText);
  };

  return (
    <div
      ref={ref}
      role="textbox"
      tabIndex={0}
      aria-label={label}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      data-placeholder={placeholder}
      className={`editable transition-[box-shadow,background-color] duration-300 rounded-sm ${
        isFocused
          ? "bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.35)] px-3 py-2 -mx-3 -my-2"
          : "hover:bg-white/[0.03]"
      } ${className}`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        persist();
        setIsFocused(false);
      }}
      onKeyDown={(e) => {
        // Keep Enter as a line break rather than losing focus.
        if (e.key === "Enter" && !e.shiftKey) {
          e.stopPropagation();
        }
      }}
      onInput={persist}
    />
  );
}
