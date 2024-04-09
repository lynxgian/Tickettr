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
    ChatInputCommandInteraction,
    ComponentBuilder,
    Embed,
    EmbedBuilder,
    Interaction,
    PermissionOverwrites,
    PermissionsBitField
} from "discord.js";
import {prisma} from "../../../src/lib/prisma";
import {Subcommand} from "@sapphire/plugin-subcommands";

export class SetUpCommand extends Subcommand {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            subcommands: [
                {
                    name: 'update-settings',
                    type: 'group',
                    entries: [
                        {
                            name: 'update-support-role',
                            chatInputRun: 'updateRole',
                        },
                        {
                            name: 'update-log-channel',
                            chatInputRun: 'updateLogChannel',
                        }
                    ]
                }
            ]
        });
    }

    public override registerApplicationCommands(registry: Subcommand.Registry) {
        registry.registerChatInputCommand(builder => {
            builder.setName("update").setDescription("update role and log channel of the guild").setDefaultMemberPermissions(PermissionsBitField.resolve("ManageGuild"))
                .addSubcommandGroup((group) =>
                    group
                        .setName('update-settings')
                        .setDescription('Update the settings for the guild')
                        .addSubcommand((command) =>
                            command
                                .setName('update-support-role')
                                .setDescription('Updates the support role of the guild')
                                .addRoleOption((options) =>
                                    options
                                        .setName('support-role')
                                        .setDescription('update the support role')
                                        .setRequired(true)
                                )
                        )
                        .addSubcommand((command) =>
                            command
                                .setName('update-log-channel')
                                .setDescription('Updates the log channel of the guild')
                                .addChannelOption((options) =>
                                    options
                                        .setName('log-channel')
                                        .setDescription('update the log channel')
                                        .setRequired(true)
                                )
                        )
                )
        })
    }

    public async updateRole(interaction: Subcommand.ChatInputCommandInteraction) {
      const guildDb = await prisma.guild.findFirst({
            where: {
                guildId: interaction.guildId!
            }
        })
        const membersWithRole =  interaction.guild.members.cache.filter(x => x.roles.cache.has(interaction.options.getRole('support-role', true).id))

        if (!guildDb) return interaction.reply({content: 'This guild has not been set up yet \n Please use /setup to get started!', ephemeral: true})
        console.log(membersWithRole.map(x => x.user.id))
        await prisma.guild.update({
            where: {
                guildId: interaction.guildId
            },
            data: {
                supportRoleId: {
                    set: interaction.options.getRole('support-role', true).id
                },
                staff: {
                    set: membersWithRole.map(x => x.user.id)
                }
            }
        })

        return await interaction.reply({content: `Successfully updated the support role of the guild to ${interaction.options.getRole('support-role', true)}`, ephemeral: true})
    }

    public async updateLogChannel(interaction: Subcommand.ChatInputCommandInteraction) {const guildDb = await prisma.guild.findFirst({
        where: {
            guildId: interaction.guildId!
        }
    })

        if (!guildDb) return interaction.reply({content: 'This guild has not been set up yet \n Please use /setup to get started!', ephemeral: true})
        await prisma.guild.update({
            where: {
                guildId: interaction.guildId!
            },
            data: {
                logChannelId: interaction.options.getChannel('log-channel', true).id
            }
        })

        return await interaction.reply({content: `Successfully updated the log channel of the guild to: <#${interaction.options.getChannel('log-channel', true).id}>`, ephemeral: true})
    }
}