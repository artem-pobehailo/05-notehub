import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (newValue: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
