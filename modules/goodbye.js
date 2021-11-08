const { MessageType } = require("@adiwajshing/baileys");
const Strings = require("../lib/db");
const inputSanitization = require("../sidekick/input-sanitization");
const Greetings = require("../database/greeting");
const GOODBYE = Strings.goodbye;

module.exports = {
    name: "goodbye",
    description: GOODBYE.DESCRIPTION,
    extendedDescription: GOODBYE.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [".goodbye", ".goodbye off", ".goodbye delete"],
    },
    async handle(client, chat, BotsApp, args) {
        try {
            if (!BotsApp.isGroup) {
                client.sendMessage(
                    BotsApp.chatId,
                    GOODBYE.NOT_A_GROUP,
                    MessageType.text
                );
                return;
            }
            if (args.length == 0) {
                var enabled = await Greetings.checkSettings(
                    BotsApp.chatId,
                    "goodbye"
                );
                var Msg = await Greetings.getMessage(BotsApp.chatId, "goodbye");
                try {
                    if (enabled === false || enabled === undefined) {
                        client.sendMessage(
                            BotsApp.chatId,
                            GOODBYE.SET_GOODBYE_FIRST,
                            MessageType.text
                        );
                        return;
                    } else if (enabled === "OFF") {
                        client.sendMessage(
                            BotsApp.chatId,
                            GOODBYE.CURRENTLY_DISABLED,
                            MessageType.text
                        );
                        client.sendMessage(
                            BotsApp.chatId,
                            Msg.message,
                            MessageType.text
                        );
                        return;
                    }

                    client.sendMessage(
                        BotsApp.chatId,
                        GOODBYE.CURRENTLY_ENABLED,
                        MessageType.text
                    );
                    client.sendMessage(
                        BotsApp.chatId,
                        Msg.message,
                        MessageType.text
                    );
                } catch (err) {
                    throw err;
                }
            } else {
                try {
                    if (
                        args[0] === "OFF" ||
                        args[0] === "off" ||
                        args[0] === "Off"
                    ) {
                        switched = "OFF";
                        await Greetings.changeSettings(
                            BotsApp.chatId,
                            switched
                        );
                        client.sendMessage(
                            BotsApp.chatId,
                            GOODBYE.GREETINGS_UNENABLED,
                            MessageType.text
                        );
                        return;
                    }
                    if (
                        args[0] === "ON" ||
                        args[0] === "on" ||
                        args[0] === "On"
                    ) {
                        switched = "ON";
                        await Greetings.changeSettings(
                            BotsApp.chatId,
                            switched
                        );
                        client.sendMessage(
                            BotsApp.chatId,
                            GOODBYE.GREETINGS_ENABLED,
                            MessageType.text
                        );
                        return;
                    }
                    if (args[0] === "delete") {
                        var Msg = await Greetings.deleteMessage(
                            BotsApp.chatId,
                            "goodbye"
                        );
                        if (Msg === false || Msg === undefined) {
                            client.sendMessage(
                                BotsApp.chatId,
                                GOODBYE.SET_GOODBYE_FIRST,
                                MessageType.text
                            );
                            return;
                        }
                        await client.sendMessage(
                            BotsApp.chatId,
                            GOODBYE.GOODBYE_DELETED,
                            MessageType.text
                        );

                        return;
                    }
                    text = BotsApp.body.replace(
                        BotsApp.body[0] + BotsApp.commandName + " ",
                        ""
                    );

                    var Msg = await Greetings.getMessage(
                        BotsApp.chatId,
                        "goodbye"
                    );
                    if (Msg === false || Msg === undefined) {
                        await Greetings.setGoodbye(BotsApp.chatId, text);
                        await client.sendMessage(
                            BotsApp.chatId,
                            GOODBYE.GOODBYE_UPDATED,
                            MessageType.text
                        );

                        return;
                    } else {
                        await Greetings.deleteMessage(
                            BotsApp.chatId,
                            "goodbye"
                        );
                        await Greetings.setGoodbye(BotsApp.chatId, text);
                        await client.sendMessage(
                            BotsApp.chatId,
                            GOODBYE.GOODBYE_UPDATED,
                            MessageType.text
                        );
                        return;
                    }
                } catch (err) {
                    throw err;
                }
            }
        } catch (err) {
            await inputSanitization.handleError(err, client, BotsApp);
        }
    },
};
