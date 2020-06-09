const Discord = require('discord.js')
const { prefix, token } = require('./config.json')
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Client Ready!')

	client.on('message', msg => {
		if (!msg.guild || !msg.content.startsWith('!DM')) return

		if (msg.guild && msg.content.startsWith(prefix)) {
			let text = msg.content.slice(prefix.length)

			msg.guild.members.cache.forEach(member => {
				if (member.id != client.user.id && !member.user.bot) {
					member.send(text)
					msg.channel.send("DM " + member.user.username)
					// console.log("done!")
				}
			})
		}
	})
})

client.login(token)