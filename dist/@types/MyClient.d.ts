import { Client, ClientOptions } from 'discord.js';
declare class MyClient extends Client {
    private static instance;
    private userManager;
    private constructor();
    static getInstance(options?: ClientOptions | undefined): MyClient;
    private creator;
    run(): Promise<Client>;
}
export declare const client: MyClient;
export {};
