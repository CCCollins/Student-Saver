"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { RiVipCrownFill } from "react-icons/ri";
import { FaCity, FaHeart, FaRegHeart } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  cities: string[];
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isFavoritesOnly: boolean;
  setIsFavoritesOnly: (value: boolean) => void;
};

const Header = ({ cities, selectedCity, setSelectedCity, isFavoritesOnly, setIsFavoritesOnly }: HeaderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error && data?.role === "admin") {
          setIsAdmin(true);
        }
      }
    };

    fetchUser();
  }, []);

  const handleAuth = async () => {
    if (user) {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
    } else {
      router.push("/login");
    }
  };

  return (
    <header className="w-full max-w-7xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl rounded-lg p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
      {/* Логотип + Заголовок */}
      <div className="flex items-center gap-4 sm:gap-6">
        <Image
          src="/favicon.ico"
          alt="Иконка"
          className="w-10 h-10"
          width={40}
          height={40}
          draggable="false"
        />
        <h1 className="text-2xl lg:text-3xl font-extrabold text-center sm:text-left tracking-wide">
          Лучшие предложения для студентов
        </h1>
      </div>

      {/* Центр: Фильтр по избранному + Фильтр по городу */}
      <div className="flex w-full sm:w-auto justify-between gap-4">
        {/* Фильтр по избранному */}
        <button
          className={`flex items-center justify-center w-1/4 sm:w-12 h-12 rounded-lg border border-gray-300 shadow-md transition-all ${
            isFavoritesOnly ? "bg-yellow-400 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setIsFavoritesOnly(!isFavoritesOnly)}
        >
          {isFavoritesOnly ? <FaHeart className="text-red-600 text-xl" /> : <FaRegHeart className="text-gray-500 text-xl" />}
        </button>

        {/* Кнопка выбора города */}
        <div className="relative w-3/4 sm:w-auto">
          <button
            className="flex items-center justify-center lg:w-48 w-full sm:w-auto px-5 h-12 bg-white border border-gray-300 rounded-lg shadow-md text-gray-700 hover:bg-gray-100 transition-all"
            onClick={() => setCityDropdownOpen((prev) => !prev)}
          >
            <FaCity className="mr-2 text-gray-500" />
            {selectedCity}
          </button>

          {/* Выпадающий список городов */}
          {cityDropdownOpen && (
            <div className="absolute top-full lg:w-48 left-0 w-full sm:w-auto bg-white text-gray-900 mt-2 rounded-lg shadow-lg overflow-hidden border border-gray-300 z-50">
              {cities.map((city) => (
                <button
                  key={city}
                  className={`block w-full text-left px-5 py-3 hover:bg-blue-50 transition-all ${
                    selectedCity === city ? "bg-blue-100 font-semibold text-blue-700" : "text-gray-700"
                  }`}
                  onClick={() => {
                    setSelectedCity(city);
                    setCityDropdownOpen(false);
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Админ-кнопка и вход */}
      <nav className="flex w-full sm:w-auto justify-between gap-4">
        {isAdmin && (
          <Link href="/admin" className="flex-1">
            <span className="w-full sm:w-12 h-12 bg-yellow-400 text-gray-900 p-2 rounded-lg shadow hover:bg-yellow-300 transition cursor-pointer flex items-center justify-center">
              <RiVipCrownFill size={24} />
            </span>
          </Link>
        )}
        <button
          onClick={handleAuth}
          className="flex-1 sm:w-auto bg-white h-12 text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition cursor-pointer font-semibold"
        >
          {user ? "Выйти" : "Войти"}
        </button>
      </nav>
    </header>
  );
};

export default Header;