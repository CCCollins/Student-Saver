import { useState, useEffect } from "react";
import OfferCard from "./OfferCard";
import { FaCaretRight, FaCaretLeft } from "react-icons/fa";

interface Promocode {
  code: string;
  expires: string;
  info: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  promocode?: Promocode[];
  expires: string;
  link: string;
}

interface OfferListProps {
  offers: Offer[];
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
}

export default function OfferList({ offers, favorites, setFavorites }: OfferListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [offersPerPage, setOffersPerPage] = useState(6);

  useEffect(() => {
    const updateOffersPerPage = () => {
      if (window.innerWidth <= 768) {
        setOffersPerPage(3);
      } else {
        setOffersPerPage(9);
      }
    };

    updateOffersPerPage();
    window.addEventListener("resize", updateOffersPerPage);

    return () => window.removeEventListener("resize", updateOffersPerPage);
  }, []);

  const totalPages = Math.ceil(offers.length / offersPerPage);
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const renderPaginationButtons = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => paginate(i + 1)}
          className={`px-2 py-1 text-sm transition ${
            currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-300"
          } rounded`}
        >
          {i + 1}
        </button>
      ));
    }

    return (
      <>
        <button
          onClick={() => paginate(1)}
          className={`px-2 py-1 text-sm transition ${
            currentPage === 1 ? "bg-blue-600 text-white" : "hover:bg-gray-300"
          } rounded`}
        >
          1
        </button>

        {currentPage > 3 && <span className="px-2 text-gray-500">…</span>}

        {currentPage > 2 && currentPage < totalPages - 1 && (
          <button
            onClick={() => paginate(currentPage)}
            className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
          >
            {currentPage}
          </button>
        )}

        {currentPage < totalPages - 2 && <span className="px-2 text-gray-500">…</span>}

        <button
          onClick={() => paginate(totalPages)}
          className={`px-2 py-1 text-sm transition ${
            currentPage === totalPages ? "bg-blue-600 text-white" : "hover:bg-gray-300"
          } rounded`}
        >
          {totalPages}
        </button>
      </>
    );
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentOffers.map((offer) => (
          <OfferCard
            key={offer.id}
            {...offer}
            isExpanded={expandedId === offer.id}
            setExpandedId={setExpandedId}
            favorites={favorites}
            setFavorites={setFavorites}
          />
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4">
          <div className="flex items-center bg-gray-200 text-gray-700 rounded-lg shadow-md overflow-hidden">
            <button
              onClick={prevPage}
              className="px-2 py-1 bg-gray-300 text-gray-700 hover:bg-gray-400 transition disabled:opacity-50 rounded-l"
              disabled={currentPage === 1}
            >
              <FaCaretLeft className="w-5 h-5" />
            </button>

            {renderPaginationButtons()}

            <button
              onClick={nextPage}
              className="px-2 py-1 bg-gray-300 text-gray-700 hover:bg-gray-400 transition disabled:opacity-50 rounded-r"
              disabled={currentPage === totalPages}
            >
              <FaCaretRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}