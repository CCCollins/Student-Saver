import OfferCard from "./OfferCard";

export default function OfferList({ offers }: { offers: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {offers.length > 0 ? (
        offers.map((offer) => (
          <OfferCard key={offer.id} {...offer} />
        ))
      ) : (
        <div className="w-full flex justify-center items-center py-10">
          <p className="text-gray-600 text-center text-lg">❌ Ничего не найдено.</p>
        </div>
      )}
    </div>
  );
}
