"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@sapphire/framework");
const prisma_1 = require("../../src/lib/prisma");
class ReadyEvent extends framework_1.Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: "guildMemberUpdate"
        });
    }
    async run(oldMember, newMember) {
        const guild = await prisma_1.prisma.guild.findFirst({
            where: {
                guildId: oldMember.guild.id
            },
            select: {
                supportRoleId: true
            }
        });
        if (!guild)
            return;
        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;
        if (!oldRoles.has(guild.supportRoleId)) {
            await prisma_1.prisma.guild.update({
                where: {
                    guildId: newMember.guild.id
                },
                data: {
                    staff: {
                        push: [`${newMember.user.id}`]
                    }
                }
            });
        }
        const getAllStaff = await prisma_1.prisma.guild.findFirst({
            where: {
                guildId: oldMember.guild.id
            },
            select: {
                staff: true
            }
        });
        if (!newRoles.has(guild.supportRoleId)) {
            await prisma_1.prisma.guild.update({
                where: {
                    guildId: oldMember.guild.id,
                },
                data: {
                    staff: {
                        set: getAllStaff.staff.filter(x => x !== oldMember.user.id)
                    }
                }
            });
        }
    }
}
exports.default = ReadyEvent;
