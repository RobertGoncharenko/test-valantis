export type RequestBody = {
    action: "get_ids" | "get_items" | "get_fields" | "filter",
    params?:  {
        [key: string]: string[] | string | number | null;
    }
}

export type Item = {
    brand: string | null;
    id: string;
    price: number;
    product: string;
}
