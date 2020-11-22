import { Message, MessageEmbed, User } from 'discord.js';
import Base from './Base.js';
import { client } from "./MyClient.js";

type MessageOption = "EVERYONE" | "ROLES";

class App extends Base {
    private static bot: number = 0;
    private static totalSend: number = 0;
    private static totalNotSend: number = 0;

    constructor() {
        super();
    }

    getOption(message: Message): MessageOption {
        return (message.mentions.roles.size > 0 && !message.mentions.everyone) ? "ROLES" : "EVERYONE";
    }

    getRoles(message: Message): string[] {
        return message.mentions.roles.map(role => role.id);
    }

    getMembers(message: Message): User[] {
        if (message.guild === null) return [] as User[];
        App.bot = 0;
        App.totalSend = 0;
        App.totalNotSend = 0;

        let members: User[] = [];
        if (this.getOption(message) === "ROLES") {
            members = message.guild.members.cache
                .filter((users) => {
                    if (users.user.bot) {
                        App.bot++;
                        return false
                    } else if (!users.user.bot) {
                        return super.arraysEqual(
                            this.getRoles(message),
                            users.roles.cache
                                .map((role) => role.id)
                        )
                    }
                    return true;
                }).map(users => users.user);
            return members;
        } else {
            members = message.guild.members.cache
                .filter((users) => {
                    if (users.user.bot) {
                        App.bot++;
                        return false
                    }
                    return true;
                }).map(users => users.user);

            return members;
        }
    }

    sendMessage(message: Message, members: User[]): void {
        if (!members.length) return;

        let text = message.content
            .slice(process.env.prefix?.length)
            .trim()
            .replace('@everyone', '')
            .trim()
            .replace(/\s?<@&?[0-9>\s?]+/g, '');

        let embedMsg = new MessageEmbed();

        let isSendMessage = [...members.map(async (member: User): Promise<void> => {
            await member.send(text).then(async () => {
                App.totalSend++;
                await message.channel.send("`DM " + member.username + "`")
            }).catch(err => {
                App.totalNotSend++;
                console.error(err);
            })
        })].pop();

        isSendMessage
            ?.then(async () => {
                embedMsg.setTitle('===== Summary =====')
                    .setColor(0xff0000)
                    .addField(':rocket:  Total Send  :rocket:  ', App.totalSend, true)
                    .addField(':x:  Total Not Send  :x:  ', App.totalNotSend, true)
                    .addField(':frog:  Total Bot :frog:  ', App.bot, true)
                    .setDescription('');
                await message.reply(embedMsg)
            })
            .catch(async err => {
                console.error(err)
            })
    }

    run(): void {
        client.run()
            .then((client): void => {
                // console.log(client);
                client.on("message", (message: Message): void => {
                    if (!message.guild || !message.content.startsWith(process.env.prefix as string)) return;
                    // console.log(this.getOption(message));
                    this.sendMessage(message, this.getMembers(message));
                });
            })
            .catch(console.error);
    }
}

new App().run();