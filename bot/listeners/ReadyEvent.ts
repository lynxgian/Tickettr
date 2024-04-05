import {Listener} from "@sapphire/framework";
import {Client} from "discord.js";

export default class ReadyEvent extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            once: true,
            event: "ready"
        });
    }
    public run(client: Client) {
        client.user.setActivity("Tickets!", {type: 2})
        client.user.setPresence({status: 'online'})
        console.log(`${client.user.username} is ready!`)
    }
}