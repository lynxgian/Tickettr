"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingCommand = void 0;
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
class PingCommand extends framework_1.Command {
    constructor(context, options) {
        super(context, {
            ...options,
            requiredUserPermissions: ["ManageGuild"],
            runIn: framework_1.CommandOptionsRunTypeEnum.GuildText
        });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(builder => {
            builder.setName("ping").setDescription("Ping Command!").setDefaultMemberPermissions(discord_js_1.PermissionsBitField.resolve("ManageGuild"));
        });
    }
    async chatInputRun(interaction) {
        await interaction.reply({ content: "Pong!" });
    }
}
exports.PingCommand = PingCommand;
