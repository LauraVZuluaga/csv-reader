import { ApiSearchResponse, type Data } from "../types";
import { API_HOST } from "../config";

export const searchData = async (search: string): Promise<[Error?, Data?]> => {
  try {
    const res = await fetch(`${API_HOST}/api/users?q=${search}`);

    //If the request doesn't work, it returns a tuple with an error information at the first position.
    if (!res.ok)
      return [new Error(`Error buscando la data: ${res.statusText}`)];
    const json = (await res.json()) as ApiSearchResponse;
    return [undefined, json.data];
  } catch (error) {
    if (error instanceof Error) return [error];
  }
  return [new Error("Unknown error")];
};
