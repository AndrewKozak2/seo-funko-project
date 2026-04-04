"use client";

import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styles from "./Filters.module.css";

interface FiltersProps {
  selectedCollection: string[];
  onCollectionChange: (collection: string) => void;
  priceRange: [number, number];
  onPriceChange: (value: [number, number]) => void;
}

export function Filters({
  selectedCollection,
  onCollectionChange,
  priceRange,
  onPriceChange,
}: FiltersProps) {
  const [localPrice, setLocalPrice] = useState<[number, number]>(priceRange);

  useEffect(() => {
    setLocalPrice(priceRange);
  }, [priceRange]);

  return (
    <div className={styles.filtersPanel}>
      <h2 className={styles.title}>Filter</h2>

      <div className={styles.filterGroup}>
        <h3 className={styles.groupTitle}>Collection</h3>
        {["Harry Potter", "Star Wars", "Marvel", "Formula 1", "One Piece"].map(
          (name) => (
            <label key={name} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedCollection.includes(name)}
                onChange={() => onCollectionChange(name)}
              />
              {name}
            </label>
          ),
        )}
      </div>

      <div className={styles.filterGroup}>
        <h3 className={styles.groupTitle}>Price</h3>
        <div className={styles.priceSliderContainer}>
          <Slider
            range
            min={0}
            max={100}
            value={localPrice}
            onChange={(val) => setLocalPrice(val as [number, number])}
            onChangeComplete={(val) => onPriceChange(val as [number, number])}
          />
        </div>
        <div className={styles.priceLabels}>
          <span>$0</span>
          <span className={styles.currentPrice}>
            ${localPrice[0]} - ${localPrice[1]}
          </span>
          <span>$100</span>
        </div>
      </div>
    </div>
  );
}
