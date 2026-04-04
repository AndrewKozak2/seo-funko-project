import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styles from "./Filters.module.css";

interface FiltersProps {
  selectedCollection: string[];
  onCollectionChange: (colection: string) => void;
  priceRange: [number, number];
  onPriceChange: (value: [number, number]) => void;
}

export function Filters({
  selectedCollection,
  onCollectionChange,
  priceRange,
  onPriceChange,
}: FiltersProps) {
  return (
    <div className={styles.filtersPanel}>
      <h2 className={styles.title}>Filter</h2>
      <div className={styles.filterGroup}>
        <h3 className={styles.groupTitle}>Collection</h3>
        {["Harry Potter", "Star Wars", "Marvel", "Formula 1", "One Piece"].map((name) => (
          <label key={name} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedCollection.includes(name)}
              onChange={() => onCollectionChange(name)}
            />
            {name}
          </label>
        ))}
      </div>
      <div className={styles.filterGroup}>
        <h3 className={styles.groupTitle}>Price</h3>
        <div className={styles.priceSliderContainer}>
          <Slider
            range
            value={priceRange}
            onChange={(val) => onPriceChange(val as [number, number])}
            min={0}
            max={100}
            styles={{
              track: {
                backgroundColor: "#00f6ff",
                boxShadow: "0 0 10px rgba(0,246,255,0.5)",
              },
              rail: {
                backgroundColor: "#1e293b",
              },
              handle: {
                backgroundColor: "#0b1524",
                borderColor: "#00f6ff",
                boxShadow: "0 0 10px rgba(0,246,255,1)",
                opacity: 1,
              },
            }}
          />
        </div>
        <div className={styles.priceLabels}>
          <span>$0</span>
          <span className={styles.currentPrice}>
            ${priceRange[0]} - ${priceRange[1]}
          </span>
          <span>$100</span>
        </div>
      </div>
    </div>
  );
}
