export interface EquipmentDto {
  id: string;
  name: string;
  brand: string;
  model: string;
  ram: string;
  storage: string;
  screenSize: string;
  images: ImageDto[];
  pricePerMonth: number;
  regularPricePerMonth: number;
  initialFee: number;
  termMonths: number;
  promotion?: string;
}

export interface ImageDto{
  id: string,
  url: string,
}