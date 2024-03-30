import {ApplicationCommandRegistry, Command, CommandOptionsRunTypeEnum} from "@sapphire/framework";
import {
    ActionRow, ActionRowBuilder,
    ButtonBuilder, ButtonComponent,
    ChatInputCommandInteraction, ComponentBuilder, Embed, EmbedBuilder, PermissionOverwrites, PermissionsBitField
} from "discord.js";
import {prisma} from "../../bot";

export class SetUpCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options ) {
        super(context, {
            ...options,
            runIn: CommandOptionsRunTypeEnum.GuildText
        });
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(builder => {
            builder.setName("setup").setDescription("Sets Up Guild").setDefaultMemberPermissions(PermissionsBitField.resolve("ManageGuild"))
        })
    }
    public async chatInputRun(interaction:ChatInputCommandInteraction) {
        const guild = interaction.guild
        const findGuild = await prisma.guild.findFirst({
            where: {
                guildId: guild.id,
                TicketCategory: {
                    guildId: guild.id
                }
            }
        })
        if (findGuild) return interaction.reply({content: "Sever has already been setup", ephemeral: true});

        const category = await guild.channels.create({
            name: "Tickets",
            type: 4

        })
        const supportChannel = await guild.channels.create({
            parent: category.id,
            name: "Ticket",
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone.id, allow:  PermissionsBitField.resolve(["ReadMessageHistory"]), deny: PermissionsBitField.resolve(["SendMessages", "AddReactions"])
                }
            ]
        })
        const embed = new EmbedBuilder()
            .setTitle("Create a New Ticket")
            .setImage(guild.iconURL())
            .setDescription("Click the button below to create a new ticket")
            .setTimestamp()
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("🎟️")
                    .setStyle(1)
                    .setLabel("Create Ticket")
                    .setCustomId("create-ticket")
            )
        await prisma.ticketCategory.create({
            data: {
                guildId: guild.id,
                categoryId: category.id,
                channelId: supportChannel.id
            }
        })
        await supportChannel.send({embeds: [embed], components: [row]})
        await interaction.reply({content: "Success", ephemeral: true})
    }
}