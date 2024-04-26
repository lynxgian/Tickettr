import {InteractionHandler, InteractionHandlerTypes} from "@sapphire/framework";
import {
    ButtonInteraction, time,
    EmbedBuilder,
    StringSelectMenuInteraction, TextChannel, TimestampStyles, MessageMentions
} from "discord.js";
import {prisma} from "../../../src/lib/prisma";
import {Regex} from "lucide-react";
import {client} from "../../bot";

interface TicketType {
    createdAt: string;
    transcriptUrl: string;
    creator: {
        userId: string;
    };
}
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
                guildId: interaction.guildId!
            },
            select: {
                logChannelId: true
            }
        })
        const ticketCreatorInfo = await prisma.ticket.findFirst({
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
        })
        if (!ticketCreatorInfo) return interaction.reply({content: 'something went wrong', ephemeral: true})
        const logChannel = interaction.guild!.channels.cache.get(guildDb!.logChannelId) as TextChannel
        let ticketInfo: TicketType;
        for (const [messageId, message] of messages.entries()) {
            let names: string = message.content;
            if (message.mentions.users.size > 0) {
                    const m = message.mentions.users

                    for (const [userId, user] of m) {
                        let id = userId
                        names = names.replace(new RegExp(id, 'g'), message.mentions.users.get(id).username)
                        if (message.mentions.client) {
                            names = names.replace(new RegExp(client.user.id, 'g'), client.user.username)
                        }
                        console.log(names)
                    }


            }
            if (message.mentions.roles.size > 0){
                const m = message.mentions.roles

                for (const [roleId, role] of m) {
                    let id = roleId
                    names = names.replace(new RegExp(`&${id}`, 'g'), message.mentions.roles.get(id).name)

                }
            }
            if (message.mentions.channels.size > 0) {
                const m = message.mentions.channels
                for (const [channelId, channel] of m) {
                    let id = channelId
                    names = names.replace(new RegExp(`${id}`, 'g'), interaction.guild.channels.cache.get(id)?.name)

                }
            }
            message.content = names

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
                            message: message.content,
                            authorIcon: message.author.avatarURL() ? message.author.avatarURL() : 'https://imgs.search.brave.com/cCbOevNU0ZRUFbUTSK0_6dCBE5fDydyj6CwEb3dlb6w/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZG93bmxvYWQub3Jn/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE3/LzExL2Rpc2NvcmQt/bG9nby0wLnBuZw',
                            authorId: message.author.id!,
                            authorUsername: message.author.username!,
                            timestamp: date.toString()
                        }
                    },
                    transcriptUrl: `https://tickettr.xyz/transcripts/${ticketCreatorInfo.creator.userId}/${ticketCreatorInfo.id}`
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
        const findMember =  interaction.user

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
        await findMember.send({embeds: [embed]}).catch(() => null)

        }
}