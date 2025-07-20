import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SEARCH_TERM } from "@/contants";

export const filtersSearchParams = {
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault: true}),
    search: parseAsString.withDefault(DEFAULT_SEARCH_TERM).withOptions({clearOnDefault: true}),
}

export const loadSearchParams = createLoader(filtersSearchParams);