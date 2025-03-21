'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Переключение между "Вход" и "Регистрация"
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

    if (isLogin) {
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
    } else {
      // 🔹 Пробуем зарегистрировать пользователя
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Пользователь с таким email уже существует.');
        } else {
          setError('Ошибка при регистрации.');
        }
        return;
      }

      // 🔹 Создаем запись в users
      const { error: insertError } = await supabase.from('users').insert([
        {
          user_id: data.user?.id,
          role: 'user',
          favorites: [],
        },
      ]);

      if (insertError) {
        setError('Ошибка при создании пользователя в базе.');
        return;
      }

      // Перенаправление на главную страницу после успешной регистрации
      router.push('/');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-teal-400 to-blue-600 px-4">
      <div className="p-6 bg-white shadow-xl rounded-lg max-w-lg w-full sm:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          {isLogin ? 'Вход' : 'Регистрация'}
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
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <p className="text-center text-gray-800">
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500">
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}