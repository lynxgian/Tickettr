import {InteractionHandler, InteractionHandlerTypes} from "@sapphire/framework";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    EmbedBuilder,
    StringSelectMenuInteraction
} from "discord.js";
import {prisma} from "../../bot";


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
        const GuildDB = await prisma.ticketCategory.findFirst({
            where: {
                guild: {
                    guildId: interaction.guildId
                }
            },
            select: {
                categoryId: true,
                channelId: true
            }
        })
        const findOpenTicket = await prisma.ticket.findFirst({
            where: {
                guildId: interaction.guild.id,
                creator: {
                    userId: interaction.user.id
                },
                isOpen: true
            },
            select: {
                channelId: true
            }
        })
        if(findOpenTicket) {
            return interaction.reply({ephemeral: true, content: `You already have an open ticket <#${findOpenTicket.channelId}>`})
        }
        const ticketChannel =  await interaction.guild.channels.create({
            parent: GuildDB.categoryId,
            name: `${interaction.user.username}-ticket`
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
                            guildId: interaction.guildId,
                            channelId: ticketChannel.id
                        }
                    }
                }
            })
        } else {
            await prisma.ticket.create({
                data: {
                    guildId: interaction.guildId,
                    creator: {
                        connect: {
                            userId: interaction.user.id
                        }
                    },
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
        await ticketChannel.send({content: `<@${interaction.user.id}>`,embeds: [embed], components: [buttons]})

        await interaction.reply({content: `Successfully created a ticket at <#${ticketChannel.id}>`, ephemeral: true})
    }
}