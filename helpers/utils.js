const fs = require('fs');
const path = require('path');

module.exports = {
    ensureTempDir: () => {
        const tempDir = path.join(__dirname, '../assets/temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        return tempDir;
    },

    cleanTemp: () => {
        const tempDir = path.join(__dirname, '../assets/temp');
        if (fs.existsSync(tempDir)) {
            fs.readdirSync(tempDir).forEach(file => {
                fs.unlinkSync(path.join(tempDir, file));
            });
        }
    },

    isAdmin: (sock, jid, user) => {
        return sock.groupMetadata(jid)
            .then(metadata => metadata.participants.find(p => p.id === user)?.admin === 'admin')
            .catch(() => false);
    }
};
