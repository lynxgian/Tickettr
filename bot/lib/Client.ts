import {join} from 'path'
import {SapphireClient} from "@sapphire/framework";

export default class TickettrClient extends SapphireClient  {

    constructor() {
        super({
            intents: ["MessageContent", "Guilds", "GuildMessages"]
        });
    }


    public run() {
        this.login(process.env.TOKEN);
    }

 }