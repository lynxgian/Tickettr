import {Listener} from "@sapphire/framework";
import {Client, GuildMember} from "discord.js";
import {prisma} from "../../src/lib/prisma";

export default class ReadyEvent extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: "guildMemberUpdate"
        });
    }
    public async run(oldMember: GuildMember, newMember: GuildMember) {
       const guild = await prisma.guild.findFirst({
            where: {
                guildId: oldMember.guild.id
            },
            select: {
                supportRoleId: true
            }
        })
        if(!guild) return
        const oldRoles = oldMember.roles.cache
        const newRoles = newMember.roles.cache

            if (!oldRoles.has(guild.supportRoleId)) {
                await prisma.guild.update({
                    where: {
                        guildId: newMember.guild.id
                    },
                    data: {
                        staff: {
                            push: [`${newMember.user.id}`]
                        }
                    }
                })
            }

            const getAllStaff = await prisma.guild.findFirst({
                where: {
                    guildId: oldMember.guild.id
                },
                select: {
                    staff: true
                }
            })
            if (!newRoles.has(guild.supportRoleId)) {
                await prisma.guild.update({
                    where: {
                        guildId: oldMember.guild.id,
                    },
                    data: {
                        staff: {
                            set: getAllStaff.staff.filter(x => x !== oldMember.user.id)
                        }
                    }
                })
             }
    }

}