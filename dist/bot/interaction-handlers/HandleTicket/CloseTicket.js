"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@sapphire/framework");
const discord_js_1 = require("discord.js");
const prisma_1 = require("../../../src/lib/prisma");
class CloseTicketHandler extends framework_1.InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: framework_1.InteractionHandlerTypes.MessageComponent
        });
    }
    parse(interaction) {
        if (interaction.customId !== "delete-ticket")
            return this.none();
        return this.some();
    }
    async run(interaction) {
        const messages = await interaction.channel.messages.fetch();
        const date = new Date();
        const guildDb = await prisma_1.prisma.guild.findFirst({
            where: {
                guildId: interaction.guildId
            },
            select: {
                logChannelId: true
            }
        });
        const ticketCreatorInfo = await prisma_1.prisma.ticket.findFirst({
            where: {
                channelId: interaction.channelId,
                guild: {
                    guildId: interaction.guildId
                },
                isOpen: true
            },
            select: {
                creator: {
                    select: {
                        userId: true
                    }
                },
                id: true
            }
        });
        if (!ticketCreatorInfo)
            return interaction.reply({ content: 'something went wrong', ephemeral: true });
        const logChannel = interaction.guild.channels.cache.get(guildDb.logChannelId);
        let ticketInfo;
        for (const [messageId, message] of messages.entries()) {
            ticketInfo = await prisma_1.prisma.ticket.update({
                where: {
                    guild: {
                        guildId: interaction.guildId
                    },
                    channelId: interaction.channelId
                },
                data: {
                    isOpen: false,
                    messages: {
                        create: {
                            message: message.content,
                            authorIcon: message.author.avatarURL() ? message.author.avatarURL() : 'https://imgs.search.brave.com/cCbOevNU0ZRUFbUTSK0_6dCBE5fDydyj6CwEb3dlb6w/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZG93bmxvYWQub3Jn/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE3/LzExL2Rpc2NvcmQt/bG9nby0wLnBuZw',
                            authorId: message.author.id,
                            authorUsername: message.author.username,
                            timestamp: date.toString()
                        }
                    },
                    transcriptUrl: `https://tickettr.xyz/${ticketCreatorInfo.creator.userId}/${ticketCreatorInfo.id}`
                },
                select: {
                    creator: {
                        select: {
                            userId: true
                        }
                    },
                    transcriptUrl: true,
                    createdAt: true
                }
            });
        }
        const findMember = await interaction.user.fetch(ticketInfo.creator.userId);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`Ticket Closed`)
            .setThumbnail(findMember.avatarURL())
            .setTimestamp()
            .addFields([
            { name: 'Transcript Url', value: `${ticketInfo.transcriptUrl ? ticketInfo.transcriptUrl : 'fix later'}`, inline: true },
            { name: 'Closed At', value: `${(0, discord_js_1.time)(Math.round(Date.now() / 1000), discord_js_1.TimestampStyles.LongDate)}`, inline: true },
            { name: 'Created At', value: `${(0, discord_js_1.time)(parseInt(ticketInfo.createdAt), discord_js_1.TimestampStyles.LongDate)}`, inline: true },
            { name: 'Closed By', value: `${interaction.user}`, inline: true }
        ]);
        await interaction.reply({ content: "Closed", ephemeral: true });
        await logChannel.send({ embeds: [embed] });
        await interaction.channel.delete();
    }
}
exports.default = CloseTicketHandler;
