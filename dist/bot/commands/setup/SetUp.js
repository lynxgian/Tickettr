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
                    name: 'setup-guild',
                    chatInputRun: 'chatInputAdd'
                }
            ]
        });
    }
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand(builder => {
            builder.setName("setup").setDescription("Sets Up Guild")
                .addSubcommand((command) => command
                .setName('setup-guild')
                .setDescription("Setups the guild")
                .addRoleOption((option) => option
                .setName('role')
                .setDescription('select the support role of the guild')
                .setRequired(true))
                .addChannelOption((option) => option
                .setName('log-channel')
                .setDescription('select the log channel of the guild')
                .setRequired(true)));
        });
    }
    async chatInputAdd(interaction) {
        const supportRoleId = interaction.options.getRole('role', true).id;
        const logChannelId = interaction.options.getChannel('log-channel', true).id;
        const guild = interaction.guild;
        const findGuild = await prisma_1.prisma.guild.findFirst({
            where: {
                guildId: guild.id,
            }
        });
        const membersWithRole = guild.members.cache.filter(x => x.roles.cache.has(supportRoleId));
        if (findGuild)
            return interaction.reply({ content: "Sever has already been setup", ephemeral: true });
        const category = await guild.channels.create({
            name: "Tickets",
            type: 4
        });
        const supportChannel = await guild.channels.create({
            parent: category.id,
            name: "Ticket",
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone.id, allow: discord_js_1.PermissionsBitField.resolve(["ReadMessageHistory"]), deny: discord_js_1.PermissionsBitField.resolve(["SendMessages", "AddReactions"]),
                },
                {
                    id: bot_1.client.user.id, allow: discord_js_1.PermissionsBitField.resolve(["SendMessages", "ViewChannel", "ReadMessageHistory", "UseApplicationCommands", "AddReactions", "UseExternalEmojis", "EmbedLinks"])
                }
            ]
        });
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Create a New Ticket")
            .setThumbnail(guild.iconURL())
            .setDescription("Click the button below to create a new ticket")
            .setTimestamp();
        const row = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setEmoji("🎟️")
            .setStyle(1)
            .setLabel("Create Ticket")
            .setCustomId("create-ticket"));
        const updateLogChannelPermissions = await interaction.guild.channels.cache.get(logChannelId).edit({ permissionOverwrites: [
                { id: bot_1.client.user.id, allow: ["SendMessages", "EmbedLinks", "ViewChannel"] }
            ] });
        await prisma_1.prisma.guild.create({
            data: {
                guildId: guild.id,
                supportRoleId,
                logChannelId,
                TicketCategory: {
                    create: {
                        categoryId: category.id,
                        channelId: supportChannel.id
                    },
                },
                staff: {
                    set: membersWithRole.map(x => x.user.id)
                }
            }
        });
        await supportChannel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: "Success", ephemeral: true });
    }
}
exports.SetUpCommand = SetUpCommand;
