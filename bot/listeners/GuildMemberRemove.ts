import {Listener} from "@sapphire/framework";
import {Client, GuildMember} from "discord.js";
import { prisma } from "../../src/lib/prisma";

export default class GuildMemberRemove extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            once: true,
            event: "guildMemberRemove"
        });
    }
    public async run(member: GuildMember) {
        const guildDb = await prisma.guild.findFirst({
            where: {
                guildId: member.guild.id
            }

        })

        if(!guildDb) return

        if (member.roles.cache.has(guildDb.supportRoleId)) {

            await prisma.guild.update({
                where: {
                    guildId: member.guild.id
                },
                data: {
                    staff: guildDb.staff.filter(x => x !== member.id)
                }
            })

        }
    }
}