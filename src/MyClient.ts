import { Client, ClientOptions, UserManager } from 'discord.js';
import env from 'dotenv';

class MyClient extends Client {
    private static instance: MyClient;
    private userManager: UserManager;

    private constructor(options?: ClientOptions | undefined) {
        env.config();
        super(options);
        this.userManager = new UserManager(this as Client);
    }

    public static getInstance(options?: ClientOptions | undefined): MyClient {
        if (!MyClient.instance) {
            MyClient.instance = new MyClient(options);
        }

        return MyClient.instance;
    }

    private creator(): void {
        this.userManager.fetch(process.env.userId as string)
            .then(user => {
                client.user?.setActivity({
                    name: user.username,
                    type: 'LISTENING'
                });
            })
            .catch(console.error);
    }

    public async run(): Promise<Client> {
        const client = MyClient.getInstance();
        client.once("ready", (): void => {
            console.log(`${client.user?.username} is Ready!!`);

            this.creator();

            setInterval(this.creator, 21600000);
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