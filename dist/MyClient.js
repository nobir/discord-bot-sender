import { Client, UserManager } from 'discord.js';
import env from 'dotenv';
class MyClient extends Client {
    constructor(options) {
        env.config();
        super(options);
        this.userManager = new UserManager(this);
    }
    static getInstance(options) {
        if (!MyClient.instance) {
            MyClient.instance = new MyClient(options);
        }
        return MyClient.instance;
    }
    creator() {
        this.userManager.fetch(process.env.userId)
            .then(user => {
            var _a;
            (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity({
                name: user.username,
                type: 'LISTENING'
            });
        })
            .catch(console.error);
    }
    async run() {
        const client = MyClient.getInstance();
        client.once("ready", () => {
            var _a;
            console.log(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} is Ready!!`);
            this.creator();
            setInterval(this.creator, 21600000);
        });
        await client
            .login(process.env.token)
            .then(() => {
            var _a;
            console.log(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} is logged in Successfully!!`);
        })
            .catch(console.error);
        return MyClient.instance;
    }
}
export const client = MyClient.getInstance();
