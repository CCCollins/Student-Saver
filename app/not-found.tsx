import Link from 'next/link';
import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 max-w-lg w-full mx-4 sm:mx-0 text-center space-y-6">
        <h1 className="text-6xl font-semibold text-blue-600 animate__animated animate__fadeIn animate__delay-1s">
          404
        </h1>
        <p className="text-xl text-gray-600 animate__animated animate__fadeIn animate__delay-1s">
          Ой! Страница, которую вы ищете, не существует.
        </p>
        <p className="text-lg text-gray-500 animate__animated animate__fadeIn animate__delay-2s">
          Возможно, она была перемещена или удалена, или URL указан неверно.
        </p>

        <div className="mt-8 animate__animated animate__fadeIn animate__delay-3s">
          <Link href="/">
            <span className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Вернуться на главную
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
