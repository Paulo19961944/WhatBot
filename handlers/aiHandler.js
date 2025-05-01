const axios = require('axios');
const logger = require('../helpers/logger');
const config = require('../../config/config.json');

module.exports = {
    chatGPT: async (sock, message, args) => {
        if (!args[0]) {
            return sock.sendMessage(message.key.remoteJid, {
                text: '💬 Por favor, faça uma pergunta. Exemplo: /chatgpt Qual é a capital do Brasil?'
            }, { quoted: message });
        }

        if (!config.openai_key) {
            return sock.sendMessage(message.key.remoteJid, {
                text: '🔑 Chave da API OpenAI não configurada.'
            }, { quoted: message });
        }

        try {
            const question = args.join(' ');

            await sock.sendMessage(message.key.remoteJid, {
                text: '🤖 Pensando...'
            }, { quoted: message });

            const response = await axios.post('<https://api.openai.com/v1/chat/completions>', {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: question }],
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${config.openai_key}`,
                    'Content-Type': 'application/json'
                }
            });

            const answer = response.data.choices[0].message.content;
            await sock.sendMessage(message.key.remoteJid, {
                text: `🤖 ChatGPT:\\n\\n${answer}`
            }, { quoted: message });
        } catch (error) {
            logger.error('Erro ao consultar ChatGPT:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Erro ao consultar o ChatGPT. Tente novamente mais tarde.'
            });
        }
    }
};
