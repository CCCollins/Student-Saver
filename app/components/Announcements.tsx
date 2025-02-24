const announcements = [
    "💼 Открыт приём заявок на стажировки в Google!",
    "🎟️ Бесплатный вход в кино для студентов каждую среду!",
  ];
  
  export default function Announcements() {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-3 rounded-md shadow-sm mb-4">
        <p className="font-medium">{announcements[0]}</p>
      </div>
    );
  }