import type {
  Character,
  CharacterDirectory,
  CharacterFilters,
  CharacterProfile,
  EpisodeSummary,
} from "@/features/characters/types/character";

const API_BASE_URL =
  process.env.RICK_AND_MORTY_API_BASE_URL?.replace(/\/$/, "") ??
  "https://rickandmortyapi.com/api";

const CHARACTER_ACCENTS = [
  "#18bddf",
  "#2d8cff",
  "#f97316",
  "#84cc16",
  "#8b5cf6",
  "#f43f5e",
  "#14b8a6",
  "#eab308",
];

type RequestJsonOptions = {
  query?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
  treat404AsNull?: boolean;
};

type RickAndMortyPageInfo = {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
};

type RickAndMortyCharacterResponse = {
  id: number;
  name: string;
  status: Character["status"];
  species: string;
  type: string;
  gender: Character["gender"];
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
};

type RickAndMortyCharactersResponse = {
  info: RickAndMortyPageInfo;
  results: RickAndMortyCharacterResponse[];
};

type RickAndMortyEpisodeResponse = {
  id: number;
  name: string;
  air_date: string;
  episode: string;
};

class RickAndMortyApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "RickAndMortyApiError";
  }
}

function buildUrl(
  path: string,
  query?: Record<string, string | number | undefined>
) {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === "") {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function requestJson<T>(
  path: string,
  {
    query,
    signal,
    treat404AsNull = false,
  }: RequestJsonOptions = {}
): Promise<T | null> {
  const response = await fetch(buildUrl(path, query), {
    cache: "no-store",
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (response.status === 404 && treat404AsNull) {
    return null;
  }

  if (!response.ok) {
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const retryHint = retryAfter
        ? ` Please try again in ${retryAfter} seconds.`
        : " Please wait a moment and try again.";

      throw new RickAndMortyApiError(
        `Too Many Requests (429).${retryHint}`,
        response.status
      );
    }

    throw new RickAndMortyApiError(
      `Rick and Morty API request failed with status ${response.status}.`,
      response.status
    );
  }

  return (await response.json()) as T;
}

function getAccentColor(id: number) {
  return CHARACTER_ACCENTS[(id - 1) % CHARACTER_ACCENTS.length];
}

function getPageFromUrl(url: string | null) {
  if (!url) {
    return null;
  }

  const pageValue = new URL(url).searchParams.get("page");

  if (!pageValue) {
    return null;
  }

  const page = Number.parseInt(pageValue, 10);
  return Number.isNaN(page) ? null : page;
}

function mapCharacter(
  character: RickAndMortyCharacterResponse
): Character {
  return {
    id: character.id,
    name: character.name,
    species: character.species,
    gender: character.gender,
    status: character.status,
    type: character.type,
    origin: character.origin.name,
    location: character.location.name,
    imageSrc: character.image,
    accent: getAccentColor(character.id),
    episodeUrls: character.episode,
  };
}

function mapEpisode(episode: RickAndMortyEpisodeResponse): EpisodeSummary {
  return {
    id: String(episode.id),
    code: episode.episode,
    name: episode.name,
    airDate: episode.air_date,
  };
}

export async function getCharacterPage(
  filters: Omit<CharacterFilters, "page">,
  page: number,
  signal?: AbortSignal
): Promise<CharacterDirectory> {
  const response = await requestJson<RickAndMortyCharactersResponse>("/character", {
    signal,
    query: {
      page,
      name: filters.name,
      species: filters.species,
      gender: filters.gender,
      status: filters.status,
    },
    treat404AsNull: true,
  });

  if (!response) {
    return {
      items: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: page,
      nextPage: null,
      hasMore: false,
    };
  }

  return {
    items: response.results.map(mapCharacter),
    totalCount: response.info.count,
    totalPages: response.info.pages,
    currentPage: page,
    nextPage: getPageFromUrl(response.info.next),
    hasMore: Boolean(response.info.next),
  };
}

function getEpisodeIds(episodeUrls: string[]) {
  return episodeUrls
    .map((url) => url.split("/").pop())
    .filter((id): id is string => Boolean(id));
}

async function getEpisodeSummaries(
  episodeUrls: string[],
  signal?: AbortSignal
): Promise<EpisodeSummary[]> {
  const episodeIds = getEpisodeIds(episodeUrls);

  if (episodeIds.length === 0) {
    return [];
  }

  const response = await requestJson<
    RickAndMortyEpisodeResponse | RickAndMortyEpisodeResponse[]
  >(`/episode/${episodeIds.join(",")}`, {
    signal,
  });

  if (!response) {
    return [];
  }

  const episodes = Array.isArray(response) ? response : [response];
  return episodes.map(mapEpisode);
}

export async function getCharacterProfile(
  id: number,
  signal?: AbortSignal
): Promise<CharacterProfile | null> {
  const response = await requestJson<RickAndMortyCharacterResponse>(
    `/character/${id}`,
    {
      signal,
      treat404AsNull: true,
    }
  );

  if (!response) {
    return null;
  }

  const character = mapCharacter(response);
  const episodes = await getEpisodeSummaries(character.episodeUrls, signal);

  return {
    ...character,
    episodes,
  };
}
