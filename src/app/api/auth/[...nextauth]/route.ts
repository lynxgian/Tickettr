import NextAuth from "next-auth";
import DiscordProvider, {DiscordProfile} from "next-auth/providers/discord"

 const handler = NextAuth({
    providers: [
        DiscordProvider({
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            clientId: process.env.DISCORD_CLIENT_ID!,
            profile(profile: DiscordProfile) {
                if (profile.avatar === null) {
                    const defaultAvatarNumber = parseInt(profile.discriminator) % 5;
                    profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
                } else {
                    const format = profile.avatar.startsWith("a_") ? "gif" : "png";
                    profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
                }

                return {
                    id: profile.id,
                    name: profile.username,
                    discriminator: profile.discriminator,
                    image: profile.image_url,
                    accentColor: profile.accentColor,
                };
            }
        })
    ],
    callbacks: {

        async jwt({token, account, profile}) {
            if (account) {
                token.accessToken = account.access_token;
                token.tokenType = account.token_type;
            }
            if (profile) {
                token.profile = profile;
            }

            return {...token, ...account, ...profile}
        },
        async session({session, token }) {
            // @ts-ignore
            session.accessToken = token.accessToken;
            // @ts-ignore
            session.refreshToken = token.refreshToken;
            // @ts-ignore
            session.tokenType = token.tokenType;
            // @ts-ignore
            session.discordUser = token.profile;

            return session
        },


    },

})

export {handler as GET, handler as POST}