const Discord = require('discord.js')
const { prefix, token } = require('./config.json')
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Client Ready!')

	client.on('message', msg => {
		if (msg.guild && msg.content.startsWith(prefix)) {
			let text = msg.content.slice(prefix.length)
			// console.log(msg.guild.channels.cache)
			msg.guild.members.cache.forEach(member => {
				if (member.user.discriminator == 5326) {
					member.send(text)
					msg.channel.send("DM " + member.user.username)
				}
			})
		}
	})
})

client.login(token)