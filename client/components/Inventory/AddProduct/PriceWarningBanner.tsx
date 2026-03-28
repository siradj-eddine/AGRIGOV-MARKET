import { OFFICIAL_PRICE_PER_KG, PRICE_TOLERANCE_PCT } from "@/types/AddProduct";

interface Props {
  priceValue: string; 
}

export default function PriceWarningBanner({ priceValue }: Props) {
  const price = parseFloat(priceValue);
  const isOutOfRange =
    !isNaN(price) &&
    price > 0 &&
    Math.abs(price - OFFICIAL_PRICE_PER_KG) / OFFICIAL_PRICE_PER_KG > PRICE_TOLERANCE_PCT / 100;


  return (
    <div
      className={`p-4 rounded-lg flex gap-3 items-start border transition-colors ${
        isOutOfRange
          ? "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900/20"
          : "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20"
      }`}
    >
      <span
        className={`material-symbols-outlined mt-0.5 ${
          isOutOfRange ? "text-orange-500" : "text-blue-500"
        }`}
      >
        {isOutOfRange ? "warning" : "info"}
      </span>
      <p
        className={`text-xs ${
          isOutOfRange
            ? "text-orange-800 dark:text-orange-200"
            : "text-blue-800 dark:text-blue-200"
        }`}
      >
        {isOutOfRange
          ? `Your price deviates more than ${PRICE_TOLERANCE_PCT}% from the official price ($${OFFICIAL_PRICE_PER_KG}/kg). Please adjust to ensure faster approval and listing placement.`
          : `Ensure the Price per Unit is within ±${PRICE_TOLERANCE_PCT}% of the Official Price ($${OFFICIAL_PRICE_PER_KG}/kg) for faster approval and listing placement.`}
      </p>
    </div>
  );
}