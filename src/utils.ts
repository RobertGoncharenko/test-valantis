import { Item } from "./types";

export const removeDuplicates = (ids: string[]): string[] => {
   const id = [...new Set(ids)];
   return id;
};

export const removeItemDuplicates = (items: Item[]): Item[] => {
   const hashMap: Record<string, Item> = {};
   items.forEach((item) => {
      if (!hashMap[item.id]) hashMap[item.id] = item;
   });
   return Object.values(hashMap);
};

export const fieldString = () => {
    
}