import { MessageEmbed } from 'discord.js';
import Base from './Base.js';
import { client } from "./MyClient.js";
class App extends Base {
    constructor() {
        super();
    }
    getOption(message) {
        return (message.mentions.roles.size > 0 && !message.mentions.everyone) ? "ROLES" : "EVERYONE";
    }
    getRoles(message) {
        return message.mentions.roles.map(role => role.id);
    }
    getMembers(message) {
        if (message.guild === null)
            return [];
        App.bot = 0;
        App.totalSend = 0;
        App.totalNotSend = 0;
        let members = [];
        if (this.getOption(message) === "ROLES") {
            members = message.guild.members.cache
                .filter((users) => {
                if (users.user.bot) {
                    App.bot++;
                    return false;
                }
                else if (!users.user.bot) {
                    return super.arraysEqual(this.getRoles(message), users.roles.cache
                        .map((role) => role.id));
                }
                return true;
            }).map(users => users.user);
            return members;
        }
        else {
            members = message.guild.members.cache
                .filter((users) => {
                if (users.user.bot) {
                    App.bot++;
                    return false;
                }
                return true;
            }).map(users => users.user);
            return members;
        }
    }
    sendMessage(message, members) {
        if (!members.length || !process.env.prefix)
            return;
        let text = message.content
            .slice(process.env.prefix.length)
            .trim()
            .replace('@everyone', '')
            .trim()
            .replace(/\s?<@&?[0-9>\s?]+/g, '');
        let embedMsg = new MessageEmbed();
        let isSendMessage = [...members.map(async (member) => {
                return await member.send(text).then(async () => {
                    App.totalSend++;
                    await message.channel.send("`DM " + member.username + "`");
                    return new Promise(() => void 0);
                }).catch(err => {
                    App.totalNotSend++;
                    console.error(err);
                });
            })].pop();
        isSendMessage === null || isSendMessage === void 0 ? void 0 : isSendMessage.then(async () => {
            embedMsg.setTitle('===== Summary =====')
                .setColor(0xff0000)
                .addField(':rocket:  Total Send  :rocket:  ', App.totalSend, true)
                .addField(':x:  Total Not Send  :x:  ', App.totalNotSend, true)
                .addField(':frog:  Total Bot :frog:  ', App.bot, true)
                .setDescription('');
            await message.reply(embedMsg);
        }).catch(console.error);
    }
    run() {
        client.run()
            .then((client) => {
            // console.log(client);
            client.on("message", (message) => {
                if (!message.guild || !message.content.startsWith(process.env.prefix))
                    return;
                // console.log(this.getOption(message));
                this.sendMessage(message, this.getMembers(message));
            });
        })
            .catch(console.error);
    }
}
App.bot = 0;
App.totalSend = 0;
App.totalNotSend = 0;
new App().run();
