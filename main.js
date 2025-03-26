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

// Configura il tuo token Discord e l'ID del canale vocale
const TOKEN = 'MTM1NDUyNzgwNDQxODU2MDA1Mw.GVSMX1.2IBD-d6v_sP5vdG1EydFXK5F9uoMTFBYDUVkq4';
const VOICE_CHANNEL_ID = '1213582269936308265';
const GUILD_ID = '1212788183079714846';

// Percorso del file audio
const AUDIO_FILE_PATH = path.join(__dirname, 'audio', 'song.mp3');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log(`Bot avviato: ${client.user.tag}`);
    
    // Connetti al canale vocale
    const channel = client.channels.cache.get(VOICE_CHANNEL_ID);
    if (channel) {
        try {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: GUILD_ID,
                adapterCreator: channel.guild.voiceAdapterCreator
            });

            // Crea il lettore audio
            const player = createAudioPlayer();
            
            // Crea la risorsa audio
            const resource = createAudioResource(AUDIO_FILE_PATH, {
                inputType: StreamType.Arbitrary
            });

            // Collega il player al canale
            connection.subscribe(player);

            // Avvia la riproduzione
            player.play(resource);

            // Gestisci il loop
            player.on(AudioPlayerStatus.Idle, () => {
                // Ricrea la risorsa audio e riproduci
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