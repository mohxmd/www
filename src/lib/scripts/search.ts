function simplifyDate() {}

interface Post {
  slug: string;
  image?: string;
  title: string;
  description: string;
  pubDate: string;
  readingTime: number;
  tags: string[];
}

document.addEventListener("astro:page-load", () => {
  const executeSearch = async (search: string, activeTags: string[]): Promise<Post[]> => {
    const searchQuery = search.toLowerCase().trim();

    const response = await fetch("/api/blog/search.json");
    const searchData: Post[] = await response.json();

    const filteredPosts = searchData.filter((post) => {
      const isVisible =
        (searchQuery === "" ||
          post.title.toLowerCase().includes(searchQuery) ||
          post.description.toLowerCase().includes(searchQuery)) &&
        (activeTags.length === 0 || activeTags.some((tag) => post.tags.includes(tag)));

      return isVisible;
    });

    if (searchQuery === "" && activeTags.length === 0) {
      return [];
    }

    return filteredPosts;
  };

  const searchFilter = document.querySelector("[data-post-filter-search]") as HTMLInputElement;
  const tagsFilter = document.querySelector("[data-post-filter-tags]") as HTMLElement;
  const staticPosts = document.querySelector("[data-static-posts]") as HTMLElement;
  const searchedPosts = document.querySelector("[data-searched-posts]") as HTMLElement;

  const activeTags: string[] = [];

  searchFilter.oninput = () => requestSearch();

  tagsFilter.querySelectorAll("input").forEach((tag) => {
    if (tag instanceof HTMLInputElement) {
      tag.onchange = () => {
        if (tag.checked) {
          activeTags.push(tag.value);
        } else {
          const index = activeTags.indexOf(tag.value);
          if (index !== -1) {
            activeTags.splice(index, 1);
          }
        }
        requestSearch();
      };
    }
  });

  async function requestSearch(): Promise<void> {
    const payload = await executeSearch(searchFilter.value, Array.from(activeTags));

    searchedPosts.innerHTML = "";

    if (payload.length) {
      staticPosts.classList.add("hidden");
      searchedPosts.classList.remove("hidden");
    } else {
      staticPosts.classList.remove("hidden");
      searchedPosts.classList.add("hidden");
    }

    payload.forEach((post) => {
      const { image, title, description, pubDate, readingTime } = post;

      searchedPosts.innerHTML += `
			<article class="post-card">
				<a href="/blog/${post.slug}" aria-label="${title}. ${description}">
					${
            image && image !== ""
              ? `
					<div class="post-card__thumbnail-container">
						<img src="${image}" alt="${title}" />
					</div>
					`
              : ""
          }

					<div class="post-card__body">
						<h2 class="title">${title}</h2>

						<p class="body-text">${description}</p>

						<div class="white-space"></div>

						<hr class="post-card__border" />

						<div class="meta">
							<div class="date">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									stroke-width="2"
									width="14"
									height="14"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									fill="none"
									viewBox="0 0 24 24"
									class="shrink-0"
									aria-hidden="true"
									data-astro-source-loc="23:17"
								>
									<path d="M8 2v4" data-astro-source-loc="7:3"></path>
									<path d="M16 2v4" data-astro-source-loc="8:3"></path>
									<rect
										width="18"
										height="18"
										x="3"
										y="4"
										rx="2"
										data-astro-source-loc="9:3"
									></rect>
									<path d="M3 10h18" data-astro-source-loc="10:3"></path>
								</svg>
								<time datetime="${pubDate}"
									>${simplifyDate(pubDate).simplifiedDate}</time
								>
							</div>

							<div class="read">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									stroke-width="2"
									width="14"
									height="14"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									fill="none"
									viewBox="0 0 24 24"
									class="shrink-0"
									aria-hidden="true"
									data-astro-source-loc="23:17"
								>
									<circle
										cx="12"
										cy="12"
										r="10"
										data-astro-source-loc="7:3"
									></circle>
									<polyline
										points="12 6 12 12 16 14"
										data-astro-source-loc="8:3"
									></polyline>
								</svg>
								<span>${readingTime} Min Read</span>
							</div>
						</div>
					</div>
				</a>
			</article>

    `;
    });
  }
});
