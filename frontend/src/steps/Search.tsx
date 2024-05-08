import * as React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Data } from "../types";
import { searchData } from "../services/search";
import { useDebounce } from "@uidotdev/usehooks";

const DEBOUNCE_TIME = 300;

export const Search = ({ initialData }: { initialData: Data }) => {
  const [data, setData] = useState<Data>(initialData);
  const [search, setSearch] = useState<string>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("q") ?? "";
  });

  const debounceSearch = useDebounce(search, DEBOUNCE_TIME);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value, "event.target.value");
    setSearch(event.target.value);
  };

  useEffect(() => {
    const newPathname =
    debounceSearch === "" ? window.location.pathname : `?q=${debounceSearch}`;
    window.history.replaceState({}, "", newPathname);
  }, [debounceSearch]);

  useEffect(() => {
    if (!debounceSearch) {
      setData(initialData);
      return;
    }

    //Call the API for filter the results
    searchData(debounceSearch).then((response) => {
      const [error, newData] = response;
      if (error) {
        toast.error(error.message);
        return;
      }
      if (newData) setData(newData);
    });
  }, [debounceSearch, initialData]);

  return (
    <section>
      <h1>Search</h1>
      <form>
        <input
          onChange={handleSearch}
          type="search"
          placeholder="Buscar información..."
          defaultValue={search}
        />
      </form>
      <ul>
        {data.map((row) => (
          <li key={row.id}>
            <article>
              {Object.entries(row).map(([key, value]) => (
                <p key={key}>
                  <strong> {key}: </strong> {value}
                </p>
              ))}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};
