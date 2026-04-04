"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useProductStore } from "@/store/productStore";

export function useShop() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { products: serverProducts } = useProductStore();

  const searchQuery = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "default";
  const collectionsParam = searchParams.get("collections");

  const selectedCollections = useMemo(
    () => (collectionsParam ? collectionsParam.split(",") : []),
    [collectionsParam],
  );

  const minParam = searchParams.get("min");
  const maxParam = searchParams.get("max");
  const priceRange: [number, number] = useMemo(
    () => [
      minParam !== null ? Number(minParam) : 0,
      maxParam !== null ? Number(maxParam) : 100,
    ],
    [minParam, maxParam],
  );

  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    setVisibleCount(8);
  }, [collectionsParam, minParam, maxParam, searchQuery, sortParam]);

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(paramsToUpdate).forEach(([name, value]) => {
        if (value === null || value === "") {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      });

      return params.toString();
    },
    [searchParams],
  );

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

  const updateURL = (newParams: Record<string, string | null>) => {
    const queryString = createQueryString(newParams);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const handleCollectionChange = (collectionName: string) => {
    let newCollections = [...selectedCollections];
    if (newCollections.includes(collectionName)) {
      newCollections = newCollections.filter((name) => name !== collectionName);
    } else {
      newCollections.push(collectionName);
    }

    updateURL({
      collections: newCollections.length > 0 ? newCollections.join(",") : null,
    });
  };

  const handlePriceChange = (value: [number, number]) => {
    updateURL({
      min: value[0].toString(),
      max: value[1].toString(),
    });
  };

  const handleSortChange = (value: string) => {
    updateURL({ sort: value });
  };

  const loadMore = () => setVisibleCount((prev) => prev + 4);

  const resetFilters = () => {
    router.push(pathname, { scroll: false });
  };

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
