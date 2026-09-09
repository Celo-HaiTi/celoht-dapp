import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  detectInitialLanguage,
  isLanguage,
  languageFromLocale,
  readStoredLanguage,
} from "../lib/i18n/runtime.mjs";

function storageWith(value) {
  return { getItem: () => value };
}

test("defaults to Kreyòl when there is no preference", () => {
  assert.equal(DEFAULT_LANGUAGE, "ht");
  assert.equal(detectInitialLanguage(undefined, []), "ht");
});

test("validates supported language values", () => {
  assert.equal(isLanguage("ht"), true);
  assert.equal(isLanguage("en"), true);
  assert.equal(isLanguage("fr"), true);
  assert.equal(isLanguage("es"), true);
  assert.equal(isLanguage("de"), false);
  assert.equal(isLanguage("English"), false);
});

test("maps browser locale variants", () => {
  assert.equal(languageFromLocale("ht-HT"), "ht");
  assert.equal(languageFromLocale("en-US"), "en");
  assert.equal(languageFromLocale("fr-CA"), "fr");
  assert.equal(languageFromLocale("es-DO"), "es");
});

test("stored language has priority over browser locale", () => {
  assert.equal(readStoredLanguage(storageWith("fr")), "fr");
  assert.equal(detectInitialLanguage(storageWith("es"), ["en-US"]), "es");
  assert.equal(detectInitialLanguage(storageWith("invalid"), ["en-US"]), "ht");
});

test("uses the stable storage key", () => {
  assert.equal(LANGUAGE_STORAGE_KEY, "celoht.language");
});