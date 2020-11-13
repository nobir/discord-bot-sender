'use strict';

const { Client, MessageEmbed, UserManager } = require('discord.js')
const { prefix, token } = require('./config.json')
const embedMsg = new MessageEmbed()
const client = new Client()

const arraysEqual = (_arr1, _arr2) => {
    if (!Array.isArray(_arr1) || !Array.isArray(_arr2))
        return false;

    let arr1 = _arr1.concat().sort()
    let arr2 = _arr2.concat().sort()

    for (let i = 0; !(0 >= arr1.length) && i < arr1.length; i++) {
        for (let j = 0; !(0 >= arr2.length) && j < arr2.length; j++) {
            if (arr1[i] == arr2[j])
                return true;
        }
    }

    return false;
}

client.once('ready', () => {
    console.log('Client Ready!')
    const userManer = new UserManager(client)
    const id = '449217900725796885'

    setInterval(() => {
        userManer.fetch(id)
            .then(user => {
                client.user.setActivity({
                    name: user.username,
                    type: 'LISTENING'
                })
            })
            .catch(console.error)
    }, 60000)
})

client.on('message', message => {
    if (!message.guild || !message.content.startsWith('!DM'))
        return

    let sendCount = 0
    let botCount = 0
    let notSendCout = 0
    let rolesId = message.mentions.roles.map(role => role.id)
    let members = message.guild.members.cache.filter(users => {
        if (users.user.bot) {
            botCount++
            return false
        } else if (!users.user.bot) {
            return arraysEqual(rolesId, users._roles)
        }
        return true
    }).map(users => users.user)

    // console.log(memberList.map(user => user.username))
    // console.log(memberList.length)

    if (message.guild && message.content.startsWith(prefix) && Array.isArray(members) && members.length) {
        let text = message.content.slice(prefix.length).trim().replace(/\s?<@[&|!]?[0-9>\s?]+/g, '')

        let isSentAllMembers = [...members.map(async member => {
            await member.send(text).then(async () => {
                sendCount++;
                await message.channel.send("`DM " + member.username + "`")
            }).catch(err => {
                notSendCout++;
                console.log(err);
            })
        })].pop()

        isSentAllMembers
            .then(async () => {
                embedMsg.setTitle('===== Summary =====')
                    .setColor(0xff0000)
                    .addField(':rocket:  Total Send  :rocket:  ', sendCount, true)
                    .addField(':x:  Total Not Send  :x:  ', notSendCout, true)
                    .addField(':frog:  Total Bot :frog:  ', botCount, true)
                    .setDescription('');
                await message.reply(embedMsg)
            })
            .catch(async err => {
                console.log(err)
            })
    }
})

client.login(token)