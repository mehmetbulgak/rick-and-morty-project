"use client";

import { useEffect, useState } from "react";
import { getCharacterProfile } from "@/features/characters/api/characters";
import type { CharacterProfile } from "@/features/characters/types/character";

type UseCharacterProfileResult = {
  profile: CharacterProfile | null;
  isLoading: boolean;
  errorMessage: string | null;
  isNotFound: boolean;
};

export function useCharacterProfile(id: number): UseCharacterProfileResult {
  const [profile, setProfile] = useState<CharacterProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setProfile(null);
      setIsLoading(false);
      setErrorMessage(null);
      setIsNotFound(true);
      return;
    }

    const controller = new AbortController();

    async function run() {
      setIsLoading(true);
      setErrorMessage(null);
      setIsNotFound(false);

      try {
        const nextProfile = await getCharacterProfile(id, controller.signal);

        if (!nextProfile) {
          setProfile(null);
          setIsNotFound(true);
          return;
        }

        setProfile(nextProfile);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load character details."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    run();

    return () => {
      controller.abort();
    };
  }, [id]);

  return {
    profile,
    isLoading,
    errorMessage,
    isNotFound,
  };
}
