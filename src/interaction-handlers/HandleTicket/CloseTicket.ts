import {InteractionHandler, InteractionHandlerTypes} from "@sapphire/framework";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    EmbedBuilder,
    StringSelectMenuInteraction
} from "discord.js";
import {prisma} from "../../bot";


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
        const messages = await interaction.channel.messages.fetch()

        for (const [messageId, message] of messages.entries()) {
            await prisma.ticket.update({
                where: {
                    guildId: interaction.guildId,
                    channelId: interaction.channelId
                },
                data: {
                    messages: {
                        create: {
                            message: message.content,
                            authorIcon: message.author.avatarURL() ? message.author.avatarURL() : 'https://imgs.search.brave.com/cCbOevNU0ZRUFbUTSK0_6dCBE5fDydyj6CwEb3dlb6w/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZG93bmxvYWQub3Jn/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE3/LzExL2Rpc2NvcmQt/bG9nby0wLnBuZw',
                            authorId: message.author.id,
                            authorUsername: message.author.username
                        }
                    }
                }
            })
        }
        await interaction.reply({content: "Closed", ephemeral: true})
        await interaction.channel.delete()
    }
}