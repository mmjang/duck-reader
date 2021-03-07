export function bracketToBoldTag(str: string) {
  return str.replace(/\[\[(.+?)\]\]/g, "<b>$1</b>");
}
export function maskWord(word: string) {
  return word.replace(/\S/g, "*");
}
export function maskBold(str: string) {
  return str.replace(
    /<b>(.+?)<\/b>/g,
    (substring: string, ...args: any[]): string => {
      return maskWord(args[0]);
    }
  );
}
