import { Knex, knex } from 'knex';
import { buildKnexConfig } from '../knexfile';
import type { Post } from '../lib/types';

let database: Knex | undefined = undefined;

export function getDB(): Knex {
    if (database === undefined) {
        database = knex(buildKnexConfig());
    }

    return database;
}

export function addPost(db: Knex, postId: number): Promise<number[]> {
    return db<Post>('posts').insert({ post_id: postId });
}

export async function checkPostExists(db: Knex, postId: number): Promise<boolean> {
    const res = await db.select<Post>('post_id').from('posts').where('post_id', postId).first();
    return res !== undefined;
}
