import { useState, type KeyboardEvent } from "react";

interface TagListInputProps {
  id: string;
  label: string;
  values: string[];
  onChange: (nextValues: string[]) => void;
  placeholder?: string;
}

const normalizeValue = (value: string) => value.trim();

export const TagListInput = ({
  id,
  label,
  values,
  onChange,
  placeholder,
}: TagListInputProps) => {
  const [draftValue, setDraftValue] = useState("");

  const addValue = (rawValue: string) => {
    const nextValue = normalizeValue(rawValue);

    if (!nextValue || values.includes(nextValue)) {
      return;
    }

    onChange([...values, nextValue]);
    setDraftValue("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addValue(draftValue);
    }

    if (event.key === "Backspace" && !draftValue && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const removeValue = (valueToRemove: string) => {
    onChange(values.filter((value) => value !== valueToRemove));
  };

  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>

      <div className="field flex min-h-[3.25rem] flex-wrap items-center gap-2 px-3 py-2">
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-100"
          >
            <span>{value}</span>
            <button
              type="button"
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs text-orange-500 transition hover:bg-orange-100 hover:text-orange-700 dark:hover:bg-orange-500/20 dark:hover:text-orange-100"
              onClick={() => removeValue(value)}
              aria-label={`Eliminar ${value}`}
            >
              x
            </button>
          </span>
        ))}

        <input
          id={id}
          className="min-w-[10rem] flex-1 border-0 bg-transparent px-1 py-1 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          value={draftValue}
          onChange={(event) => setDraftValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addValue(draftValue)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};