"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const framework_1 = require("@sapphire/framework");
class TickettrClient extends framework_1.SapphireClient {
    constructor() {
        super({
            intents: ["MessageContent", "Guilds", "GuildMessages", "GuildMembers", "GuildPresences"],
            baseUserDirectory: (0, path_1.join)(process.cwd(), "dist", "bot")
        });
    }
    run() {
        this.login(process.env.TOKEN);
    }
}
exports.default = TickettrClient;
