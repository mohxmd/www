export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const sortByDate = (posts) => {
  return posts.sort(
    (a, b) =>
      new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf(),
  );
};

export const nonDraftPosts = (posts) => {
  return posts.filter((post) => !post.data.draft);
};

export const simplifyDate = (date) => {
  const dateObj = new Date(date);

  const simplifiedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const simplifiedTime = dateObj.toLocaleTimeString("en-US", {
    timeStyle: "short",
  });

  return { simplifiedDate, simplifiedTime };
};

// export function markdownToPlainText(markdownContent) {
// 	// Remove headings
// 	markdownContent = markdownContent.replace(/^#+\s+(.*)$/gm, "$1\n")

// 	// Remove bold and italic markers
// 	markdownContent = markdownContent.replace(
// 		/\*\*(.*?)\*\*|__(.*?)__/g,
// 		"$1$2"
// 	)
// 	markdownContent = markdownContent.replace(/\*(.*?)\*|_(.*?)_/g, "$1$2")

// 	// Remove code blocks and inline code
// 	markdownContent = markdownContent.replace(/```.*?```/gs, "")
// 	markdownContent = markdownContent.replace(/`([^`]+)`/g, "$1")

// 	// Remove unordered and ordered list markers
// 	markdownContent = markdownContent.replace(/^\s*[-*+]\s+(.*)$/gm, "$1\n")
// 	markdownContent = markdownContent.replace(/^\s*\d+\.\s+(.*)$/gm, "$1\n")

// 	// Remove blockquote
// 	markdownContent = markdownContent.replace(/^\s*>.*$/gm, "")

// 	// Remove horizontal rules
// 	markdownContent = markdownContent.replace(/^\s*[-*_]{3,}\s*$/gm, "")

// 	return markdownContent.trim()
// }

export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
