import { useState } from "react";
import { FaCheckSquare, FaCopy, FaRegHeart, FaHeart, FaSearch } from "react-icons/fa";
import { WiTime7 } from "react-icons/wi";
import { LuTags } from "react-icons/lu";
import Cookies from "js-cookie";

interface Promocode {
  code: string;
  expires: string;
  info: string;
}

interface OfferCardProps {
  id: string;
  title: string;
  description: string;
  promocode?: Promocode[];
  expires: string;
  link: string;
  isExpanded: boolean;
  setExpandedId: (id: string | null) => void;
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
}

export default function OfferCard({
  id,
  title,
  description,
  promocode = [],
  expires,
  link,
  isExpanded,
  setExpandedId,
  favorites,
  setFavorites,
}: OfferCardProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isHourglassClicked, setIsHourglassClicked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 300);
  };

  // 📌 Разрешаем раскрывать только 1 карточку
  const toggleCardExpand = () => {
    setExpandedId(isExpanded ? null : id); // ✅ Если карточка открыта — закрываем, иначе открываем
  };

  const handleLike = () => {
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];

    setFavorites(updatedFavorites);
    Cookies.set("favorites", JSON.stringify(updatedFavorites), { expires: 365 }); // Храним лайки 1 год
  };

  const filteredPromocodes = promocode.filter((promo) =>
    promo.info.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="bg-white shadow-lg hover:border-blue-500 rounded-xl p-4 border border-gray-200 transition-all transform hover:shadow-lg flex flex-col justify-between relative min-h-[160px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className={`text-lg font-semibold text-gray-800 truncate max-w-[calc(100%-4rem)]`}>
          <a href={link} target="_blank" className="hover:underline">
            {title}
          </a>
        </h2>

        {/* Иконки в правом верхнем углу */}
        <div className="absolute top-3 right-3 flex gap-2">
          {/* Сердечко (лайк) */}
          <button onClick={handleLike} className="flex justify-center items-center w-8 h-8 rounded-full">
            {favorites.includes(id) ? (
              <FaHeart className="text-red-500 text-lg" />
            ) : (
              <FaRegHeart className="text-gray-500 text-lg" />
            )}
          </button>

          {/* 🕒 Часы (показываются, если есть срок действия) */}
          {expires && (
            <div className="relative text-xl text-gray-600 hover:text-gray-800 cursor-pointer">
              <div
                className="flex justify-center items-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-teal-400 shadow-md"
                onClick={() => setIsHourglassClicked(!isHourglassClicked)}
              >
                <WiTime7 className="text-white text-2xl" />
              </div>
            </div>
          )}

          {/* 🔥 Огонек (если есть промокоды) */}
          {promocode.length > 0 && (
            <div className="relative text-xl text-gray-600 hover:text-gray-800 cursor-pointer">
              <div
                className="flex justify-center items-center w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-md"
                onClick={toggleCardExpand}
              >
                <LuTags className="text-white text-2xl" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Контент карточки */}
      {isExpanded ? (
        <div className="mt-3 max-h-60 overflow-y-auto w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          {/* 🔎 Поле поиска промокодов */}
          <div className="p-2 border-b border-gray-200 flex items-center gap-2">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Поиск промокода..."
              className="w-full text-sm border-none text-gray-800 focus:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ul>
            {filteredPromocodes.length > 0 ? (
              filteredPromocodes.map((promo, index) => (
                <li
                  key={index}
                  className="p-3 flex flex-col items-start gap-2 cursor-pointer hover:bg-gray-100 transition-all rounded-lg"
                  onClick={() => handleCopy(promo.code)}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-white font-semibold px-3 py-1 rounded text-sm shadow-md bg-gradient-to-b from-red-500 to-orange-500">
                      {promo.code}
                    </span>

                    <div className="flex items-center gap-3">
                      {copiedCode === promo.code ? (
                        <FaCheckSquare className="text-green-500 text-lg" />
                      ) : (
                        <FaCopy className="text-gray-500 hover:text-gray-700 transition-all text-lg" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">До {promo.expires}: {promo.info}</p>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500 py-3">Промокоды не найдены</p>
            )}
          </ul>
        </div>
      ) : (
        <p className="text-gray-600 text-sm mt-2 flex-grow">
          {truncateDescription(description, 100)}
        </p>
      )}

      {/* Всплывающее окно со сроком действия */}
      {isHourglassClicked && (
        <div className="mt-3 max-h-60 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-600">{expires}</p>
        </div>
      )}
    </div>
  );
}