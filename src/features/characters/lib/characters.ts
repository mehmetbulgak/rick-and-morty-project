import type {
  CharacterFilterOptions,
  CharacterFilters,
  CharacterListSearchParams,
} from "@/features/characters/types/character";

export const characterFilterOptions: CharacterFilterOptions = {
  species: [],
  genders: ["Female", "Male", "Genderless", "unknown"],
  statuses: ["Alive", "Dead", "unknown"],
};

function getSingleValue(
  value: string | string[] | undefined,
  fallback = ""
) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export function getCharacterFilters(
  searchParams?: CharacterListSearchParams
): CharacterFilters {
  const pageValue = Number.parseInt(getSingleValue(searchParams?.page, "1"), 10);

  return {
    name: getSingleValue(searchParams?.name),
    species: getSingleValue(searchParams?.species),
    gender: getSingleValue(searchParams?.gender),
    status: getSingleValue(searchParams?.status),
    page: Number.isNaN(pageValue) || pageValue < 1 ? 1 : pageValue,
  };
}

export function buildCharacterListHref(
  filters: CharacterFilters,
  page = 1
) {
  const params = new URLSearchParams();

  if (filters.name) {
    params.set("name", filters.name);
  }

  if (filters.species) {
    params.set("species", filters.species);
  }

  if (filters.gender) {
    params.set("gender", filters.gender);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}
