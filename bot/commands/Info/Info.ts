import {ApplicationCommandRegistry, Command, CommandOptionsRunTypeEnum} from "@sapphire/framework";
import {ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField} from "discord.js";
import {client} from "../../bot";

export class InfoCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options ) {
        super(context, {
            ...options,
            runIn: CommandOptionsRunTypeEnum.GuildText
        });
    }

    public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
        registry.registerChatInputCommand(builder => {
            builder.setName("info").setDescription("Tells you about the bot info!")
        })
    }

    public async chatInputRun(interaction:ChatInputCommandInteraction) {
        const commitHash = process.env.COMMIT_HASH
        console.log(commitHash)
        const embed = new EmbedBuilder()
            .setTitle("Bot Info")
            .setThumbnail(client.user.avatarURL())
            .addFields([
                {name: 'Version', value: `${commitHash}`, inline: true},
                {name: 'Support', value: 'https://discord.gg/ch8CxcNBZU', inline: true},
                {name: 'Website', value: 'https://tickettr.xyz', inline: true},
                {name: 'Github', value: 'https://github.com/lynxgian/Tickettr', inline: true},
            ]).toJSON()

        await interaction.reply({embeds: [embed]})
    }
}