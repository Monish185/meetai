import { DEFAULT_PAGE, DEFAULT_SEARCH_TERM } from "@/contants";
import { parseAsInteger, parseAsString, useQueryStates, parseAsStringEnum } from "nuqs";
import { MeetingStatus } from "../types";

export const useMeetingsFilter = () => {
    return useQueryStates({
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault: true}),
        search: parseAsString.withDefault(DEFAULT_SEARCH_TERM).withOptions({clearOnDefault: true}),
        agentId: parseAsString.withDefault("").withOptions({clearOnDefault: true}),
        status: parseAsStringEnum(Object.values(MeetingStatus)),
    })
}