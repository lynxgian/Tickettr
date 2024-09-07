import {
    ApplicationCommandRegistry,
    Args, ChatInputCommandContext,
    Command,
    CommandOptionsRunTypeEnum,
    MessageCommandContext
} from "@sapphire/framework";
import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonComponent,
    ChatInputCommandInteraction, Client,
    ComponentBuilder,
    Embed,
    EmbedBuilder,
    Interaction,
    PermissionOverwrites,
    PermissionsBitField
} from "discord.js";
import {prisma} from "../../../src/lib/prisma";
import {Subcommand} from "@sapphire/plugin-subcommands";
import TickettrClient from "../../lib/Client";
import {client} from "../../bot";

export class SetUpCommand extends Subcommand {
    public constructor(context: Command.LoaderContext, options: Command.Options ) {
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

    public override registerApplicationCommands(registry: Subcommand.Registry) {
        registry.registerChatInputCommand(builder => {
            builder.setName("setup").setDescription("Sets Up Guild")
                .addSubcommand((command) =>
                    command
                        .setName('setup-guild')
                        .setDescription("Setups the guild")
                        .addRoleOption((option) =>
                                option
                                    .setName('role')
                                    .setDescription('select the support role of the guild')
                                    .setRequired(true)
                                )
                        .addChannelOption((option) =>
                                option
                                    .setName('log-channel')
                                    .setDescription('select the log channel of the guild')
                                    .setRequired(true)
                        )
                )
        })
    }
    public async chatInputAdd(interaction:Subcommand.ChatInputCommandInteraction) {
        const supportRoleId = interaction.options.getRole('role', true).id
        const logChannelId = interaction.options.getChannel('log-channel', true).id
        const guild = interaction.guild
        const findGuild = await prisma.guild.findFirst({
            where: {
                guildId: guild!.id,

            }
        })
        const membersWithRole =  guild.members.cache.filter(x => x.roles.cache.has(supportRoleId))


        if (findGuild) return interaction.reply({content: "Sever has already been setup", ephemeral: true});


        const category = await guild!.channels.create({
            name: "Tickets",
            type: 4
        })

        const supportChannel = await guild!.channels.create({
            parent: category.id,
            name: "Ticket",
            permissionOverwrites: [
                {
                    id: interaction.guild!.roles.everyone.id, allow:  PermissionsBitField.resolve(["ReadMessageHistory"]), deny: PermissionsBitField.resolve(["SendMessages", "AddReactions"]),

                },
                {
                    id: client.user.id, allow: PermissionsBitField.resolve(["SendMessages", "ViewChannel", "ReadMessageHistory", "UseApplicationCommands", "AddReactions", "UseExternalEmojis", "EmbedLinks"])
                }
            ]
        })
        const embed = new EmbedBuilder()
            .setTitle("Create a New Ticket")
            .setThumbnail(guild!.iconURL())
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
        const updateLogChannelPermissions = await interaction.guild.channels.cache.get(logChannelId).edit({permissionOverwrites: [
            {id: client.user.id, allow: ["SendMessages", "EmbedLinks", "ViewChannel"]}
        ]})
      await prisma.guild.create({
            data: {
                guildId: guild!.id,
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
        })

        await supportChannel.send({embeds: [embed], components: [row]})
        await interaction.reply({content: "Success", ephemeral: true})
    }
}