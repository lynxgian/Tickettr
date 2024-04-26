import {join} from 'path'
import {SapphireClient} from "@sapphire/framework";

export default class TickettrClient extends SapphireClient  {

    constructor() {
        super({
            intents: ["MessageContent", "Guilds", "GuildMessages", "GuildMembers", "GuildPresences"],
            baseUserDirectory: join(process.cwd(), "dist", "bot")
        });
    }


    public run() {
        this.login(process.env.TOKEN);
    }

 }