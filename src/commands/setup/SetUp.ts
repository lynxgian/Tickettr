import {ApplicationCommandRegistry, Command, CommandOptionsRunTypeEnum} from "@sapphire/framework";
import {ChatInputCommandInteraction, PermissionsBitField} from "discord.js";

export class SetUpCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options ) {
        super(context, {
            ...options,

            requiredUserPermissions: ["ManageGuild"],
            runIn: CommandOptionsRunTypeEnum.GuildText
        });
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(builder => {
            builder.setName("setup").setDescription("Sets Up Guild").setDefaultMemberPermissions(PermissionsBitField.resolve("ManageGuild"))
        })
    }

    public async chatInputRun(interaction:ChatInputCommandInteraction) {
        await interaction.reply({content: "Success"})
    }
}