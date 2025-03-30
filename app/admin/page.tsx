"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import AdminHeader from "../components/AdminHeader";
import AdminForm from "../components/AdminForm";
import AdminList from "../components/AdminList";
import Footer from "../components/Footer";
import { ChevronUp } from "lucide-react";
import { RiAddCircleLine } from "react-icons/ri";
import { Offer } from "../components/types";

export default function Admin() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [promo_categories, setPromoCategories] = useState<string[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  // Загружаем данные
  const fetchData = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session) {
      router.push("/login");
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("user_id", sessionData.session.user.id)
      .single();

    if (userError || userData?.role !== "admin") {
      router.push("/");
      return;
    }

    const { data: offersData, error: offersError } = await supabase.from("offers").select("*");
    if (offersError) {
      showToast("Ошибка загрузки данных", "error");
      return;
    }

    const processedOffers = offersData.map((offer) => ({
      ...offer,
      promocode: Array.isArray(offer.promocode)
        ? offer.promocode.map((promo: string) => (typeof promo === "string" ? JSON.parse(promo) : promo))
        : [],
    }));

    setOffers(processedOffers);

    // Собираем уникальные категории из предложений
    const uniqueCategories = Array.from(new Set(offersData.map((offer) => offer.category)));
    setCategories(uniqueCategories);

    const uniquePromoCategories = Array.from(new Set(offersData.map((offer) => offer.promo_category)));
    setPromoCategories(uniquePromoCategories);

    // Собираем уникальные города из предложений, исключая пустые строки
    const uniqueCities = Array.from(new Set(offersData.map((offer) => offer.city).filter(city => city !== "")));
    setCities(uniqueCities);

  };

  useEffect(() => {
    fetchData();

    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleEdit = (offer: Offer) => {
    setEditingOfferId(offer.id ?? null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("offers").delete().eq("id", id);
    if (error) {
      showToast("Ошибка при удалении", "error");
      return;
    }
    showToast("Предложение удалено!", "success");
    setOffers(offers.filter((offer) => offer.id !== id));
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingOfferId(null);
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
      <AdminHeader />

      {/* Уведомления (Toast) */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Основной контейнер, растягиваемый на всю высоту */}
      <main className="flex-grow flex flex-col items-center justify-between w-full">
        {/* Форма поверх всего контента */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
            <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
              <AdminForm
                key={editingOfferId || "new"}
                offer={offers.find((offer) => offer.id === editingOfferId) || null}
                categories={categories}
                promo_categories={promo_categories}
                cities={cities}
                onSubmit={async () => {
                  showToast(editingOfferId ? "Предложение обновлено!" : "Предложение добавлено!", "success");
                  setEditingOfferId(null);
                  setShowForm(false);
                  await fetchData();
                }}
                onClose={handleFormClose}
                onUpdate={fetchData}
              />
            </div>
          </div>
        )}

        {/* Контейнер списка предложений */}
        <div className="w-full max-w-7xl flex items-start flex-grow">
          <AdminList offers={offers} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </main>

      {/* Кнопка вверх */}
      {showScrollButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="z-20 fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Кнопка открытия формы */}
      <button
        onClick={() => setShowForm(true)}
        className="z-20 fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-teal-600 transition-all"
      >
        <RiAddCircleLine className="w-6 h-6" />
      </button>

      <Footer />
    </div>
  );
}