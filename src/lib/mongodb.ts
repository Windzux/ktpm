import { MongoClient, ClientSession } from 'mongodb';

export { Db as MongoDB, MongoError } from 'mongodb';

export const enum MongoErrorCodes {
    Duplicate = 11000
}

function RenameOne<T, U>(doc: T, from: string, to: string) {
    if (!doc) {
        return null;
    }
    const obj: U = {} as any;
    for (const [k, v] of Object.entries(doc)) {
        if (k === from) {
            obj[to] = v;
        } else {
            obj[k] = v;
        }
    }
    return obj;
}

function RenameArray<T, U>(docs: T[], from: string, to: string) {
    if (!docs) {
        return [];
    }
    const res: U[] = [];
    for (const d of docs) {
        res.push(RenameOne<T, U>(d, from, to));
    }
    return res;
}

export type MongoModel<T> = Pick<T, Exclude<keyof T, 'id'>> & { _id: string };

export const ToMongoData = {
    Many<T>(docs: T[]) {
        return RenameArray<T, MongoModel<T>>(docs, 'id', '_id');
    },
    One<T>(doc: T) {
        return RenameOne<T, MongoModel<T>>(doc, 'id', '_id');
    }
}

export const FromMongoData = {
    Many<T>(docs: MongoModel<T>[]) {
        return RenameArray<MongoModel<T>, T>(docs, '_id', 'id');
    },
    One<T>(doc: MongoModel<T>) {
        return RenameOne<MongoModel<T>, T>(doc, '_id', 'id');
    }
}

async function Connect(url: string) {
    const client = new MongoClient(url);
    await client.connect();
    return client;
}

const sessionSymbol = Symbol('session');

export const MongoCommon = {
    Connect,
    WithSession<T>(ctx: T, session: ClientSession) {
        ctx[sessionSymbol] = session;
        return ctx;
    },
    Session(ctx: any) {
        return ctx[sessionSymbol] as ClientSession;
    }
}