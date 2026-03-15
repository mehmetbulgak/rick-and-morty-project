"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type {
  CharacterFilterOptions,
  CharacterFilters,
} from "@/features/characters/types/character";
import { ChevronDownIcon, CloseIcon, FilterIcon, SearchIcon } from "@/shared/icons";
import styles from "./character-filters.module.css";

type CharacterFiltersPanelProps = {
  initialFilters: CharacterFilters;
  options: CharacterFilterOptions;
  isSearching?: boolean;
};

export function CharacterFiltersPanel({
  initialFilters,
  options,
  isSearching = false,
}: CharacterFiltersPanelProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialFilters.name);
  const [species, setSpecies] = useState(initialFilters.species);
  const [gender, setGender] = useState(initialFilters.gender);
  const [status, setStatus] = useState(initialFilters.status);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [draftSpecies, setDraftSpecies] = useState(initialFilters.species);
  const [draftGender, setDraftGender] = useState(initialFilters.gender);
  const [draftStatus, setDraftStatus] = useState(initialFilters.status);
  const advancedButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalFirstSelectRef = useRef<HTMLSelectElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);
  const skipNextAutoApplyRef = useRef(false);
  const submittedNameRef = useRef(initialFilters.name);
  const speciesOptions = species
    ? Array.from(new Set([species, ...options.species]))
    : options.species;
  const appliedFilters = useMemo(
    () => ({
      name: initialFilters.name.trim(),
      species: initialFilters.species.trim(),
      gender: initialFilters.gender,
      status: initialFilters.status,
    }),
    [
      initialFilters.gender,
      initialFilters.name,
      initialFilters.species,
      initialFilters.status,
    ]
  );
  const hasAppliedFilters =
    appliedFilters.name.length > 0 ||
    appliedFilters.species.length > 0 ||
    appliedFilters.gender.length > 0 ||
    appliedFilters.status.length > 0;
  const isBusy = isPending || isSearching;

  const restoreAdvancedButtonFocus = useCallback(() => {
    window.requestAnimationFrame(() => {
      const button = advancedButtonRef.current;
      if (!button || button.offsetParent === null) {
        return;
      }

      button.focus();
    });
  }, []);

  function handleClearFilters() {
    skipNextAutoApplyRef.current = true;
    submittedNameRef.current = "";
    setIsAdvancedOpen(false);
    setName("");
    setSpecies("");
    setGender("");
    setStatus("");
    setDraftSpecies("");
    setDraftGender("");
    setDraftStatus("");

    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });

    restoreAdvancedButtonFocus();
  }

  const closeAdvancedFilters = useCallback(() => {
    setIsAdvancedOpen(false);
    restoreAdvancedButtonFocus();
  }, [restoreAdvancedButtonFocus]);

  function openAdvancedFilters() {
    setDraftSpecies(species);
    setDraftGender(gender);
    setDraftStatus(status);
    setIsAdvancedOpen(true);
  }

  const applyFilters = useCallback(
    (nextFilters: {
      name: string;
      species: string;
      gender: string;
      status: string;
    }) => {
      const params = new URLSearchParams();
      const sanitizedName = nextFilters.name.trim();
      const sanitizedSpecies = nextFilters.species.trim();

      if (sanitizedName) {
        params.set("name", sanitizedName);
      }

      if (sanitizedSpecies) {
        params.set("species", sanitizedSpecies);
      }

      if (nextFilters.gender) {
        params.set("gender", nextFilters.gender);
      }

      if (nextFilters.status) {
        params.set("status", nextFilters.status);
      }

      const href = params.size > 0 ? `${pathname}?${params.toString()}` : pathname;

      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [pathname, router, startTransition]
  );

  useEffect(() => {
    setName(initialFilters.name);
    setSpecies(initialFilters.species);
    setGender(initialFilters.gender);
    setStatus(initialFilters.status);
    submittedNameRef.current = initialFilters.name;
  }, [
    initialFilters.gender,
    initialFilters.name,
    initialFilters.species,
    initialFilters.status,
  ]);

  useEffect(() => {
    if (!isAdvancedOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const raf = window.requestAnimationFrame(() => {
      modalFirstSelectRef.current?.focus();
    });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAdvancedFilters();
      }

      if (event.key !== "Tab") {
        return;
      }

      const modalNode = modalRef.current;
      if (!modalNode) {
        return;
      }

      const focusable = Array.from(
        modalNode.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => {
        if (element.getAttribute("aria-hidden") === "true") {
          return false;
        }

        if (element instanceof HTMLButtonElement && element.disabled) {
          return false;
        }

        if (
          element instanceof HTMLInputElement ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement
        ) {
          if (element.disabled) {
            return false;
          }
        }

        return element.offsetParent !== null;
      });

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!active || !modalNode.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey) {
        if (active === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeAdvancedFilters, isAdvancedOpen]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (skipNextAutoApplyRef.current) {
      skipNextAutoApplyRef.current = false;
      return;
    }

    applyFilters({
      name: submittedNameRef.current,
      species,
      gender,
      status,
    });
  }, [applyFilters, gender, species, status]);

  return (
    <>
      <form
        className={styles.form}
        role="search"
        aria-label="Filter characters"
        aria-busy={isBusy}
        onSubmit={(event) => {
          event.preventDefault();
          submittedNameRef.current = name.trim();
          applyFilters({
            name: submittedNameRef.current,
            species,
            gender,
            status,
          });
        }}
      >
        <label className={styles.searchField}>
          <span className="sr-only">Filter by character name</span>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="search"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Filter by name..."
            className={styles.input}
            autoComplete="off"
          />
        </label>

          <button
            type="button"
            className={styles.advancedButton}
            ref={advancedButtonRef}
            onClick={openAdvancedFilters}
            disabled={isBusy}
            aria-haspopup="dialog"
          >
            <FilterIcon className={styles.advancedIcon} />
            <span>Advanced Filters</span>
          </button>

        <label className={styles.selectFieldDesktop}>
          <span className="sr-only">Filter by species</span>
          <select
            name="species"
            value={species}
            onChange={(event) => setSpecies(event.target.value)}
            className={styles.select}
          >
            <option value="">Species</option>
            {speciesOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDownIcon className={styles.chevron} />
        </label>

        <label className={styles.selectFieldDesktop}>
          <span className="sr-only">Filter by gender</span>
          <select
            name="gender"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            className={styles.select}
          >
            <option value="">Gender</option>
            {options.genders.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDownIcon className={styles.chevron} />
        </label>

        <label className={styles.selectFieldDesktop}>
          <span className="sr-only">Filter by status</span>
          <select
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className={styles.select}
          >
            <option value="">Status</option>
            {options.statuses.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDownIcon className={styles.chevron} />
        </label>

      </form>

      {hasAppliedFilters ? (
        <div className={styles.chipRow} aria-label="Active filters">
          {appliedFilters.name ? (
            <button
              type="button"
              className={styles.chip}
              disabled={isBusy}
              onClick={() => {
                submittedNameRef.current = "";
                setName("");
                applyFilters({
                  ...appliedFilters,
                  name: "",
                });
              }}
            >
              <span className={styles.chipLabel}>Name: {appliedFilters.name}</span>
              <CloseIcon className={styles.chipIcon} />
            </button>
          ) : null}
          {appliedFilters.species ? (
            <button
              type="button"
              className={styles.chip}
              disabled={isBusy}
              onClick={() => {
                setSpecies("");
                setDraftSpecies("");
                applyFilters({
                  ...appliedFilters,
                  species: "",
                });
              }}
            >
              <span className={styles.chipLabel}>
                Species: {appliedFilters.species}
              </span>
              <CloseIcon className={styles.chipIcon} />
            </button>
          ) : null}
          {appliedFilters.gender ? (
            <button
              type="button"
              className={styles.chip}
              disabled={isBusy}
              onClick={() => {
                setGender("");
                setDraftGender("");
                applyFilters({
                  ...appliedFilters,
                  gender: "",
                });
              }}
            >
              <span className={styles.chipLabel}>
                Gender: {appliedFilters.gender}
              </span>
              <CloseIcon className={styles.chipIcon} />
            </button>
          ) : null}
          {appliedFilters.status ? (
            <button
              type="button"
              className={styles.chip}
              disabled={isBusy}
              onClick={() => {
                setStatus("");
                setDraftStatus("");
                applyFilters({
                  ...appliedFilters,
                  status: "",
                });
              }}
            >
              <span className={styles.chipLabel}>
                Status: {appliedFilters.status}
              </span>
              <CloseIcon className={styles.chipIcon} />
            </button>
          ) : null}
          <button
            type="button"
            className={styles.chipClearAll}
            disabled={isBusy}
            onClick={handleClearFilters}
          >
            Clear all
          </button>
        </div>
      ) : null}

      {isAdvancedOpen ? (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="advanced-filters-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAdvancedFilters();
            }
          }}
        >
          <div
            className={styles.modal}
            ref={modalRef}
            tabIndex={-1}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle} id="advanced-filters-title">
                Filters
              </h2>
              <button
                type="button"
                className={styles.modalClose}
                onClick={closeAdvancedFilters}
                aria-label="Close filters"
              >
                <CloseIcon className={styles.modalCloseIcon} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <label className={styles.modalField}>
                <span className="sr-only">Filter by species</span>
                <select
                  ref={modalFirstSelectRef}
                  name="species"
                  value={draftSpecies}
                  onChange={(event) => setDraftSpecies(event.target.value)}
                  className={styles.select}
                >
                  <option value="">Species</option>
                  {speciesOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className={styles.chevron} />
              </label>

              <label className={styles.modalField}>
                <span className="sr-only">Filter by gender</span>
                <select
                  name="gender"
                  value={draftGender}
                  onChange={(event) => setDraftGender(event.target.value)}
                  className={styles.select}
                >
                  <option value="">Gender</option>
                  {options.genders.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className={styles.chevron} />
              </label>

              <label className={styles.modalField}>
                <span className="sr-only">Filter by status</span>
                <select
                  name="status"
                  value={draftStatus}
                  onChange={(event) => setDraftStatus(event.target.value)}
                  className={styles.select}
                >
                  <option value="">Status</option>
                  {options.statuses.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className={styles.chevron} />
              </label>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.applyButton}
                disabled={isBusy}
                onClick={() => {
                  closeAdvancedFilters();
                  setSpecies(draftSpecies);
                  setGender(draftGender);
                  setStatus(draftStatus);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
