const slugPattern = /^mona-[0-9a-zA-Z]{4,6}$/;

/**
 * @param {unknown} value
 * @returns {string | null}
 */
export function normalizeUrl(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const explicitScheme = /^([a-z][a-z\d+.-]*):\/\//i.exec(trimmed);
  if (explicitScheme && !['http', 'https'].includes(explicitScheme[1].toLowerCase())) {
    return null;
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if ((url.protocol === 'http:' || url.protocol === 'https:') && url.hostname) {
      return url.href;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * @typedef {{ url: string; slug: string }} Bookmark
 */

/**
 * @param {unknown} value
 * @returns {Bookmark | null}
 */
function validateBookmark(value) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const bookmark = /** @type {{ url?: unknown; slug?: unknown }} */ (value);
  const url = normalizeUrl(bookmark.url);
  if (!url || typeof bookmark.slug !== 'string' || !slugPattern.test(bookmark.slug)) {
    return null;
  }

  return { url, slug: bookmark.slug };
}

/**
 * @param {string | null} serialized
 * @returns {Bookmark[]}
 */
export function loadBookmarks(serialized) {
  if (typeof serialized !== 'string' || serialized.length === 0) {
    return [];
  }

  try {
    const parsed = JSON.parse(serialized);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(validateBookmark).filter((bookmark) => bookmark !== null);
  } catch {
    return [];
  }
}

/**
 * @param {Bookmark} bookmark
 * @returns {string}
 */
export function formatBookmark(bookmark) {
  return `${bookmark.url} :: ${bookmark.slug}`;
}
