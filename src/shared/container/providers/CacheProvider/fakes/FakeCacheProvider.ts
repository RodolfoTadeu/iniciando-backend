import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
    [Key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
    private cache: ICacheData = {};

    public async save(Key: string, value: any): Promise<void> {
        this.cache[Key] = JSON.stringify(value);
    }

    public async recover<T>(Key: string): Promise<T | null> {
        const data = this.cache[Key];

        if (!data) {
            return null;
        }

        const parsedData = JSON.parse(data) as T;

        return parsedData;
    }

    public async invalidate(Key: string): Promise<void> {
        delete this.cache[Key];
    }

    public async invalidatePrefix(prefix: string): Promise<void> {
        const Keys = Object.keys(this.cache).filter(Key =>
            Key.startsWith(`${prefix}:`),
        );

        Keys.forEach(Key => {
            delete this.cache[Key];
        });
    }
}
