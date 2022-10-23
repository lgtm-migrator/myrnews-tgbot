import type { PostData } from '../lib/types';

export function generateDescription({ link, title, excerpt }: PostData): string {
    const a = `<a href="${link}">${title}</a>`;
    if (a.length > 1000) {
        const base = `<a href="${link}"></a>`;
        const remLen = 1000 - base.length;
        if (remLen <= 50) {
            const description = excerpt.slice(0, 1000);
            const ellipsis = description === excerpt ? '' : '…';
            return `${description}${ellipsis}`;
        }

        const t = title.slice(0, remLen);
        return `<a href="${link}">${t}…</a>`;
    }

    const len = 1000 - a.length;
    if (len >= 100) {
        const description = excerpt.slice(0, len);
        const ellipsis = description === excerpt ? '' : '…';
        return `${a}\n\n<em>${description}${ellipsis}</em>`;
    }

    return a;
}
