import {InteractionHandler, InteractionHandlerTypes} from "@sapphire/framework";
import {
    ButtonInteraction, time,
    EmbedBuilder,
    StringSelectMenuInteraction, TextChannel, TimestampStyles
} from "discord.js";
import {prisma} from "../../../src/lib/prisma";

export default class CloseTicketHandler extends InteractionHandler {
    public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.MessageComponent
        });
    }

    public override parse(interaction: ButtonInteraction | StringSelectMenuInteraction) {
        if (interaction.customId !== "delete-ticket") return  this.none()

        return this.some()
    }

    public  async run(interaction: ButtonInteraction | StringSelectMenuInteraction) {
        const messages = await interaction.channel!.messages.fetch()
        const date = new Date()
        const guildDb = await prisma.guild.findFirst({
            where: {
                guildId: interaction.guildId
            },
            select: {
                logChannelId: true
            }
        })
        const logChannel = interaction.guild!.channels.cache.get(guildDb!.logChannelId) as TextChannel
        let ticketInfo;
        for (const [messageId, message] of messages.entries()) {
           ticketInfo = await prisma.ticket.update({
                where: {
                    guild: {
                        guildId: interaction.guildId!
                    },
                    channelId: interaction.channelId
                },
                data: {
                    isOpen: false,
                    messages: {
                        create: {
                            message: message.content!,
                            authorIcon: message.author.avatarURL() ? message.author.avatarURL() : 'https://imgs.search.brave.com/cCbOevNU0ZRUFbUTSK0_6dCBE5fDydyj6CwEb3dlb6w/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZG93bmxvYWQub3Jn/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE3/LzExL2Rpc2NvcmQt/bG9nby0wLnBuZw',
                            authorId: message.author.id!,
                            authorUsername: message.author.username!,
                            timestamp: date.toString()
                        }
                    }
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
            })
        }
        const findMember = await interaction.user.fetch(ticketInfo!.creator.userId)

        const embed = new EmbedBuilder()
            .setTitle(`Ticket Closed`)
            .setThumbnail(findMember.avatarURL())
            .setTimestamp()
            .addFields([
                {name: 'Transcript Url', value: `${ticketInfo.transcriptUrl ? ticketInfo.transcriptUrl : 'fix later'}`, inline: true},
                {name: 'Closed At', value: `${time(Math.round(Date.now() / 1000), TimestampStyles.LongDate)}`, inline: true},
                {name: 'Created At', value: `${time(parseInt(ticketInfo.createdAt), TimestampStyles.LongDate)}`, inline: true},
                {name: 'Closed By', value: `${interaction.user}`, inline: true}
            ])

        await interaction.reply({content: "Closed", ephemeral: true})
        await logChannel.send({embeds: [embed]})
        await interaction.channel.delete()
    }
}