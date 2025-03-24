'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async () => {
    setError(null);

    if (!email || !password) {
      setError('Введите email и пароль.');
      return;
    }

    if (password.length < 8) {
      setError('Пароль должен быть не менее 8 символов.');
      return;
    }

    // 🔹 Вход пользователя
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError('Неверный логин или пароль.');
      return;
    }

    // 🔹 Получаем роль пользователя из users
    const { error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('user_id', data.user.id)
      .single();

    if (userError) {
      setError('Ошибка получения данных пользователя.');
      console.error(userError);
      return;
    }

    // Перенаправление на главную страницу после успешного входа
    router.push('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-400 to-blue-600 px-4">
      <div className="p-6 bg-white shadow-xl rounded-lg max-w-lg w-full sm:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Вход
        </h2>

        <div className="space-y-6">
          <input
            type="email"
            placeholder="Введите вашу почту"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 text-lg border text-gray-800 border-gray-300 rounded-lg"
          />

          <input
            type="password"
            placeholder="Введите ваш пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 text-lg border text-gray-800 border-gray-300 rounded-lg"
          />

          <button
            onClick={handleAuth}
            className="w-full py-4 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600"
          >
            Войти
          </button>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        </div>
      </div>
    </div>
  );
}