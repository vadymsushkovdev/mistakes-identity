export function getWordBoundsAtPosition(str: string, position: number): [number, number] {
    const isSpace = (c: string) => /\s/.exec(c);
    let start = position - 1;
    let end = position;

    while (start >= 0 && !isSpace(str[start])) {
        start -= 1;
    }
    start = Math.max(0, start + 1);

    while (end < str.length && !isSpace(str[end])) {
        end += 1;
    }
    end = Math.max(start, end);

    return [start, end];
}