"use client";
import { useState, useEffect } from "react";
import OfferList from "./components/OfferList";
import SearchBar from "./components/SearchBar";
import { ChevronUp } from "lucide-react";
import Footer from "./components/Footer";

export default function Home() {
  interface Offer {
    title: string;
    description: string;
    category: string[];
  }

  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    fetch("/offers.json")
      .then((res) => res.json())
      .then((data) => setOffers(data))
      .catch((error) => console.error("Ошибка загрузки JSON:", error));

    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      searchQuery === "" ||
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase());
  
    const matchesCategory =
      selectedCategory === "" || offer.category.includes(selectedCategory);
  
    return matchesSearch && matchesCategory;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="w-full max-w-7xl mx-auto bg-white shadow-xl rounded-lg p-6 flex-1">
        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
          <img src="/favicon.ico" alt="Иконка" className="w-8 h-8" />
          Лучшие предложения для студентов
        </h1>

        {/* Поиск + Категории в 1 строке */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            totalOffers={offers.length}
            filteredCount={filteredOffers.length}
          />
        </div>

        {/* Строка с напоминанием */}
        <div className="flex flex-col md:flex-row md:justify-between mb-6 items-center bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-2 rounded-lg shadow-sm text-sm">
          <p className="font-medium">
            🎓 Не забывайте носить с собой студенческий билет!
          </p>
        </div>

        <OfferList offers={filteredOffers} />
      </div>

      {/* Кнопка вверх */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      <Footer />
    </div>
  );
}

