export interface GoodData {
  desc: string;
  latitude: string;
  longitude: string;
  photos: string[];
  price: string;
  status: string;
}

export interface GoodParams {
  lastValue: string;
  pageSize: number;
  keywords: string;
}
