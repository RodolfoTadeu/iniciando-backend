import Redis, { Redis as RadisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
    private client: RadisClient;

    constructor() {
        console.log('Cheguei');

        this.client = new Redis(cacheConfig.config.redis);
    }

    public async save(Key: string, value: any): Promise<void> {
        await this.client.set(Key, JSON.stringify(value));
    }

    public async recover<T>(Key: string): Promise<T | null> {
        const data = await this.client.get(Key);

        if (!data) {
            return null;
        }

        const parsedData = JSON.parse(data) as T;

        return parsedData;
    }

    public async invalidate(Key: string): Promise<void> {
        await this.client.del(Key);
    }

    public async invalidatePrefix(prefix: string): Promise<void> {
        const Keys = await this.client.keys(`${prefix}:*`);

        const pipeline = this.client.pipeline();

        Keys.forEach(Key => {
            pipeline.del(Key);
        });

        await pipeline.exec();
    }
}
