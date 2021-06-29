var config = require("../config.json");
var skill = config.skill;
let region = config.region;
const updateJsonFile = require("update-json-file");

var methods = {
    showCurrentSkill : function(message) {
        var tabRole = JSON.parse(JSON.stringify(skill));
        if (tabRole.length == 0 ) {
            message.channel.send("There are currently no roles available, contact an admin");
            return;
        }

        var allRoles = "Available skill levels are : \n";
        for (var key in tabRole) {
            allRoles += (tabRole[key][0]+", "+ tabRole[key][1][0]+"\n");
        }
        message.channel.send(allRoles);
    },

    addNewSkill : function(message) {
        args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        if (args.length != 4) {
            message.channel.send("To add a role please use the following syntax : \n!askill {Skill level} {emoji} {@role}");
            return;
        }
        args.shift();
        game = args.shift();
        emote = args.shift();
        role = args.shift();
        role = getRoleFromMention(role);

        for (var i in skill) {
            if (skill[i][1][1] === role) {
                message.channel.send("A reaction is already available for this role").then(msg => {
                    msg.delete({ timeout: 10000 });
                });
                return;
            }

            if (skill[i][1] === emote) {
                message.channel.send("This emoji is already used").then(msg => {
                    msg.delete({ timeout: 10000 });
                });
                return;
            }
        }

        if (role === "user") {
            message.channel.send("Please mention a role and not a user");
            return;
        }

        skill.push([game, [emote, role]]);
        updateJsonFile("./config.json", (data) => {
            data.skill = skill;
            return data
        })
        message.channel.send("Skill level is now available !");
    },

    joinSkill : async function (bot, message) {
        var messagesSent = 0;

        if (skill.length == 0 ) {
            message.channel.send("There are no roles set up yet");
            return;
        }
        reactions = [];

        for (key in skill) {
            reactions.push(skill[key][1][0]);
        }

        methods.showCurrentSkill(message);
        messagesSent++;
        message.channel.send("\nTo obtain a new role click on the corresponding emoji").then(msg => {
            for (emo in reactions) {
                msg.react(reactions[emo]);
            }

            const filter = (reaction, user) => {
                return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
            }

            const collector = msg.createReactionCollector(filter, {max: reactions.length, time:60000, errors: ["time"] });

            collector.on("collect", (reaction, reactionCollector) => {
                console.log("Reaction collected");
                for (i in skill) {
                    if (skill[i][1][0] === reaction.emoji.name) {
                        roleID = skill[i][1][1];
                        if (message.member.roles.cache.has(roleID)) {
                            messagesSent++;
                            message.channel.send("You already have the role :upside_down:").then(msg => {
                                msg.delete({ timeout: 10000 });
                            });
                        } else {
                            message.member.roles.add(roleID);
                            messagesSent++;
                            message.channel.send("You now have this role :thumb_up:").then(msg => {
                                msg.delete({ timeout: 10000 });
                            });
                        }
                    }
                }
            }).then(msg => {
                msg.delete({timeout: 120000});
            });

            collector.on("end", collected => {
                msg.delete();
                for (i in messagesSent) {
                    bot.lastMessage.delete();
                }
            })

        })
    },

    removeSkill : function(message) {
        var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        if (args.length > 2) {
            message.channel.send("To remove a role of the pool please type !rskill {name of role in !sskill}");
        }
        var role = args[1];
        for (var i in skill) {
            if (skill[i][0] === role) {
                skill.splice(i, 1);
                updateJsonFile("./config.json", (data) => {
                    data.skill = skill;
                    return data
                })
                message.channel.send(`${role} has been deleted from the pool.`);
                return;
            }
        }
        message.channel.send(`${role} wasn't found please check the name`).then(msg => {
            msg.delete({timeout: 10000});
        });
    },

    rolesHelp : function(message) {
        message.channel.send(`Hey to use the roles commands type it as follow :\n
        ${prefix}sskill to have an overview of all the Skill levels available as roles\n
        ${prefix}askill to add a new role to the pool (Mod ONLY)\n
        ${prefix}rskill to remove a role (Mod ONLY)\n
        ${prefix}jskill to add yourself the roles you want\n\n
        -------------------------\n
        ${prefix}sregion to have an overview of all the regions available as roles\n
        ${prefix}aregion to add a new role to the pool (Mod ONLY)\n
        ${prefix}rregion to remove a role (Mod ONLY)\n
        ${prefix}jregion to add yourself the roles you want :love_you_gesture:`);
    },

    showCurrentRegion : function(message) {
        var tabRole = JSON.parse(JSON.stringify(region));
        if (tabRole.length == 0 ) {
            message.channel.send("There are currently no roles available, contact an admin");
            return;
        }

        var allRoles = "Available regions are : \n";
        for (var key in tabRole) {
            allRoles += (tabRole[key][0]+", "+ tabRole[key][1][0]+"\n");
        }
        message.channel.send(allRoles);
    },

    addNewRegion : function(message) {
        args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        if (args.length != 4) {
            message.channel.send("To add a new region please use the following syntax : \n!aregion {region name} {emoji} {@role}");
            return;
        }
        args.shift();
        game = args.shift();
        emote = args.shift();
        role = args.shift();
        role = getRoleFromMention(role);

        for (var i in region) {
            if (region[i][1][1] === role) {
                message.channel.send("A reaction is already available for this role").then(msg => {
                    msg.delete({ timeout: 10000 });
                });
                return;
            }

            if (region[i][1] === emote) {
                message.channel.send("This emoji is already used").then(msg => {
                    msg.delete({ timeout: 10000 });
                });
                return;
            }
        }

        if (role === "user") {
            message.channel.send("Please mention a role and not a user");
            return;
        }

        region.push([game, [emote, role]]);
        updateJsonFile("./config.json", (data) => {
            data.region = region;
            return data
        })
        message.channel.send("Region is now available !");
    },

    joinregion : async function (bot, message) {
        var messagesSent = 0;

        if (region.length == 0 ) {
            message.channel.send("There are no roles set up yet");
            return;
        }
        reactions = [];

        for (key in region) {
            reactions.push(region[key][1][0]);
        }

        methods.showCurrentRegion(message);
        messagesSent++;
        message.channel.send("\nTo obtain a new role click on the corresponding emoji").then(msg => {
            for (emo in reactions) {
                msg.react(reactions[emo]);
            }

            const filter = (reaction, user) => {
                return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
            }

            const collector = msg.createReactionCollector(filter, {max: reactions.length, time:60000, errors: ["time"] });

            collector.on("collect", (reaction, reactionCollector) => {
                console.log("Reaction collected");
                for (i in region) {
                    if (region[i][1][0] === reaction.emoji.name) {
                        roleID = region[i][1][1];
                        if (message.member.roles.cache.has(roleID)) {
                            messagesSent++;
                            message.channel.send("You already have the role :upside_down:").then(msg => {
                                msg.delete({ timeout: 10000 });
                            });
                        } else {
                            message.member.roles.add(roleID);
                            messagesSent++;
                            message.channel.send("You now have this role :thumb_up:").then(msg => {
                                msg.delete({ timeout: 10000 });
                            });
                        }
                    }
                }
            }).then(msg => {
                msg.delete({timeout: 120000});
            });

            collector.on("end", collected => {
                msg.delete();
                for (i in messagesSent) {
                    bot.lastMessage.delete();
                }
            })

        })
    },

    removeregion : function(message) {
        var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
        if (args.length > 2) {
            message.channel.send("To remove a role of the pool please type !rregion {name of role in !sregion}");
        }
        var role = args[1];
        for (var i in region) {
            if (region[i][0] === role) {
                region.splice(i, 1);
                updateJsonFile("./config.json", (data) => {
                    data.region = region;
                    return data
                })
                message.channel.send(`${role} has been deleted from the pool.`);
                return;
            }
        }
        message.channel.send(`${role} wasn't found please check the name`).then(msg => {
            msg.delete({timeout: 10000});
        });
    }

}

function getRoleFromMention(mention) {

    if (mention.startsWith("<@&") && mention.endsWith(">")) {
        mention = mention.slice(3, -1);
    }

    if (mention.startsWith("<@") && mention.endsWith(">")) {
        return "user";
    }

    return mention;

}

exports.data = methods;