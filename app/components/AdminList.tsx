import { useState } from "react";
import { Offer } from "./types";
import { Pencil, Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";

interface AdminListProps {
  offers: Offer[];
  onEdit: (offer: Offer) => void;
  onDelete: (id: string) => void;
}

export default function AdminList({ offers, onEdit, onDelete }: AdminListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);
  const [showPromos, setShowPromos] = useState(true);
  const [showDeals, setShowDeals] = useState(true);
  const [promoLimit, setPromoLimit] = useState(20);
  const [dealLimit, setDealLimit] = useState(20);

  const filteredOffers = offers.filter((offer) =>
    [offer.title, offer.description, offer.promocode?.map((p) => p.code).join(" ")].some((text) =>
      text?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Промокоды
  const promos = filteredOffers.filter((offer) => offer.category === "Промокоды").slice(0, promoLimit);

  // Акции
  const deals = filteredOffers.filter((offer) => offer.category !== "Промокоды").slice(0, dealLimit);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
      {/* 🔎 Поиск */}
      <div className="relative w-full max-w-lg mx-auto mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 🎟️ Промокоды */}
        <CollapsibleSection
          title="Промокоды"
          show={showPromos}
          setShow={setShowPromos}
        >
          {promos.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onEdit={onEdit}
              onDelete={onDelete}
              expandedOffer={expandedOffer}
              setExpandedOffer={setExpandedOffer}
            />
          ))}
        </CollapsibleSection>

        {/* 🎁 Акции */}
        <CollapsibleSection
          title="Акции"
          show={showDeals}
          setShow={setShowDeals}
        >
          {deals.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onEdit={onEdit}
              onDelete={onDelete}
              expandedOffer={expandedOffer}
              setExpandedOffer={setExpandedOffer}
            />
          ))}
        </CollapsibleSection>
      </div>

      {/* Кнопка "Показать еще" */}
      {(promoLimit < filteredOffers.filter((offer) => offer.category === "Промокоды").length ||
        dealLimit < filteredOffers.filter((offer) => offer.category !== "Промокоды").length) && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              setPromoLimit(promoLimit + 20);
              setDealLimit(dealLimit + 20);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Показать еще
          </button>
        </div>
      )}
    </div>
  );
}

function CollapsibleSection({ title, show, setShow, children }: { title: string; show: boolean; setShow: (val: boolean) => void; children: React.ReactNode }) {
  return (
    <div className="flex-1 lg:flex-1">
      <div
        className="flex justify-between items-center bg-blue-600 text-white py-3 px-4 rounded-lg cursor-pointer"
        onClick={() => setShow(!show)}
      >
        <h2 className="text-lg font-bold">{title}</h2>
        {show ? <ChevronUp /> : <ChevronDown />}
      </div>
      {/* Для скрытия содержимого используем height и overflow */}
      <div
        className={`overflow-hidden grid sm:grid-cols-1 lg:grid-cols-2 gap-4 px-2 mt-4 transition-all duration-300 ease-in-out ${show ? 'h-auto' : 'h-0'}`}
      >
        {children}
      </div>
    </div>
  );
}

function OfferCard({
  offer,
  onEdit,
  onDelete,
  expandedOffer,
  setExpandedOffer,
}: {
  offer: Offer;
  onEdit: (offer: Offer) => void;
  onDelete: (id: string) => void;
  expandedOffer: string | null;
  setExpandedOffer: (id: string | null) => void;
}) {
  return (
    <div
      className="bg-white shadow-lg rounded-xl p-4 border border-gray-200 transition-all transform hover:shadow-xl cursor-pointer"
      onClick={() => setExpandedOffer(expandedOffer === offer.id ? null : offer.id ?? null)}
    >
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <h2 className="text-gray-800">{offer.title}</h2>
        <div className="flex gap-2">
          <IconButton gradient="blue" onClick={() => onEdit(offer)}>
            <Pencil className="text-white w-5 h-5" />
          </IconButton>
          <IconButton gradient="red" onClick={() => offer.id && onDelete(offer.id)}>
            <Trash2 className="text-white w-5 h-5" />
          </IconButton>
        </div>
      </div>

      {/* Разворачиваемый контент */}
      {expandedOffer === offer.id && (
        <div className="mt-3 p-3 border border-gray-300 rounded-lg shadow-sm">
          <p className="text-gray-600 text-sm">{offer.description}</p>
          <hr className="my-3 border-gray-300" />
          <p className="text-gray-600 text-sm">{offer.expires}</p>
          {offer.promocode && offer.promocode.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto">
              <ul>
                {offer.promocode.map((promo, index) => (
                  <li key={index} className="flex justify-between items-center bg-white p-2 border rounded-md mt-1">
                    <span className="font-medium text-gray-800">{promo.code}</span>
                    <span className="text-gray-500 text-sm">{promo.expires}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function IconButton({ children, onClick, gradient }: { children: React.ReactNode; onClick?: () => void; gradient: "red" | "blue" }) {
  return (
    <div
      className={`flex justify-center items-center w-8 h-8 rounded-full cursor-pointer ${
        gradient === "blue" ? "bg-gradient-to-br from-blue-600 to-teal-400" : "bg-gradient-to-br from-red-500 to-orange-500"
      } shadow-md`}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) {
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
}