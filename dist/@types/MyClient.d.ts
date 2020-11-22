import { Client, ClientOptions } from 'discord.js';
declare class MyClient extends Client {
    private static instance;
    private constructor();
    static getInstance(options?: ClientOptions | undefined): MyClient;
    run(): Promise<Client>;
}
export declare const client: MyClient;
export {};
