// Imports
const Discord = require("discord.js");
const bot = new Discord.Client();
const roles = require("./modules/roles");
let config = require("./config.json");

const welcomeChannelID = "859261203792396298";
let prefix = null;

// Initialization
bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    prefix = config.prefix;
})

// User entering server event
bot.on("guildMemberAdd", (member) => {
    console.log("New user entered the server");
    member.client.channels.cache.get(welcomeChannelID).send(`Hello and welcome on this server ! Feel free to ask any question related to hacking ! 
    To get a rank corresponding to your level in security enter "${prefix}roles" to have infos on roles commands :wink:`);
})

// User message event
bot.on("message", async message => {
    content = message.content;
    if (message.author.bot) return;

    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase()

    switch (command) {
        case "roles" :
            roles.data.rolesHelp(message);
            break;

        case "sskill":
            roles.data.showCurrentSkill(message);
            break;

        case "askill" :
            if (message.channel.permissionsFor(message.member).has("MANAGE_ROLES", false)) {
                roles.data.addNewSkill(message);
            } else {
                message.channel.send("Sorry but you need to be a mod to use this command")
            }
            break;

        case "rskill" :
            if (message.channel.permissionsFor(message.member).has("MANAGE_ROLES", false)) {
                roles.data.removeSkill(message);
            } else {
                message.channel.send("Sorry but you need to be a mod to use this command")
            }
            break;

        case "jskill":
            roles.data.joinSkill(bot, message);
            break;

        case "sregion":
            roles.data.showCurrentRegion(message);
            break;

        case "aregion" :
            if (message.channel.permissionsFor(message.member).has("MANAGE_ROLES", false)) {
                roles.data.addNewRegion(message);
            } else {
                message.channel.send("Sorry but you need to be a mod to use this command")
            }
            break;

        case "rregion" :
            if (message.channel.permissionsFor(message.member).has("MANAGE_ROLES", false)) {
                roles.data.removeRegion(message);
            } else {
                message.channel.send("Sorry but you need to be a mod to use this command")
            }
            break;

        case "jregion":
            roles.data.joinRegion(bot, message);
            break;

        default:
            return;
    }

})
bot.login(config.token);
