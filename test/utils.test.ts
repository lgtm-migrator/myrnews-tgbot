import { generateDescription } from '../src/lib/utils';
import type { PostData } from '../src/lib/types';

describe('generateDescription', (): void => {
    it('should generate description from post data', (): void => {
        const data: PostData = {
            id: 1,
            link: 'https://example.test/?p=1',
            title: 'Some title',
            excerpt: 'Excerpt goes here',
        };

        const expected = `<a href="${data.link}">${data.title}</a>\n\n<em>${data.excerpt}</em>`;
        const actual = generateDescription(data);
        expect(actual).toEqual(expected);
    });

    it('should trim long excerpts', (): void => {
        const data: PostData = {
            id: 1,
            link: 'https://example.test/?p=1',
            title: 'Some title',
            excerpt: 'A'.repeat(1000),
        };

        const expected = `<a href="${data.link}">${data.title}</a>\n\n<em>${data.excerpt.slice(0, 950)}…</em>`;
        const actual = generateDescription(data);
        expect(actual).toEqual(expected);
    });

    it('should truncate long titles', (): void => {
        const data: PostData = {
            id: 1,
            link: 'https://example.test/?p=1',
            title: 'A'.repeat(1000),
            excerpt: 'Excerpt goes here',
        };

        const expected = `<a href="${data.link}">${data.title.slice(0, 960)}…</a>`;
        const actual = generateDescription(data);
        expect(actual).toEqual(expected);
    });

    it('should skip long links', (): void => {
        const data: PostData = {
            id: 1,
            link: `https://example.test/?p=${'1'.repeat(1000)}`,
            title: 'Title',
            excerpt: 'Excerpt goes here',
        };

        const expected = data.excerpt;
        const actual = generateDescription(data);
        expect(actual).toEqual(expected);
    });

    it('should skip long links and trim long excerpts', (): void => {
        const data: PostData = {
            id: 1,
            link: `https://example.test/?p=${'1'.repeat(1000)}`,
            title: 'Title',
            excerpt: 'A'.repeat(2000),
        };

        const expected = `${data.excerpt.slice(0, 1000)}…`;
        const actual = generateDescription(data);
        expect(actual).toEqual(expected);
    });

    it('should skip excerpt for long titles', (): void => {
        const data: PostData = {
            id: 1,
            link: `https://example.test/?p=${'1'.repeat(900)}`,
            title: 'Title',
            excerpt: 'Excerpt goes here',
        };

        const expected = `<a href="${data.link}">${data.title}</a>`;
        const actual = generateDescription(data);
        expect(actual).toEqual(expected);
    });
});
