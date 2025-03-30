import { TbInputCheck } from "react-icons/tb";
import { BiSolidDiscount } from "react-icons/bi";
import { FaMedapps } from "react-icons/fa";


type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  selectedSection: "sales" | "promos";
  setSelectedSection: (value: "sales" | "promos") => void;
  filteredCount: number;
};

export default function SearchBar({
  value,
  onChange,
  selectedSection,
  setSelectedSection,
  filteredCount,
}: SearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center md:justify-between mb-6">
      {/* Поле поиска */}
      <div className="relative w-full md:w-2/3">
        <FaMedapps className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 transition-all hover:text-yellow-500" />
        <input
          type="text"
          placeholder="Что бы найти..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 p-3 border border-gray-400 rounded-lg shadow-lg text-gray-900 h-12 hover:border-blue-500 transition-all"
        />
        {/* Статистика справа */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600 select-none">
        найдено: <strong>{filteredCount}</strong>
        </div>
      </div>

      {/* Слайдер-переключатель (Акции | Промокоды) */}
      <div className="w-full md:w-1/3 flex items-center justify-between bg-gray-100 p-1 rounded-lg shadow-lg border border-gray-400">
        <button
          className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-all ${
            selectedSection === "sales" ? "bg-blue-600 text-white shadow-md" : "text-gray-700"
          }`}
          onClick={() => setSelectedSection("sales")}
        >
          <BiSolidDiscount className="mr-2" />
          Льготы
        </button>
        <button
          className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-all ${
            selectedSection === "promos" ? "bg-blue-600 text-white shadow-md" : "text-gray-700"
          }`}
          onClick={() => setSelectedSection("promos")}
        >
          <TbInputCheck className="mr-2" />
          Промокоды
        </button>
      </div>
    </div>
  );
}
