import sanitizeHtml from "sanitize-html";

const allowedTextTags = ["p", "br", "strong", "em", "ul", "ol", "li", "code", "pre", "blockquote"];

export function sanitizeRichText(input: string): string {
  return sanitizeHtml(input.trim(), {
    allowedTags: allowedTextTags,
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  });
}

export function sanitizePlainText(input: string): string {
  return sanitizeHtml(input.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });
}
