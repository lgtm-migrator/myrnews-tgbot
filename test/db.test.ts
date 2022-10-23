import path from 'path';
import knex, { Knex } from 'knex';
import { buildKnexConfig } from '../src/knexfile';
import type { Post } from '../src/lib/types';
import { addPost, checkPostExists } from '../src/lib/db';

const db = knex(buildKnexConfig());

beforeAll(
    (): Promise<unknown> =>
        db.migrate
            .latest({ directory: path.join(__dirname, 'migrations') })
            .then((): Promise<unknown> => db.seed.run({ directory: path.join(__dirname, 'seeds') })),
);

afterAll(() => db.destroy());

describe('addPost()', (): void => {
    let trx: Knex.Transaction;

    beforeEach(async (): Promise<void> => {
        trx = await db.transaction();
    });

    it('should insert a new row', async (): Promise<unknown> => {
        await addPost(trx, 1);
        return expect(
            trx.select<Post>('post_id').from('posts').where('post_id', 1).first(),
        ).resolves.not.toBeUndefined();
    });

    afterEach((): Promise<unknown> => trx.rollback());
});

describe('checkPostExists()', (): void => {
    it('should return true when the post exists', (): Promise<unknown> => {
        return expect(checkPostExists(db, 43045)).resolves.toBe(true);
    });

    it('should return false when the post does not exist', (): Promise<unknown> => {
        return expect(checkPostExists(db, 0)).resolves.toBe(false);
    });
});
