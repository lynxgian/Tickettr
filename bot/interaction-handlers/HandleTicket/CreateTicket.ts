import {InteractionHandler, InteractionHandlerTypes} from "@sapphire/framework";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    EmbedBuilder, PermissionsBitField,
    StringSelectMenuInteraction
} from "discord.js";
import {prisma} from "../../../src/lib/prisma";
import {client} from "../../bot";

export default class CreateTicketHandler extends InteractionHandler {
    public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.MessageComponent
        });
    }

    public override parse(interaction: ButtonInteraction | StringSelectMenuInteraction) {
        if (interaction.customId !== "create-ticket") return  this.none()

       return this.some()
    }

    public  async run(interaction: ButtonInteraction | StringSelectMenuInteraction) {
        const date = new Date();
        const GuildDB = await prisma.ticketCategory.findFirst({
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
                        supportRoleId: true,
                        logChannelId: true
                    }
                }
            }
        })
        const findOpenTicket = await prisma.ticket.findFirst({
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
        })
        const findRole = await interaction.guild.roles.fetch(GuildDB.guild.supportRoleId)
        const findChannel = await interaction.guild.channels.fetch(GuildDB.guild.logChannelId)

        if (!findRole) return interaction.reply({content: 'Unable to find support role please run: \n `/update-settings support-role`'})
        if (!findChannel) return interaction.reply({content: 'Unable to find log channel please run: \n `/update-settings log-channel`'})
        if(findOpenTicket) {
            return interaction.reply({ephemeral: true, content: `You already have an open ticket <#${findOpenTicket.channelId}>`})
        }
        const ticketChannel =  await interaction.guild.channels.create({
            parent: GuildDB.categoryId,
            name: `${interaction.user.username}-ticket`,
            permissionOverwrites: [
                {id: interaction.guild.roles.everyone.id, deny: PermissionsBitField.resolve('ViewChannel')},
                {id: interaction.user.id, allow: PermissionsBitField.resolve(['ViewChannel', 'SendMessages', 'ReadMessageHistory'])},
                {id: GuildDB.guild.supportRoleId, allow: PermissionsBitField.resolve(['ViewChannel', 'SendMessages', 'ReadMessageHistory'])},
                {id: client.user.id, allow: PermissionsBitField.resolve(['ViewChannel', 'SendMessages', 'ReadMessageHistory', "EmbedLinks", "AddReactions"])}

            ]
        })
        const findUser = await prisma.user.findFirst({
            where: {
                userId: interaction.user.id
            }
        })
        if(!findUser) {

            await prisma.user.create({
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
            })
        } else {
            await prisma.ticket.create({
                data: {
                    createdAt: Math.round(Date.now() / 1000).toString(),
                    guild: {
                        connect: {
                            guildId: interaction.guildId!
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
            })
        }

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s Ticket`)
            .setThumbnail(interaction.user.avatarURL())
            .setDescription('Please describe your issue in a detailed manner')
            .setTimestamp()
        const buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("delete-ticket")
                    .setLabel("Close Ticket")
                    .setStyle(4)
                    .setEmoji("❌")
            )
        await interaction.reply({content: `Successfully created a ticket at <#${ticketChannel.id}>`, ephemeral: true})

        await ticketChannel.send({content: `<@${interaction.user.id}>, <@&${GuildDB.guild.supportRoleId}>`,embeds: [embed], components: [buttons]})

    }
}