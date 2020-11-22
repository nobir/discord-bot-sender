import { Client, ClientOptions, UserManager } from 'discord.js';
import env from 'dotenv';

class MyClient extends Client {
    private static instance: MyClient;

    private constructor(options?: ClientOptions | undefined) {
        env.config();
        super(options);
    }

    public static getInstance(options?: ClientOptions | undefined): MyClient {
        if (!MyClient.instance) {
            MyClient.instance = new MyClient(options);
        }

        return MyClient.instance;
    }

    public async run(): Promise<Client> {
        const client = MyClient.getInstance();
        client.once("ready", (): void => {
            console.log(`${client.user?.username} is Ready!!`);

            const userManager = new UserManager(client);

            setInterval(() => {
                userManager.fetch(process.env.userId as string)
                    .then(user => {
                        client.user?.setActivity({
                            name: user.username,
                            type: 'LISTENING'
                        });
                    })
                    .catch(console.error);
            }, 60000);
        });

        await
            client
                .login(process.env.token as string)
                .then((): void => {
                    console.log(`${client.user?.username} is logged in Successfully!!`);
                })
                .catch(console.error);

        return MyClient.instance as Client;
    }
}

export const client = MyClient.getInstance();
// export default client;