"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@sapphire/framework");
class ReadyEvent extends framework_1.Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            once: true,
            event: "ready"
        });
    }
    run(client) {
        client.user.setActivity("Tickets!", { type: 2 });
        client.user.setPresence({ status: 'online' });
        console.log(`${client.user.username} is ready!`);
    }
}
exports.default = ReadyEvent;
