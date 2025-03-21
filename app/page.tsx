"use client";
import { useState, useEffect, JSX } from "react";
import { supabase } from "@/utils/supabase";
import OfferList from "./components/OfferList";
import SearchBar from "./components/SearchBar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ChevronUp, Menu, X } from "lucide-react";
import {
  FaTag, FaUniversity, FaTheaterMasks, FaFilm, FaBus, FaShoppingCart, FaBook, FaBriefcase, FaEllipsisH,
} from "react-icons/fa";

// ✅ Категории + Иконки
const CATEGORY_ICONS: Record<string, JSX.Element> = {
  "Промокоды": <FaTag />,
  "Музеи": <FaUniversity />,
  "Театры": <FaTheaterMasks />,
  "Кино": <FaFilm />,
  "Транспорт": <FaBus />,
  "Продукты": <FaShoppingCart />,
  "Образование": <FaBook />,
  "Карточки": <FaBriefcase />,
  "Другое": <FaEllipsisH />,
};

export default function Home() {
  interface Promocode {
    code: string;
    info: string;
    expires: string;
  }

  interface Offer {
    id: string;
    title: string;
    description: string;
    category: string;
    city?: string;
    promocode?: Promocode[];
    expires: string;
    link: string;
  }

  const [offers, setOffers] = useState<Offer[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<"sales" | "promos">("sales");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Санкт-Петербург");
  const [isFavoritesOnly, setIsFavoritesOnly] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchOffers();
    fetchFavorites();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.from("offers").select("*");

    if (error) {
      console.error("Ошибка загрузки данных из Supabase:", error.message);
      setError("Ошибка загрузки данных. Попробуйте позже.");
    } else {
      setOffers(data || []);
    }

    setLoading(false);
  };

  const fetchFavorites = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (userId) {
      const { data, error } = await supabase
        .from("users")
        .select("favorites")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Ошибка загрузки избранного из Supabase:", error.message);
      } else {
        setFavorites(data?.favorites || []);
      }
    }
  };

  const processOffers = (offers: Offer[]) => {
    return offers.map((offer) => ({
      ...offer,
      promocode: Array.isArray(offer.promocode)
        ? offer.promocode.map((promo) => ({
            code: promo.code || "", // Обеспечиваем, что все данные присутствуют
            info: promo.info || "",
            expires: promo.expires || "",
        }))
        : [], // Если promocode не массив, заменяем на пустой массив
    }));
  };

  // ✅ Фильтрация по городу
  const filteredByCity = processOffers(offers).filter(
    (offer) => !offer.city || offer.city === selectedCity
  );

  // ✅ Фильтрация по избранному
  const filteredByFavorites = isFavoritesOnly
    ? filteredByCity.filter((offer) => favorites.includes(offer.id))
    : filteredByCity;

  // ✅ Фильтрация по поисковому запросу
  const filteredOffers = filteredByFavorites.filter(
    (offer) =>
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Отделяем промокоды от акций
  const promos = filteredOffers.filter((offer) => offer.category === "Промокоды");
  const sales = filteredOffers.filter((offer) => offer.category !== "Промокоды");

  // ✅ Группируем акции по категориям
  const groupedSales = sales.reduce((acc, offer) => {
    if (!acc[offer.category]) acc[offer.category] = [];
    acc[offer.category].push(offer);
    return acc;
  }, {} as Record<string, Offer[]>);

  const sortedCategories = Object.keys(groupedSales).sort();

  // ✅ Группируем промокоды по первой букве или цифре
  const groupedPromos = promos.reduce((acc, offer) => {
    const firstChar = offer.title.charAt(0).toUpperCase();
    const category = /[0-9]/.test(firstChar) ? "0-9" : firstChar;
    if (!acc[category]) acc[category] = [];
    acc[category].push(offer);
    return acc;
  }, {} as Record<string, Offer[]>);

  const sortedPromoCategories = Object.keys(groupedPromos).sort();

  // ✅ Уникальные города для фильтра
  const uniqueCities = [...new Set(offers.map((offer) => offer.city).filter((city): city is string => Boolean(city)))];

  const scrollToCategory = (category: string) => {
    const element = document.querySelector(`[data-category="${category}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false); // Закрываем меню после перехода
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-6">
      <Header
        cities={uniqueCities}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        isFavoritesOnly={isFavoritesOnly}
        setIsFavoritesOnly={setIsFavoritesOnly}
      />

      {/* 🔥 Кнопка открытия меню */}
      <div className="fixed right-4 top-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 🔥 Боковое меню категорий */}
      <aside
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl p-6 w-64 z-50 transform transition-transform duration-300 overflow-y-auto ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 🔘 Кнопка закрытия (внутри меню) */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition-all"
        >
          <X size={26} />
        </button>

        {/* Заголовок с градиентом */}
        <h3 className="text-lg font-bold mt-6 mb-4 text-white p-3 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-purple-500 text-center">
          Категории
        </h3>

        {/* 🔥 Список категорий */}
        {selectedSection === "sales" ? (
          // Обычный список акций
          <ul className="space-y-1 divide-y divide-gray-200">
            {sortedCategories.map((category) => (
              <li key={category} className="pt-2 first:pt-0">
                <button
                  onClick={() => {
                    scrollToCategory(category);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center w-full p-3 text-gray-700 hover:bg-gradient-to-r from-blue-500 to-purple-500 hover:text-white rounded-lg shadow-sm"
                >
                  {CATEGORY_ICONS[category] || CATEGORY_ICONS["Другое"]}
                  <span className="ml-3 font-medium">{category}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          // ✅ Сетка из 3 колонок только для промокодов
          <div className="grid grid-cols-3 gap-2">
            {sortedPromoCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  scrollToCategory(category);
                  setIsMenuOpen(false);
                }}
                className="flex flex-col items-center p-2 text-gray-700 hover:bg-gradient-to-r from-blue-500 to-purple-500 hover:text-white rounded-lg shadow-sm text-sm"
              >
                <span className="mt-1">{category}</span>
              </button>
            ))}
          </div>
        )}
      </aside>

      <div className="w-full max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-6 flex-1">
        {/* Поиск + Переключатель */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            filteredCount={selectedSection === "promos" ? promos.length : sales.length}
          />
        </div>

        {/* Ошибка при загрузке данных */}
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">❌ {error}</div>}

        {loading ? (
          <div className="text-center text-gray-500">Загрузка...</div>
        ) : selectedSection === "promos" ? (
          sortedPromoCategories.map((category) => (
            <div key={category} className="category-section mb-10" data-category={category}>
              <h2 className="text-xl font-semibold text-gray-800 bg-gradient-to-r from-[#ff6f00ad] to-[#FFCC00] p-4 rounded-lg flex items-center gap-2 shadow-sm">
                {CATEGORY_ICONS["Промокоды"]}
                {category}
              </h2>

              <div className="mt-4 p-5 bg-white rounded-lg shadow-md border border-gray-200">
                <OfferList offers={groupedPromos[category]} />
              </div>
            </div>
          ))
        ) : (
          sortedCategories
            .filter((category) => groupedSales[category] && groupedSales[category].length > 0)
            .map((category) => (
              <div key={category} className="category-section mb-10" data-category={category}>
                <h2 className="text-xl font-semibold text-gray-800 bg-gradient-to-r from-[#ff6f00ad] to-[#FFCC00] p-4 rounded-lg flex items-center gap-2 shadow-sm">
                  {CATEGORY_ICONS[category] || CATEGORY_ICONS["Другое"]}
                  {category}
                </h2>

                <div className="mt-4 p-5 bg-white rounded-lg shadow-md border border-gray-200">
                  <OfferList offers={groupedSales[category]} />
                </div>
              </div>
            ))
        )}
      </div>

      {/* Кнопка вверх */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="z-50 fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      <Footer />
    </div>
  );
}