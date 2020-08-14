const Discord = require('discord.js')
const { prefix, token } = require('./config.json')
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Client Ready!')

	client.on('message', msg => {
		if (!msg.guild || !msg.content.startsWith('!DM')) return

		let mentionUsers = msg.mentions.roles.map(item => item.members)
		mentionUsers = mentionUsers[0].map(item => item.user) || [];

		// console.log(mentionUsers)

		if (msg.guild && msg.content.startsWith(prefix)) {
			let text = msg.content.slice(prefix.length).replace(/\s<@&?[0-9>\s]+/gm, '')
			let sendCount = 0
			let botCount = 0
			let notSendCout = 0

			if (mentionUsers) {
				mentionUsers.forEach((member) => {
					if (member.bot) {
						notSendCout++
						botCount++
						return
					}

					if (!member.bot) {
						member.send(text)
						msg.channel.send("DM " + member.username)
						sendCount++;
						// console.log("done!")
					}
				})
			}

			// console.log(text)

			msg.reply('\n\n:rocket:  `Total Send: ' + sendCount + '`\n\n:x:  `Total Not Send: ' + notSendCout + '`\n\n:frog:  `Total Bot: ' + botCount + '`')
		}
	})
})

client.login(token)