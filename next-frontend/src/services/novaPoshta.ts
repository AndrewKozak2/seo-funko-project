const API_KEY = process.env.NEXT_PUBLIC_NP_KEY;
const API_URL = process.env.NEXT_PUBLIC_NP_URL || "https://api.novaposhta.ua/v2.0/json/";

export interface City {
  Ref: string;
  Present: string;
}

export interface Warehouse {
  Ref: string;
  Description: string;
}

export const searchCities = async (inputValue: string): Promise<City[]> => {
  if (!inputValue) return [];

  const body = {
    apiKey: API_KEY,
    modelName: "Address",
    calledMethod: "searchSettlements",
    methodProperties: {
      CityName: inputValue,
      Limit: "50",
      Page: "1",
    },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (data.success && data.data && data.data.length > 0) {
      return data.data[0].Addresses.map((item: any) => ({
        Ref: item.DeliveryCity,
        Present: item.Present,
      }));
    }
    return [];
  } catch (error) {
    console.error("NP City Error:", error);
    return [];
  }
};

export const getWarehouses = async (cityRef: string): Promise<Warehouse[]> => {
  if (!cityRef) return [];

  const body = {
    apiKey: API_KEY,
    modelName: "Address",
    calledMethod: "getWarehouses",
    methodProperties: {
      CityRef: cityRef,
      Limit: "500",
    },
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (data.success) {
      return data.data.map((item: any) => ({
        Ref: item.Ref,
        Description: item.Description,
      }));
    }
    return [];
  } catch (error) {
    console.error("NP Warehouse Error:", error);
    return [];
  }
};