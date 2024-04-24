export namespace I_Purchase {
  export interface Body {
    goodId: string;
    addressId: string;
  }
}

export namespace I_CancelOrder {
  export interface Body {
    id: string;
  }
}
