import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductStore } from "../../store/productStore";

export function useShop() {
  const { products: serverProducts } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "default";
  const collectionsParam = searchParams.get("collections");
  const selectedCollections = useMemo(
    () => (collectionsParam ? collectionsParam.split(",") : []),
    [collectionsParam],
  );

  const minParam = searchParams.get("min");
  const maxParam = searchParams.get("max");
  const minPrice = minParam !== null ? Number(minParam) : 0;
  const maxPrice = maxParam !== null ? Number(maxParam) : 100;
  const priceRange: [number, number] = useMemo(
    () => [minPrice, maxPrice],
    [minPrice, maxPrice],
  );

  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    setVisibleCount(8);
  }, [collectionsParam, minParam, maxParam, searchQuery, sortParam]);

  const filteredProducts = useMemo(() => {
    return serverProducts.filter((product) => {
      const isWithinPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      const matchesSearch =
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.collection?.toLowerCase().includes(searchQuery.toLowerCase());

      const isWithinCollection =
        selectedCollections.length === 0 ||
        selectedCollections.includes(product.collection);
      const isNotBundle = product.isBundle !== true;

      return (
        isWithinPrice && isWithinCollection && matchesSearch && isNotBundle
      );
    });
  }, [priceRange, searchQuery, selectedCollections, serverProducts]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortParam) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortParam]);

  const visibleProducts = sortedProducts.slice(0, visibleCount);

  const handleCollectionChange = (collectionName: string) => {
    setSearchParams((prev) => {
      let newCollections = [...selectedCollections];
      if (newCollections.includes(collectionName)) {
        newCollections = newCollections.filter(
          (name) => name !== collectionName,
        );
      } else {
        newCollections.push(collectionName);
      }

      if (newCollections.length > 0) {
        prev.set("collections", newCollections.join(","));
      } else {
        prev.delete("collections");
      }
      return prev;
    });
  };

  const handlePriceChange = (value: [number, number]) => {
    setSearchParams((prev) => {
      prev.set("min", value[0].toString());
      prev.set("max", value[1].toString());
      return prev;
    });
  };

  const handleSortChange = (value: string) => {
    setSearchParams((prev) => {
      prev.set("sort", value);
      return prev;
    });
  };

  const loadMore = () => setVisibleCount((prev) => prev + 4);

  const resetFilters = () => setSearchParams({});

  return {
    products: visibleProducts,
    totalCount: filteredProducts.length,
    visibleCount,
    filters: {
      searchQuery,
      sortParam,
      selectedCollections,
      priceRange,
    },
    actions: {
      handleCollectionChange,
      handlePriceChange,
      handleSortChange,
      loadMore,
      resetFilters,
    },
  };
}
