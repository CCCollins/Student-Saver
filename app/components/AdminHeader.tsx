"use client";
import { useState } from "react";
import { BiHomeAlt2 } from "react-icons/bi"; // Домик
import { FaDownload, FaUpload, FaSyncAlt, FaTrashAlt } from "react-icons/fa"; // Экспорт, Импорт, Очистка
import Link from "next/link";
import { supabase } from "@/utils/supabase";

const AdminHeader = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [isDeletingExpired, setIsDeletingExpired] = useState(false);

  // ✅ Экспорт данных в JSON
  const handleExport = async () => {
    setIsExporting(true);
    const { data, error } = await supabase.from("offers").select("*");

    if (error) {
      console.error("Ошибка экспорта:", error.message);
      setIsExporting(false);
      return;
    }

    // 🔄 Переупорядочиваем JSON
    const orderedData = data.map((offer) => ({
      title: offer.title,
      description: offer.description,
      link: offer.link,
      city: offer.city,
      category: offer.category,
      promocode: offer.promocode || [],
      expires: offer.expires || "",
    }));

    const jsonData = JSON.stringify(orderedData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // 📱 Для мобильных
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Offers Export",
          text: "Экспорт данных",
          url,
        });
      } catch (error) {
        console.error("Ошибка Share API:", error);
      }
    } else {
      // 💾 Скачивание JSON-файла
      const a = document.createElement("a");
      a.href = url;
      a.download = "offers.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    URL.revokeObjectURL(url);
    setTimeout(() => setIsExporting(false), 500);
  };

  // ✅ Загрузка JSON-файла
  const handleImport = async (replace = false) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
  
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
  
      setIsImporting(true);
      const reader = new FileReader();
  
      reader.onload = async (event) => {
        try {
          let jsonData = JSON.parse(event.target?.result as string);
  
          if (!Array.isArray(jsonData)) {
            alert("Ошибка: JSON должен содержать массив объектов.");
            return;
          }
  
          jsonData = jsonData.map(({ promocode, ...rest }) => ({
            promocode: Array.isArray(promocode) ? promocode : [],
            ...rest,
          }));
  
          if (replace) {
            setIsReplacing(true);
            const { error: deleteError } = await supabase.rpc("truncate_offers");
            if (deleteError) throw deleteError;
  
            const { error: clearFavoritesError } = await supabase.rpc("clear_favorites");
            if (clearFavoritesError) throw clearFavoritesError;
          }
  
          // 🔄 Получаем существующие записи из Supabase
          const { data: existingData, error: fetchError } = await supabase
            .from("offers")
            .select("id, link, promocode");
  
          if (fetchError) throw fetchError;
  
          const existingMap = new Map(
            existingData.map((entry) => [entry.link, { id: entry.id, promocode: entry.promocode }])
          );
  
          // 🔄 Обновляем или создаем новые записи
          const updates = [];
          const newEntries = [];
          let updatedCount = 0;
          let addedCount = 0;
  
          for (const entry of jsonData) {
            const existingEntry = existingMap.get(entry.link);
  
            if (existingEntry) {
              // 🔄 Обновляем промокоды, объединяя их
              const newPromocodes = entry.promocode.filter(
                (p: { code: string }) => !existingEntry.promocode.some((ep: { code: string }) => ep.code === p.code)
              );
  
              if (newPromocodes.length > 0) {
                updates.push({
                  id: existingEntry.id,
                  promocode: [...existingEntry.promocode, ...newPromocodes],
                });
                updatedCount++;
              }
            } else {
              // 🆕 Добавляем новую запись
              newEntries.push(entry);
              addedCount++;
            }
          }
  
          // 🔄 Обновляем существующие записи
          for (const update of updates) {
            const { error: updateError } = await supabase
              .from("offers")
              .update({ promocode: update.promocode })
              .eq("id", update.id);
  
            if (updateError) throw updateError;
          }
  
          // 🆕 Добавляем новые записи
          if (newEntries.length > 0) {
            const { error: insertError } = await supabase.from("offers").insert(newEntries);
            if (insertError) throw insertError;
          }
  
          alert(
            `✅ Импорт завершен!\n🔄 Обновлено записей: ${updatedCount}\n🆕 Добавлено новых записей: ${addedCount}`
          );
        } catch (err) {
          console.error("Ошибка импорта:", JSON.stringify(err, null, 2));
          alert("Ошибка при загрузке JSON.");
        } finally {
          setIsImporting(false);
          setIsReplacing(false);
        }
      };
  
      reader.readAsText(file);
    };
    input.click();
  };

  // ✅ Удаление истекших промокодов
  const handleDeleteExpiredPromocodes = async () => {
    setIsDeletingExpired(true);
    try {
      const { data, error } = await supabase.from("offers").select("*");
      if (error) throw error;
  
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1); // Устанавливаем вчерашнюю дату
  
      let deletedCount = 0;
      const updatedOffers = data.map((offer) => {
        if (offer.promocode) {
          const initialLength = offer.promocode.length;
          offer.promocode = offer.promocode.filter((promo: { expires: string }) => {
            const [day, month, year] = promo.expires.split(".");
            const promoDate = new Date(`20${year}-${month}-${day}`);
            return promoDate > yesterday; // Сравниваем с вчерашней датой
          });
          deletedCount += initialLength - offer.promocode.length;
        }
        return offer;
      });
  
      const { error: updateError } = await supabase.from("offers").upsert(updatedOffers);
      if (updateError) throw updateError;
  
      alert(`Удалено промокодов: ${deletedCount}`);
    } catch (err) {
      console.error("Ошибка при удалении истекших промокодов:", err);
      alert("Ошибка при удалении истекших промокодов.");
    } finally {
      setIsDeletingExpired(false);
    }
  };

  return (
    <header className="w-full flex justify-center">
      <div className="w-full max-w-7xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
        
        {/* 🔹 Левая часть (Домой + Заголовок) */}
        <div className="flex items-center gap-4">
          <Link href="/" title="На главную">
            <BiHomeAlt2 size={42} className="text-white cursor-pointer hover:scale-110 transition-all" />
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center sm:text-left tracking-wide">
            Секретная админ-панель
          </h1>
        </div>

        {/* 🔹 Кнопки управления JSON */}
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          {/* 📤 Экспорт JSON */}
          <button
            onClick={handleExport}
            className="bg-white text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
            disabled={isExporting}
          >
            {isExporting ? "Экспорт..." : <>
              <FaDownload size={18} />
              Экспорт
            </>}
          </button>

          {/* 📥 Добавить JSON */}
          <button
            onClick={() => handleImport(false)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all w-full sm:w-auto"
            disabled={isImporting}
          >
            {isImporting ? "Импорт..." : <>
              <FaUpload size={18} />
              Добавить
            </>}
          </button>

          {/* ❗ Полная замена базы */}
          <button
            onClick={() => {
              if (confirm("⚠️ Вы уверены? Это полностью заменит базу данных!")) {
          handleImport(true);
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all w-full sm:w-auto"
            disabled={isReplacing}
          >
            {isReplacing ? "Замена..." : <>
              <FaSyncAlt size={18} />
              Заменить
            </>}
          </button>

          {/* 🗑️ Удаление истекших промокодов */}
          <button
            onClick={handleDeleteExpiredPromocodes}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all w-full sm:w-auto"
            disabled={isDeletingExpired}
          >
            {isDeletingExpired ? "Удаление..." : <>
              <FaTrashAlt size={18} />
              Истекшие промокоды
            </>}
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
