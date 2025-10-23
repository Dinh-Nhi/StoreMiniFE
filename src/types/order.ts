export interface OrderItemRequest {
    variantId: number;
    quantity: number;
  }
  
  export interface OrderRequest {
    name: string;
    phone: string;
    address: string;
    paymentMethod: string;
    items: OrderItemRequest[];
  }