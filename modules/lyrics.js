const got = require("got");
const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const inputSanitization = require("../sidekick/input-sanitization");
const STRINGS = require("../lib/db");

module.exports = {
    name: "lyrics",
    description: STRINGS.lyrics.DESCRIPTION,
    extendedDescription: STRINGS.lyrics.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".lyrics love nwantiti" },
    async handle(client, chat, BotsApp, args) {
        const processing = await client.sendMessage(
            BotsApp.chatId,
            STRINGS.lyrics.PROCESSING,
            MessageType.text
        );
        try {
            var song = "";
            if (BotsApp.isReply) {
                song = BotsApp.replyMessage;
            } else if (args.length == 0) {
                client.sendMessage(
                    BotsApp.chatId,
                    STRINGS.lyrics.NO_ARG,
                    MessageType.text
                );
                return;
            } else {
                song = args.join(" ");
            }
            let Response = await got(
                `https://some-random-api.ml/lyrics/?title=${song}`
            );
            let data = JSON.parse(Response.body);
            let caption =
                "*Title :* " +
                data.title +
                "\n*Author :* " +
                data.author +
                "\n*Lyrics :*\n" +
                data.lyrics;

            try {
                await client.sendMessage(
                    BotsApp.chatId,
                    { url: data.thumbnail.genius },
                    MessageType.image,
                    {
                        mimetype: Mimetype.png,
                        caption: caption,
                        thumbnail: null,
                    }
                );
            } catch (err) {
                client.sendMessage(BotsApp.chatId, caption, MessageType.text);
            }
            await client.deleteMessage(BotsApp.chatId, {
                id: processing.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true,
            });
            // return;
        } catch (err) {
            await inputSanitization.handleError(
                err,
                client,
                BotsApp,
                STRINGS.lyrics.NOT_FOUND
            );
            return await client.deleteMessage(BotsApp.chatId, {
                id: processing.key.id,
                remoteJid: BotsApp.chatId,
                fromMe: true,
            });
        }
    },
};
