import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_SEARCH_TERM } from "@/contants";
import { MeetingStatus } from "./types";

export const filtersSearchParams = {
    page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault: true}),
    search: parseAsString.withDefault(DEFAULT_SEARCH_TERM).withOptions({clearOnDefault: true}),
    agentId: parseAsString.withDefault("").withOptions({clearOnDefault: true}),
    status: parseAsStringEnum(Object.values(MeetingStatus)),
}

export const loadSearchParams = createLoader(filtersSearchParams);