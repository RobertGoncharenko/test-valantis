import { md5 } from "js-md5";
import { DEFAULT_LIMIT, MAX_TRIES } from "./constants";
import { Item, RequestBody } from "./types";

const apiUrl = "https://api.valantis.store:41000/";
const password = "Valantis";

const generateAuthString = () => {
   const fullDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
   const authString = `${password}_${fullDate}`;
   const hashString = md5(authString);
   return hashString;
};

// @todo add type for requestBody
const sendRequest = async <T>(requestBody: RequestBody): Promise<T[]> => {
   let tries = 0;

   while (tries < MAX_TRIES) {
      try {
         const authString = generateAuthString();
         const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "X-Auth": authString,
            },
            body: JSON.stringify(requestBody),
         });

         if (!response.ok) {
            const errorData = await response.text();
            console.error("Error API:", errorData);

            if (tries < MAX_TRIES - 1) {
               tries++;
               continue;
            }
            throw new Error("Network response was not ok");
         }

         const data = await response.json();

         return data.result as T[];
      } catch (error) {
         if (tries < MAX_TRIES) {
            tries++;
         } else {
            throw error;
         }
      }
   }
   return [];
};

export const getIds = async (
   offset: number,
   limit = DEFAULT_LIMIT
): Promise<string[]> => {
   return await sendRequest<string>({
      action: "get_ids",
      params: { offset, limit },
   });
};

export const getItems = async (ids: string[]): Promise<Item[]> => {
   return (
      (await sendRequest({
         action: "get_items",
         params: { ids },
      })) || []
   );
};

export const getFields = async (
   field: string | null = null,
   offset = 0,
   limit = DEFAULT_LIMIT
): Promise<string[]> => {
   const requestBody: RequestBody = {
      action: "get_fields",
   };
   if (field) {
      requestBody.params = { field, offset, limit };
   }
   return await sendRequest<string>(requestBody);
};

export const filter = async (
   field: string,
   value: string | number
): Promise<string[]> => {
   return await sendRequest<string>({
      action: "filter",
      params: {
      [field]: value,
    },
   });
};
