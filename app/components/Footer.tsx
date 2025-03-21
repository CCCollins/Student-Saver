"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

// Цитаты + авторы
const quotes = [
  { text: "Составлять сбалансированный бюджет — все равно что защищать свою добродетель: нужно научиться говорить «нет».", author: "Рональд Рейган" },
  { text: "Остерегайтесь незначительных расходов; маленькая течь потопит большой корабль.", author: "Бенджамин Франклин" },
  { text: "Будь бережлив и готовься к завтрашнему дню.", author: "Эзоп" },
  { text: "Гордость, которая мешает экономить собственные деньги — огромная глупость.", author: "Дональд Трамп" },
  { text: "Есть два способа стать счастливым: — Ограничить свои потребности — Увеличить свои возможности. Мудрый человек делает и то, и другое.", author: "Бодо Шефер" },
  { text: "Займи у себя, сократив свои расходы.", author: "Сократ" },
  { text: "Какой бы ни была скидка, вы не много сэкономите, если купите вещь, которую ни разу не наденете.", author: "Эдит Хэд" },
  { text: "Если вам нужна машина, но вы ее не покупаете, то в конце концов вы обнаружите, что заплатили за нее, а ее у вас нет.", author: "Генри Форд" },
  { text: "Если хотите быть богатым, научитесь не только зарабатывать, но и быть экономным.", author: "Бенджамин Франклин" },
  { text: "Экономия — богатство бедных и мудрость богатых.", author: "Александр Дюма (отец)" },
  { text: "Экономность — добродетель богатых.", author: "Бодо Шефер" },
];

const Footer = () => {
  const [offersCount, setOffersCount] = useState<number | null>(null);
  const [randomQuote, setRandomQuote] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    const fetchOffersCount = async () => {
      const { count, error } = await supabase
        .from("offers")
        .select("*", { count: "exact", head: true });

      if (!error) {
        setOffersCount(count);
      }
    };

    fetchOffersCount();
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]); // Выбираем случайную цитату
  }, []);

  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 mt-3 shadow-lg rounded-lg max-w-7xl mx-auto w-full px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Левая часть (название и статистика) */}
        <div className="text-left">
          <h3 className="text-lg font-bold tracking-wide">Student Saver © {new Date().getFullYear()}</h3>
          <p className="text-xs justify-center opacity-70 mt-1">
            Доступно <span className="font-semibold">{offersCount}</span> предложений
          </p>
        </div>

        {/* Центральная часть (цитата) */}
        {randomQuote && (
          <blockquote className="relative text-center md:text-left max-w-lg">
            <p className="text-sm italic font-medium opacity-90 leading-relaxed transition-opacity duration-700 ease-in-out">
              “{randomQuote.text}”
            </p>
            <hr className="border-t border-gray-300 opacity-50 my-2 mx-auto md:mx-0 w-1/3" />
            <p className="text-xs font-semibold text-gray-200">{randomQuote.author}</p>
          </blockquote>
        )}
      </div>
    </footer>
  );
};

export default Footer;
