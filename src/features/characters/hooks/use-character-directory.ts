"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCharacterPage } from "@/features/characters/api/characters";
import { buildCharacterListHref } from "@/features/characters/lib/characters";
import type {
  Character,
  CharacterDirectory,
  CharacterFilters,
} from "@/features/characters/types/character";

type UseCharacterDirectoryResult = {
  directory: CharacterDirectory | null;
  isLoading: boolean;
  isAppending: boolean;
  errorMessage: string | null;
  appendErrorMessage: string | null;
};

function mergeCharacters(
  current: Character[],
  incoming: Character[]
) {
  const next = [...current];
  const seenIds = new Set(current.map((character) => character.id));

  for (const character of incoming) {
    if (!seenIds.has(character.id)) {
      next.push(character);
      seenIds.add(character.id);
    }
  }

  return next;
}

export function useCharacterDirectory(
  filters: CharacterFilters
): UseCharacterDirectoryResult {
  const router = useRouter();
  const [directory, setDirectory] = useState<CharacterDirectory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppending, setIsAppending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [appendErrorMessage, setAppendErrorMessage] = useState<string | null>(
    null
  );
  const previousFilterKeyRef = useRef<string | null>(null);
  const directoryRef = useRef<CharacterDirectory | null>(null);
  const filterKey = useMemo(
    () =>
      JSON.stringify({
        name: filters.name,
        species: filters.species,
        gender: filters.gender,
        status: filters.status,
      }),
    [filters.gender, filters.name, filters.species, filters.status]
  );

  useEffect(() => {
    directoryRef.current = directory;
  }, [directory]);

  useEffect(() => {
    const controller = new AbortController();
    const sameFilterSet = previousFilterKeyRef.current === filterKey;
    const currentDirectory = directoryRef.current;

    if (
      sameFilterSet &&
      currentDirectory !== null &&
      filters.page <= currentDirectory.currentPage
    ) {
      return () => {
        controller.abort();
      };
    }

    async function run() {
      setIsLoading(true);
      setErrorMessage(null);
      setAppendErrorMessage(null);

      try {
        const shouldAppendSinglePage =
          sameFilterSet &&
          currentDirectory !== null &&
          filters.page === currentDirectory.currentPage + 1 &&
          currentDirectory.nextPage === filters.page;

        setIsAppending(shouldAppendSinglePage);

        if (shouldAppendSinglePage) {
          const nextPage = await getCharacterPage(
            {
              name: filters.name.trim(),
              species: filters.species.trim(),
              gender: filters.gender,
              status: filters.status,
            },
            filters.page,
            controller.signal
          );

          setDirectory((previousDirectory) => {
            if (!previousDirectory) {
              return nextPage;
            }

            return {
              ...nextPage,
              items: mergeCharacters(previousDirectory.items, nextPage.items),
            };
          });
        } else {
          const requestedPages = Array.from(
            { length: Math.max(filters.page, 1) },
            (_, index) => index + 1
          );

          const pages = await Promise.all(
            requestedPages.map((page) =>
              getCharacterPage(
                {
                  name: filters.name.trim(),
                  species: filters.species.trim(),
                  gender: filters.gender,
                  status: filters.status,
                },
                page,
                controller.signal
              )
            )
          );

          const lastPage = pages[pages.length - 1] ?? {
            items: [],
            totalCount: 0,
            totalPages: 1,
            currentPage: 1,
            nextPage: null,
            hasMore: false,
          };

          setDirectory({
            ...lastPage,
            items: pages.flatMap((page) => page.items),
          });
        }

        previousFilterKeyRef.current = filterKey;
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "Unable to load characters.";

        if (
          sameFilterSet &&
          currentDirectory !== null &&
          filters.page > currentDirectory.currentPage
        ) {
          router.replace(
            buildCharacterListHref(
              {
                name: filters.name,
                species: filters.species,
                gender: filters.gender,
                status: filters.status,
                page: filters.page,
              },
              currentDirectory.currentPage
            ),
            { scroll: false }
          );

          setAppendErrorMessage(message);
        }

        setErrorMessage(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsAppending(false);
          setIsLoading(false);
        }
      }
    }

    run();

    return () => {
      controller.abort();
    };
  }, [
    filterKey,
    filters.gender,
    filters.name,
    filters.page,
    filters.species,
    filters.status,
    router,
  ]);

  return {
    directory,
    isLoading,
    isAppending,
    errorMessage,
    appendErrorMessage,
  };
}
