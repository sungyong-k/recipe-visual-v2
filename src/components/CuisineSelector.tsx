"use client";

const CUISINES = [
  { value: "", label: "Any Style" },
  { value: "Korean", label: "Korean" },
  { value: "Italian", label: "Italian" },
  { value: "Japanese", label: "Japanese" },
  { value: "Mexican", label: "Mexican" },
  { value: "Chinese", label: "Chinese" },
  { value: "Indian", label: "Indian" },
  { value: "French", label: "French" },
  { value: "Mediterranean", label: "Mediterranean" },
];

interface Props {
  value: string;
  onChange: (cuisine: string) => void;
}

export default function CuisineSelector({ value, onChange }: Props) {
  return (
    <div>
      <label
        htmlFor="cuisine-select"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Cuisine Style (optional)
      </label>
      <select
        id="cuisine-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
        data-testid="cuisine-select"
      >
        {CUISINES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}
