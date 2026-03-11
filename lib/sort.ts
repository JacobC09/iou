type Options = {
    caseSensitive?: boolean; 
    allWords?: boolean; 
    fuzzy?: boolean;
};

export function searchArray(
    arr: string[],
    query: string,
    options: Options = {}
): string[] {
    const { caseSensitive = false, allWords = true, fuzzy = true } = options;

    const normalize = (str: string) => caseSensitive ? str : str.toLowerCase();

    const queryWords = normalize(query).split(/\s+/).filter(Boolean);

    const levenshtein = (a: string, b: string): number => {
        const dp: number[][] = Array(a.length + 1)
            .fill(0)
            .map(() => Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) dp[i][0] = i;
        for (let j = 0; j <= b.length; j++) dp[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                dp[i][j] =
                    a[i - 1] === b[j - 1]
                        ? dp[i - 1][j - 1]
                        : 1 + Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]);
            }
        }
        return dp[a.length][b.length];
    };

    return arr.filter((str) => {
        const normalizedStr = normalize(str);

        if (fuzzy) {
            return queryWords.every((word) =>
                normalizedStr
                    .split(/\s+/)
                    .some((token) => levenshtein(token, word) <= 1)
            );
        }

        if (allWords) {
            return queryWords.every((word) => normalizedStr.includes(word));
        } else {
            return queryWords.some((word) => normalizedStr.includes(word));
        }
    });
}
