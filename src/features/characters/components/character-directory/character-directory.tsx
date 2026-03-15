"use client";

import { useMemo } from "react";
import { CharacterCardGrid } from "@/features/characters/components/character-grid/character-grid";
import { CharacterFiltersPanel } from "@/features/characters/components/character-filters/character-filters";
import { LoadMoreButton } from "@/features/characters/components/load-more-button/load-more-button";
import { useCharacterDirectory } from "@/features/characters/hooks/use-character-directory";
import {
  buildCharacterListHref,
  characterFilterOptions,
} from "@/features/characters/lib/characters";
import type { CharacterFilters } from "@/features/characters/types/character";

type CharacterDirectoryProps = {
  filters: CharacterFilters;
};

export function CharacterDirectory({ filters }: CharacterDirectoryProps) {
  const { directory, isLoading, isAppending, errorMessage, appendErrorMessage } =
    useCharacterDirectory(filters);
  const isFiltering = isLoading && !isAppending && directory !== null;
  const options = useMemo(() => {
    const species = Array.from(
      new Set(
        (directory?.items ?? [])
          .map((character) => character.species.trim())
          .filter(Boolean)
      )
    ).sort((left, right) => left.localeCompare(right));

    if (filters.species && !species.includes(filters.species)) {
      species.unshift(filters.species);
    }

    return {
      ...characterFilterOptions,
      species,
    };
  }, [directory?.items, filters.species]);

  return (
    <>
      <CharacterFiltersPanel
        initialFilters={filters}
        options={options}
        isSearching={isFiltering}
      />
      <CharacterCardGrid
        characters={directory?.items ?? []}
        isLoading={isLoading}
        isRefreshing={isFiltering}
        errorMessage={errorMessage}
      />
      {!isFiltering ? (
        <LoadMoreButton
          href={
            directory?.hasMore && directory.nextPage
              ? buildCharacterListHref(filters, directory.nextPage)
              : undefined
          }
          isLoading={isAppending}
          errorMessage={appendErrorMessage}
        />
      ) : null}
    </>
  );
}
