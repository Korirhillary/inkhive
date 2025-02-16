import DOMPurify from "dompurify";

export function cleanContent(content: string): string {
  return DOMPurify.sanitize(content);
}
