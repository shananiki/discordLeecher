// Initialize dotenv
require('dotenv').config(); 
const bot_token = process.env.CLIENT_TOKEN;

const { Client, IntentsBitField  } = require('discord.js');
const fs = require('fs');
const path = require('path');

const https = require('https');


const client = new Client({ 
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// Channels to watch
const channelsToWatch = ['general', 'spam'];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Login 
client.login(process.env.CLIENT_TOKEN);

const filePath = path.join(__dirname, 'logs');
// Memorize Index 
const indexPath = './data.txt';
readIndex();

function writeIndex(number){
    fs.writeFile(indexPath, number.toString(), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log('Number has been written to the file successfully!');
    });
}

function readIndex(){
    fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading from file:', err);
            return;
        }
        const indexFromFile = parseInt(data, 10);
        console.log('Number read from file:', indexFromFile);
        fileIndex = indexFromFile;
    });
}


function downloadURL(fileUrl, destination){
    const fileStream = fs.createWriteStream(filePath + '/' + destination);
    https.get(fileUrl, response => {
        response.pipe(fileStream);
        response.on('end', () => {
            console.log(destination + ' downloaded successfully!');
            fileIndex++;
            writeIndex(fileIndex);
            
        });
    }).on('error', error => {
        console.error(`Error downloading file: ${error.message}`);
    });
}


client.on('messageCreate',  async message => {
    if (channelsToWatch.includes(message.channel.name)) {
        console.log(`[${message.channel.name}] ${message.author.tag}: ${message.content}`);

        // Check attachments
        if(message.attachments){
            message.attachments.forEach((attachment) => {
                var fileName = attachment.name;
                var fileUrl = attachment.url;
                // extension getten
                var ext = "." + attachment.contentType.split('/')[1];
                downloadURL(fileUrl, fileIndex + ext);
            });
        }
    }
});