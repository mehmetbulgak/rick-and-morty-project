export type CharacterStatus = "Alive" | "Dead" | "unknown";
export type CharacterGender = "Female" | "Male" | "Genderless" | "unknown";

export type CharacterListSearchParams = Record<
  string,
  string | string[] | undefined
>;

export interface EpisodeSummary {
  id: string;
  code: string;
  name: string;
  airDate: string;
}

export interface Character {
  id: number;
  name: string;
  species: string;
  gender: CharacterGender;
  status: CharacterStatus;
  type: string;
  origin: string;
  location: string;
  imageSrc?: string;
  accent: string;
  episodeUrls: string[];
}

export interface CharacterProfile extends Character {
  episodes: EpisodeSummary[];
}

export interface CharacterDirectory {
  items: Character[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  nextPage: number | null;
  hasMore: boolean;
}

export interface CharacterFilters {
  name: string;
  species: string;
  gender: string;
  status: string;
  page: number;
}

export interface CharacterFilterOptions {
  species: string[];
  genders: string[];
  statuses: string[];
}
