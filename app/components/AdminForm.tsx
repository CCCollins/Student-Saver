import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { SingleValue } from "react-select";
import { Promocode, Offer } from "./types";
import { supabase } from "@/utils/supabase";

interface AdminFormProps {
  offer?: Offer | null;
  categories: string[];
  cities: string[];
  onSubmit: (offer: Offer) => Promise<void>;
  onClose: () => void;
  onUpdate: () => void;
}

export default function AdminForm({ offer, categories, cities, onClose, onUpdate }: AdminFormProps) {
  const initialState = {
    title: "",
    description: "",
    category: "",
    promocode: [] as Promocode[],
    expires: "",
    city: "",
    link: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title,
        description: offer.description,
        category: offer.category,
        promocode: offer.promocode || [],
        expires: offer.expires,
        city: offer.city || "",
        link: offer.link,
      });
      setIsEditing(true);
    } else {
      setFormData(initialState);
      setIsEditing(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleCityChange = (newValue: SingleValue<{ value: string; label: string }>) => {
    setFormData({ ...formData, city: newValue ? newValue.value : "" });
  };
  
  const handleCategoryChange = (newValue: SingleValue<{ value: string; label: string }>) => {
    setFormData({ ...formData, category: newValue ? newValue.value : "" });
  };

  const handlePromocodeChange = (index: number, field: keyof Promocode, value: string) => {
    setFormData((prev) => ({
      ...prev,
      promocode: prev.promocode.map((promo, i) =>
        i === index ? { ...promo, [field]: value } : promo
      ),
    }));
  };

  const addPromocode = () => {
    setFormData({
      ...formData,
      promocode: [...formData.promocode, { code: "", expires: "", info: "" }],
    });
  };

  const removePromocode = (index: number) => {
    setFormData({
      ...formData,
      promocode: formData.promocode.filter((_, i) => i !== index),
    });
  };

  const handlePromocodeDateChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Убираем все символы, кроме цифр
    value = value.replace(/[^\d]/g, "");

    // Форматируем строку в формат ДД.ММ.ГГ
    if (value.length <= 6) {
      let formattedValue = value;
      if (value.length >= 3) {
        formattedValue = value.slice(0, 2) + "." + value.slice(2);
      }
      if (value.length >= 5) {
        formattedValue = formattedValue.slice(0, 5) + "." + formattedValue.slice(5);
      }

      setFormData((prev) => ({
        ...prev,
        promocode: prev.promocode.map((promo, i) =>
          i === index ? { ...promo, expires: formattedValue } : promo
        ),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description, category, link } = formData;

    if (!title || !description || !category || !link) {
      setError("Все поля, кроме промокода, должны быть заполнены.");
      return;
    }

    // Проверка даты на правильность формата (ДД.ММ.ГГ)
    const datePattern = /^(\d{2})\.(\d{2})\.(\d{2})$/;
    for (const promo of formData.promocode) {
      if (promo.expires && !datePattern.test(promo.expires)) {
        setError("Срок действия должен быть в формате ДД.ММ.ГГ.");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await supabase.from("offers").upsert({
      id: offer?.id || undefined,
      title,
      description,
      category,
      link,
      city: formData.city,
      promocode: formData.promocode, // ✅ Теперь это массив объектов
      expires: formData.expires,
    });
  
    if (error) {
      console.error("Ошибка при сохранении:", error);
      setError("Ошибка при сохранении. Попробуйте снова.");
      return;
    }
  
    setSuccess("Предложение успешно сохранено!");
    onUpdate();
    setTimeout(() => {
      setSuccess(null);
      onClose();
    }, 1000);
  };

  const handleReset = () => {
    setFormData(initialState);
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    onClose();
  };

  const categoryOptions = categories.map((cat) => ({ value: cat, label: cat }));
  const cityOptions = cities.map((city) => ({ value: city, label: city }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-700 hover:text-red-500 z-10">
          ✖
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          {isEditing ? "Редактировать предложение" : "Добавить предложение"}
        </h2>

        <div className="max-h-[70vh] overflow-y-auto p-2">
            <form onSubmit={handleSubmit} className="space-y-4">
            <CreatableSelect
              name="city"
              placeholder="Город"
              value={formData.city ? { value: formData.city, label: formData.city } : null}
              onChange={handleCityChange}
              options={cityOptions}
              className="w-full border border-gray-400 rounded-lg text-gray-900"
              hideSelectedOptions={true}
              isClearable={true}
              menuPlacement="auto"
              maxMenuHeight={150}
            />

            <CreatableSelect
              name="category"
              placeholder="Категория"
              value={categoryOptions.find((option) => option.value === formData.category)}
              onChange={handleCategoryChange}
              options={categoryOptions}
              className="w-full border border-gray-400 rounded-lg text-gray-900"
              hideSelectedOptions={true}
              isClearable={true}
              menuPlacement="auto"
              maxMenuHeight={150}
            />
            
            <input
              type="text"
              name="title"
              placeholder="Заголовок"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-400 rounded-lg text-gray-900"
              required
            />
            <textarea
              name="description"
              placeholder="Описание"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-400 rounded-lg text-gray-900"
              required
            />
            <input
              type="text"
              name="link"
              placeholder="Ссылка"
              value={formData.link}
              onChange={handleChange}
              className="w-full p-3 border border-gray-400 rounded-lg text-gray-900"
              required
            />

            {formData.category === "Промокоды" && (
              <div className="space-y-3">
                {formData.promocode.map((promo, index) => (
                  <div key={index} className="space-y-2 border p-3 rounded-md bg-gray-100">
                    <input
                      type="text"
                      placeholder="Промокод"
                      value={promo.code}
                      onChange={(e) => handlePromocodeChange(index, "code", e.target.value)}
                      className="w-full p-2 border border-gray-400 rounded text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="Описание"
                      value={promo.info}
                      onChange={(e) => handlePromocodeChange(index, "info", e.target.value)}
                      className="w-full p-2 border border-gray-400 rounded text-gray-900"
                    />
                    <input
                      type="text"
                      value={promo.expires}
                      onChange={(e) => handlePromocodeDateChange(index, e)} // Обработчик для даты промокода
                      placeholder="ДД.ММ.ГГ"
                      className="w-full p-2 border border-gray-400 rounded text-gray-900"
                    />
                    <button type="button" onClick={() => removePromocode(index)} className="text-red-500">
                      Удалить
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addPromocode} className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Добавить промокод
                </button>
              </div>
            )}

            {formData.category !== "Промокоды" && (
              <textarea
                name="expires"
                placeholder="Срок действия"
                value={formData.expires}
                onChange={handleChange}
                className="w-full p-3 border border-gray-400 rounded-lg text-gray-900"
              />
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Сохранение..." : isEditing ? "Обновить" : "Добавить"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
      </div>
    </div>
  );
}