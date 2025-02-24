import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  selectedCategory,
  setSelectedCategory,
  totalOffers,
  filteredCount,
}: {
  value: string;
  onChange: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  totalOffers: number;
  filteredCount: number;
}) {
  const categories = [
    { label: "Все категории", value: "" },
    { label: "Промокоды", value: "promos" },
    { label: "Скидки", value: "discounts" },
    { label: "Музеи", value: "museums" },
    { label: "Театры", value: "theaters" },
    { label: "Кино", value: "cinema" },
    { label: "Транспорт", value: "transport" },
    { label: "Продукты", value: "groceries" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-2 items-center md:justify-between mb-6">
      {/* Поле поиска с иконкой */}
      <div className="relative w-full md:w-2/3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Найти предложения..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 p-2 border border-gray-400 rounded-lg shadow-sm text-gray-900 focus:ring focus:ring-blue-200 h-11"
        />
        {/* Статистика справа */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600">
          <strong>{filteredCount}</strong> из {totalOffers}
        </div>
      </div>

      {/* Выпадающий список категорий */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full md:w-1/3 p-2 border border-gray-400 rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-100 transition-all text-gray-900 h-11"
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  );
}
