const { Client } = require("discord-rpc");
const rpc = new Client({ transport: "ipc" });
const axios = require("axios");

const { clientID, epicID, apiKey, assets } = require("./settings.json");

async function GetStats() {
    try {
        await axios.get(`https://fortnite-api.com/v2/stats/br/v2/${epicID}`, {
            headers: {
                'Authorization': apiKey
            }
        }).catch(err => {
            if (err.response) throw `[ERROR] ${err.response.data.error}, Status Code: ${err.response.data.status}`;
            if (err) throw err;
        }).then(res => {
            let data = res.data.data;

            return setStatus(data.battlePass.level, data.stats.all.overall.wins, data.stats.all.overall.kills, data.stats.all.overall.deaths, data.battlePass.progress, data.account.name);
        });
    } catch (err) {
        console.error(err);
    }
}

async function setStatus(bp, wins, kills, deaths, progress, username) {
    rpc.setActivity({
        details: `👑 ${bp.toLocaleString()} | ${progress}% (${100 - progress}% Left)`,
        state: `🏆 ${wins.toLocaleString()} | 🎯 ${kills.toLocaleString()} | 💀 ${deaths.toLocaleString()}`,
        largeImageKey: assets.large_img_key,
        largeImageText: `Fortnite Stats for: ${username}`
    });
    await new Promise((p => setTimeout(p, 60000)));
    GetStats();
}

rpc.on("ready", async () => {
    console.log('FN-RPC is now initalized.');
    GetStats();
})

rpc.login({
    clientId: clientID
});