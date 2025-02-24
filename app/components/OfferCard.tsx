import { useState } from "react";

export default function OfferCard({ title, description, promocode, expires, link }: any) {
  const [copied, setCopied] = useState(false);

  // Функция для копирования промокода в буфер обмена
  const handleCopy = () => {
    navigator.clipboard.writeText(promocode);
    setCopied(true);
    setTimeout(() => setCopied(false), 300); // Сбросить статус через 2 секунды
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 transition-all transform hover:shadow-xl hover:scale-102 flex flex-col justify-between">
      {/* Заголовок */}
      <h2 className="text-xl font-semibold text-gray-800 transition-all">{title}</h2>
      
      {/* Описание */}
      <p className="text-gray-600 text-sm mt-2 flex-grow">{description}</p>

      {/* Промокод */}
      {promocode && (
        <span 
          onClick={handleCopy}
          className={`mt-3 inline-block cursor-pointer bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-md transition-all transform ${copied ? "bg-green-500" : ""}`}
        >
          {copied ? "✅ Промокод скопирован!" : `🔥 Промокод: ${promocode}`}
        </span>
      )}

      {/* Дата окончания и кнопка "Подробнее" */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-500 text-xs">
          ⏳ <span className={`font-semibold ${expires === "ongoing" ? "text-green-500" : "text-red-500"}`}>
            {expires === "ongoing" ? "Бессрочно" : `До ${expires}`}
          </span>
        </p>

        <a 
          href={link} 
          target="_blank" 
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all transform hover:scale-105"
        >
          Подробнее →
        </a>
      </div>
    </div>
  );
}
