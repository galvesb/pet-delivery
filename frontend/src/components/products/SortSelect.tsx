interface Props {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = [
  { value: "newest", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "name_asc", label: "Nome A-Z" },
];

export function SortSelect({ value, onChange }: Props) {
  return (
    <select
      className="sort-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
