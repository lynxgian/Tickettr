"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetUpCommand = void 0;
const discord_js_1 = require("discord.js");
const prisma_1 = require("../../../src/lib/prisma");
const plugin_subcommands_1 = require("@sapphire/plugin-subcommands");
const bot_1 = require("../../bot");
class SetUpCommand extends plugin_subcommands_1.Subcommand {
    constructor(context, options) {
        super(context, {
            ...options,
            subcommands: [
                {
                    name: 'update-settings',
                    type: 'group',
                    entries: [
                        {
                            name: 'update-support-role',
                            chatInputRun: 'updateRole',
                        },
                        {
                            name: 'update-log-channel',
                            chatInputRun: 'updateLogChannel',
                        }
                    ]
                }
            ]
        });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(builder => {
            builder.setName("update").setDescription("update role and log channel of the guild").setDefaultMemberPermissions(discord_js_1.PermissionsBitField.resolve("ManageGuild"))
                .addSubcommandGroup((group) => group
                .setName('update-settings')
                .setDescription('Update the settings for the guild')
                .addSubcommand((command) => command
                .setName('update-support-role')
                .setDescription('Updates the support role of the guild')
                .addRoleOption((options) => options
                .setName('support-role')
                .setDescription('update the support role')
                .setRequired(true)))
                .addSubcommand((command) => command
                .setName('update-log-channel')
                .setDescription('Updates the log channel of the guild')
                .addChannelOption((options) => options
                .setName('log-channel')
                .setDescription('update the log channel')
                .setRequired(true))));
        });
    }
    async updateRole(interaction) {
        const guildDb = await prisma_1.prisma.guild.findFirst({
            where: {
                guildId: interaction.guildId
            }
        });
        const membersWithRole = interaction.guild.members.cache.filter(x => x.roles.cache.has(interaction.options.getRole('support-role', true).id));
        if (!guildDb)
            return interaction.reply({ content: 'This guild has not been set up yet \n Please use /setup to get started!', ephemeral: true });
        console.log(membersWithRole.map(x => x.user.id));
        await prisma_1.prisma.guild.update({
            where: {
                guildId: interaction.guildId
            },
            data: {
                supportRoleId: {
                    set: interaction.options.getRole('support-role', true).id
                },
                staff: {
                    set: membersWithRole.map(x => x.user.id)
                }
            }
        });
        return await interaction.reply({ content: `Successfully updated the support role of the guild to ${interaction.options.getRole('support-role', true)}`, ephemeral: true });
    }
    async updateLogChannel(interaction) {
        const guildDb = await prisma_1.prisma.guild.findFirst({
            where: {
                guildId: interaction.guildId
            }
        });
        if (!guildDb)
            return interaction.reply({ content: 'This guild has not been set up yet \n Please use /setup to get started!', ephemeral: true });
        const channelId = interaction.options.getChannel('log-channel', true).id;
        const channel = interaction.guild.channels.cache.get(channelId);
        await channel.edit({
            permissionOverwrites: [
                { id: bot_1.client.user.id, allow: ["SendMessages", "EmbedLinks", "ViewChannel"] }
            ]
        }).catch(async (e) => await interaction.reply({ content: 'Error: Bot does not have enough permissions to update the log channel \n Please revise the permissions and try again!', ephemeral: true }));
        await prisma_1.prisma.guild.update({
            where: {
                guildId: interaction.guildId
            },
            data: {
                logChannelId: channelId
            }
        });
        return await interaction.reply({ content: `Successfully updated the log channel of the guild to: <#${interaction.options.getChannel('log-channel', true).id}>`, ephemeral: true });
    }
}
exports.SetUpCommand = SetUpCommand;
