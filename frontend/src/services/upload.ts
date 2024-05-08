import { ApiUploadResponse, type Data } from "../types";
import { API_HOST } from "../config";

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("API_HOST/api/files", {
      method: "POST",
      body: formData,
    });

    //If the request doesn't work, it returns a tuple with an error information at the first position.
    if (!res.ok)
      return [new Error(`Error cargando el archivo: ${res.statusText}`)];
    const json = (await res.json()) as ApiUploadResponse;
    return [undefined, json.data];
  } catch (error) {
    if (error instanceof Error) return [error];
  }
  return [new Error("Unknown error")];
};
