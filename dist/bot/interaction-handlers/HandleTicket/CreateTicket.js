"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const prisma_1 = require("../../../src/lib/prisma");
const bot_1 = require("../../bot");
class CreateTicketHandler extends framework_1.InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: framework_1.InteractionHandlerTypes.MessageComponent
        });
    }
    parse(interaction) {
        if (interaction.customId !== "create-ticket")
            return this.none();
        return this.some();
    }
    async run(interaction) {
        const date = new Date();
        const GuildDB = await prisma_1.prisma.ticketCategory.findFirst({
            where: {
                guild: {
                    guildId: interaction.guildId
                }
            },
            select: {
                categoryId: true,
                channelId: true,
                guild: {
                    select: {
                        supportRoleId: true
                    }
                }
            }
        });
        const findOpenTicket = await prisma_1.prisma.ticket.findFirst({
            where: {
                guild: {
                    guildId: interaction.guildId
                },
                creator: {
                    userId: interaction.user.id
                },
                isOpen: true
            },
            select: {
                channelId: true,
            }
        });
        if (findOpenTicket) {
            return interaction.reply({ ephemeral: true, content: `You already have an open ticket <#${findOpenTicket.channelId}>` });
        }
        const ticketChannel = await interaction.guild.channels.create({
            parent: GuildDB.categoryId,
            name: `${interaction.user.username}-ticket`,
            permissionOverwrites: [
                { id: interaction.guild.roles.everyone.id, deny: discord_js_1.PermissionsBitField.resolve('ViewChannel') },
                { id: interaction.user.id, allow: discord_js_1.PermissionsBitField.resolve(['ViewChannel', 'SendMessages', 'ReadMessageHistory']) },
                { id: GuildDB.guild.supportRoleId, allow: discord_js_1.PermissionsBitField.resolve(['ViewChannel', 'SendMessages', 'ReadMessageHistory']) },
                { id: bot_1.client.user.id, allow: discord_js_1.PermissionsBitField.resolve(['ViewChannel', 'SendMessages', 'ReadMessageHistory', "EmbedLinks", "AddReactions"]) }
            ]
        });
        const findUser = await prisma_1.prisma.user.findFirst({
            where: {
                userId: interaction.user.id
            }
        });
        if (!findUser) {
            await prisma_1.prisma.user.create({
                data: {
                    userId: interaction.user.id,
                    Tickets: {
                        create: {
                            guild: {
                                connect: {
                                    guildId: interaction.guildId
                                }
                            },
                            channelId: ticketChannel.id,
                            createdAt: Math.round(Date.now() / 1000).toString(),
                            isOpen: true
                        }
                    },
                }
            });
        }
        else {
            await prisma_1.prisma.ticket.create({
                data: {
                    createdAt: Math.round(Date.now() / 1000).toString(),
                    guild: {
                        connect: {
                            guildId: interaction.guildId
                        }
                    },
                    creator: {
                        connect: {
                            userId: interaction.user.id
                        }
                    },
                    isOpen: true,
                    channelId: ticketChannel.id
                }
            });
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`${interaction.user.username}'s Ticket`)
            .setThumbnail(interaction.user.avatarURL())
            .setDescription('Please describe your issue in a detailed manner')
            .setTimestamp();
        const buttons = new discord_js_1.ActionRowBuilder()
            .addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("delete-ticket")
            .setLabel("Close Ticket")
            .setStyle(4)
            .setEmoji("❌"));
        await ticketChannel.send({ content: `<@${interaction.user.id}>, <@${GuildDB.guild.supportRoleId}>`, embeds: [embed], components: [buttons] });
        await interaction.reply({ content: `Successfully created a ticket at <#${ticketChannel.id}>`, ephemeral: true });
    }
}
exports.default = CreateTicketHandler;
