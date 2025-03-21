export interface Promocode {
    code: string;
    expires: string;
    info: string;
  }
  
  export interface Offer {
    city?: string;
    id?: string;
    title: string;
    description: string;
    category: string;
    promocode?: Promocode[];
    expires: string;
    link: string;
  }
  