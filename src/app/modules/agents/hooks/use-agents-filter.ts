import { DEFAULT_PAGE, DEFAULT_SEARCH_TERM } from "@/contants";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export const useAgentsFilter = () => {
    return useQueryStates({
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault: true}),
        search: parseAsString.withDefault(DEFAULT_SEARCH_TERM).withOptions({clearOnDefault: true}),
    })
}