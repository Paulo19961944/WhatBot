# 🤖 WhatsApp Bot com Node.js

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Baileys](https://img.shields.io/badge/Baileys-6.x-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

Um bot completo para WhatsApp com múltiplos comandos úteis, desenvolvido usando a biblioteca Baileys.

## 📌 Recursos Principais

- ✅ Criação de stickers
- 🛡️ Ferramentas de moderação
- 🔍 Consultas de CEP e DDD
- 📥 Download de conteúdo do YouTube
- 🤖 Integração com IA (ChatGPT)
- ✨ E muito mais!

## 🚀 Como Instalar

### Pré-requisitos
- Termux (Android) ou Node.js instalado
- Número de WhatsApp válido

### Instalação no Termux

```bash
# Atualize os pacotes
pkg update && pkg upgrade -y

# Instale as dependências
pkg install -y nodejs git ffmpeg python

# Instale o yt-dlp
pip install yt-dlp

# Clone este repositório
git clone https://github.com/Paulo19961944/whatsapp-bot.git
cd whatsapp-bot

# Instale as dependências do Node
npm install

# Configure o bot
nano config/config.json

# Inicie o bot
node index.js
```

## ⚙️ Configuração

Edite o arquivo `config/config.json`:

```json
{
  "prefix": "/",
  "admins": ["5511999999999@s.whatsapp.net"],
  "openai_key": "sua-chave-da-openai",
  "youtube_api_key": "sua-chave-do-youtube"
}
```

## 📜 Lista de Comandos

| Comando           | Descrição                                  | Exemplo                     |
|-------------------|-------------------------------------------|-----------------------------|
| `/sticker`        | Cria sticker de mídia marcada             | Marque uma imagem + comando |
| `/ban @usuário`   | Remove usuário (apenas admins)            | `/ban @5511999999999`       |
| `/hidetag`        | Mensagem oculta para todos                | `/hidetag Atenção!`         |
| `/cep`            | Consulta CEP                              | `/cep 01001000`             |
| `/ddd`            | Consulta DDD                              | `/ddd 11`                   |
| `/youtubetomp3`   | Baixa áudio do YouTube                    | `/youtubetomp3 [URL]`       |
| `/youtubetomp4`   | Baixa vídeo do YouTube                    | `/youtubetomp4 [URL]`       |
| `/chatgpt`        | Pergunta ao ChatGPT                       | `/chatgpt O que é Node.js?` |
| `/help`           | Mostra todos os comandos                  | `/help`                     |

## 🏗️ Estrutura do Projeto

```
.
├── config/          # Configurações
├── handlers/        # Lógica dos comandos
├── helpers/         # Utilitários
├── assets/          # Arquivos temporários
├── .gitignore
├── package.json
├── index.js         # Código principal
└── README.md
```

## 🔧 Manutenção

Para manter o bot rodando:

```bash
# Usando tmux
tmux new -s whatsapp-bot
node index.js
# Ctrl+B depois D para desanexar
```

Para atualizar:

```bash
git pull origin main
npm install
```

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 💬 Suporte

Problemas? Abra uma [issue](https://github.com/seu-usuario/whatsapp-bot/issues) no GitHub.

---

> **Nota**: Este projeto não tem afiliação com o WhatsApp. Use por sua conta e risco.
