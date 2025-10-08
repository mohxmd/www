/* eslint-disable no-console */
import { formatDate } from "../utils";

// Configuration
const CONFIG = {
  API_URL: "/blog/blog.json",
  DEBOUNCE_DELAY: 300,
  MAX_TITLE_LENGTH: 60,
  MAX_DESCRIPTION_LENGTH: 80,
  SEARCH_FIELDS: ["title", "description", "tags"] as const,
} as const;

type Post = {
  slug: string;
  image?: string;
  title: string;
  description: string;
  pubDate: string;
  readingTime: number;
  tags: string[];
};

// Debounce utility
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Truncate text helper
const truncate = (text: string, max: number) =>
  text.length > max ? text.substring(0, max) + "..." : text;

// Card update functions
const updateCard = {
  links: (el: HTMLElement, slug: string) =>
    el.querySelectorAll("a").forEach((a) => a.setAttribute("href", `/blog/${slug}`)),

  image: (el: HTMLElement, src: string, alt: string) => {
    const img = el.querySelector("img");
    if (img) {
      img.src = src || "";
      img.alt = alt;
    }
  },

  title: (el: HTMLElement, text: string) => {
    const link = el.querySelector("h3 a");
    if (link) link.textContent = truncate(text, CONFIG.MAX_TITLE_LENGTH);
  },

  description: (el: HTMLElement, text: string) => {
    const p = el.querySelector("p.text-muted-foreground");
    if (p) p.textContent = truncate(text, CONFIG.MAX_DESCRIPTION_LENGTH);
  },

  date: (el: HTMLElement, date: string) => {
    const span = el.querySelector('[aria-label="calendar"]')?.nextElementSibling;
    if (span) span.textContent = formatDate(date);
  },

  readingTime: (el: HTMLElement, time: number) => {
    const span = el.querySelector('[aria-label="timer"]')?.nextElementSibling;
    if (span) span.textContent = time.toString();
  },
};

document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  const $ = {
    search: document.querySelector("[data-post-filter-search]") as HTMLInputElement,
    tags: document.querySelector("[data-post-filter-tags]") as HTMLElement,
    static: document.querySelector("[data-static-posts]") as HTMLElement,
    results: document.querySelector("[data-searched-posts]") as HTMLElement,
    noResults: document.querySelector("[data-no-posts-found]") as HTMLElement,
    template: document.querySelector("[data-template-card]") as HTMLTemplateElement,
  };

  // Safety check
  if (!$.search || !$.static || !$.results || !$.template) {
    console.error("Search: Required elements not found", $);
    return;
  }

  // Get the first article from template
  const templateCard = $.template.content.querySelector("article");

  if (!templateCard) {
    console.error("Search: Template card not found");
    return;
  }

  const activeTags: string[] = [];
  let postsCache: Post[] = [];

  // Fetch and cache posts
  const getPosts = async (): Promise<Post[]> => {
    if (postsCache.length > 0) return postsCache;
    const res = await fetch(CONFIG.API_URL);
    postsCache = await res.json();
    return postsCache;
  };

  // Search posts
  const searchPosts = async (query: string, tags: string[]): Promise<Post[]> => {
    if (!query && tags.length === 0) return [];

    const posts = await getPosts();
    const q = query.toLowerCase().trim();

    return posts.filter((post) => {
      // Check search query across configured fields
      const matchesQuery =
        !q ||
        CONFIG.SEARCH_FIELDS.some((field) => {
          const value = post[field];
          if (Array.isArray(value)) {
            return value.some((v) => v.toLowerCase().includes(q));
          }
          return String(value).toLowerCase().includes(q);
        });

      // Check tags filter
      const matchesTags = tags.length === 0 || tags.some((tag) => post.tags.includes(tag));

      return matchesQuery && matchesTags;
    });
  };

  // Create post card from template
  const createCard = (post: Post): HTMLElement => {
    const card = templateCard.cloneNode(true) as HTMLElement;

    updateCard.links(card, post.slug);
    updateCard.image(card, post.image || "", post.title);
    updateCard.title(card, post.title);
    updateCard.description(card, post.description);
    updateCard.date(card, post.pubDate);
    updateCard.readingTime(card, post.readingTime);

    return card;
  };

  // Render results
  const render = (posts: Post[]) => {
    const fragment = document.createDocumentFragment();
    posts.forEach((post) => fragment.appendChild(createCard(post)));
    $.results.innerHTML = "";
    $.results.appendChild(fragment);
  };

  // Toggle views
  const toggle = (state: "results" | "empty" | "default") => {
    $.static.classList.toggle("hidden", state !== "default");
    $.results.classList.toggle("hidden", state !== "results");
    $.results.classList.toggle("grid", state === "results");
    $.noResults?.classList.toggle("hidden", state !== "empty");
  };

  // Main search handler
  const handleSearch = async () => {
    const results = await searchPosts($.search.value, activeTags);
    const isSearching = $.search.value || activeTags.length > 0;

    if (results.length > 0) {
      render(results);
      toggle("results");
    } else if (isSearching) {
      toggle("empty");
    } else {
      toggle("default");
    }
  };

  // Debounced search
  const debouncedSearch = debounce(handleSearch, CONFIG.DEBOUNCE_DELAY);

  // Event: Search input
  $.search.addEventListener("input", debouncedSearch);

  // Event: Tag filters
  $.tags?.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      const idx = activeTags.indexOf(target.value);

      if (target.checked && idx === -1) {
        activeTags.push(target.value);
      } else if (!target.checked && idx !== -1) {
        activeTags.splice(idx, 1);
      }

      handleSearch(); // Instant for tags
    });
  });
});
