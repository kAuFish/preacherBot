module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        // client.user.setAvatar(__dirname + `/../../data/avatar.png`);
        console.log(`Ready!!! ${client.user.tag} is logged in and online.`);
    }
}