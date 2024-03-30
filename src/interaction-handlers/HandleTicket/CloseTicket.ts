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
            console.log(message.author.username)
        }

        await interaction.reply({content: "Closed", ephemeral: true})
    }
}