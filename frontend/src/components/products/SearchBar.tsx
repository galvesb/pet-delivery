import { useEffect, useRef, useState } from "react";

interface Props {
  onSearch: (term: string) => void;
}

export function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value.trim());
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [value, onSearch]);

  return (
    <div className="search-bar">
      <span className="search-bar-icon">&#128269;</span>
      <input
        type="text"
        placeholder="Buscar produtos..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
