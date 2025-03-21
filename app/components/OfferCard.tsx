import { useState, useEffect } from "react";
import { FaCheckSquare, FaCopy, FaRegHeart, FaHeart, FaSearch } from "react-icons/fa";
import { WiTime7 } from "react-icons/wi";
import { LuTags } from "react-icons/lu";
import { supabase } from "@/utils/supabase"; // Подключаем Supabase для проверки сессии
import { useRouter } from "next/navigation"; // Подключаем useRouter для перенаправления

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
}: OfferCardProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isHourglassClicked, setIsHourglassClicked] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    checkUser();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const { data: userData } = await supabase
          .from("users")
          .select("favorites")
          .eq("user_id", userId)
          .single();

        if (userData?.favorites) {
          setFavorites(userData.favorites);
        }
      }
    };
    fetchUser();
  }, [userId]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 300);
  };

  // 📌 Разрешаем раскрывать только 1 карточку
  const toggleCardExpand = () => {
    setExpandedId(isExpanded ? null : id); // ✅ Если карточка открыта — закрываем, иначе открываем
  };

  const handleLike = async () => {
    if (!userId) {
      router.push("/login"); // Перенаправляем на страницу логина
      return;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("favorites")
      .eq("user_id", userId)
      .single();

    const currentFavorites = userData?.favorites || [];
    const updatedFavorites = currentFavorites.includes(id)
      ? currentFavorites.filter((fav: string) => fav !== id) // Удаляем из избранного
      : [...currentFavorites, id]; // Добавляем в избранное

    setFavorites(updatedFavorites);

    // Обновляем массив лайков в Supabase
    const { error: updateError } = await supabase
      .from("users")
      .update({ favorites: updatedFavorites })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Ошибка при обновлении данных пользователя:", updateError);
    }
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