export interface FunkoPop {
  id: string;
  _id?: string;
  title: string;
  price: number;
  imageUrl: string;
  isExclusive: boolean;
  collection: string;
  isBundle?: boolean;
  bundleImages?: string[];
  originalPrice?: number;
}

export interface CartItem {
  product: FunkoPop;
  quantity: number;
}
