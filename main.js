const { Client, GatewayIntentBits } = require('discord.js');
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus,
    StreamType 
} = require('@discordjs/voice');
const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

const TOKEN = 'MTM1NDUyNzgwNDQxODU2MDA1Mw.GFh9q_._Or-heoU8TFcoRJqG7Z_YjwQltre-Y2X-fxVt0';
const VOICE_CHANNEL_ID = '1213582269936308265';
const GUILD_ID = '1212788183079714846';

const AUDIO_FILE_PATH = path.join(__dirname, 'audio', 'song.mp3');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log(`Bot avviato: ${client.user.tag}`);
    
    const channel = client.channels.cache.get(VOICE_CHANNEL_ID);
    if (channel) {
        try {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: GUILD_ID,
                adapterCreator: channel.guild.voiceAdapterCreator
            });
            const player = createAudioPlayer();
            
            const resource = createAudioResource(AUDIO_FILE_PATH, {
                inputType: StreamType.Arbitrary
            });

            connection.subscribe(player);

            player.play(resource);

            player.on(AudioPlayerStatus.Idle, () => {
                const newResource = createAudioResource(AUDIO_FILE_PATH, {
                    inputType: StreamType.Arbitrary
                });
                player.play(newResource);
            });

            console.log('Riproduzione audio avviata');
        } catch (error) {
            console.error('Errore nella connessione vocale:', error);
        }
    } else {
        console.error('Canale vocale non trovato');
    }
});

// Gestisci gli errori
client.on('error', console.error);

// Connetti il bot
client.login(TOKEN);
