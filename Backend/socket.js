const onlineUsers = {};
const randomSpace = {};

const socketHandler = (io) => {
    io.on('connection', (socket) => {
        socket.on('registerUser', (username) => {
            onlineUsers[username] = socket.id;
            io.emit('updateOnlineStatus', { username, online: true });
            socket.emit('currentOnlineStatuses', onlineUsers);
            io.emit('currentOnlineStatuses', onlineUsers);
        });

        socket.on('challengeFriend', ({ from, to }) => {
            if (onlineUsers[to]) {
                socket.to(onlineUsers[to]).emit('friendChallenged', { from, to });
            }
        });

        socket.on('respondToChallenge', ({ from, to, response }) => {
            if (response === 'accept') {
                const roomID = `contest_${from}_${to}`;
                socket.join(roomID);
                io.to(onlineUsers[from]).emit('redirectToContest', { roomID });
                io.to(onlineUsers[to]).emit('redirectToContest', { roomID });
                io.to(roomID).emit('contestReady', { roomID, users: [from, to] });
            }
        });

        socket.on('findRandomOpponent', ({ userName }) => {
            if (!randomSpace[userName]) {
                randomSpace[userName] = true;
                const users = Object.keys(randomSpace);
                if (users.length > 1) {
                    const opponents = users.filter(user => user !== userName);
                    const randomIndex = Math.floor(Math.random() * opponents.length);
                    const opponent = opponents[randomIndex];
                    const roomID = `contest_${userName}_${opponent}`;
                    io.to(onlineUsers[userName]).emit('redirectToContest', { roomID });
                    io.to(onlineUsers[opponent]).emit('redirectToContest', { roomID });
                    delete randomSpace[userName];
                    delete randomSpace[opponent];
                }
            } else {
                socket.emit('alreadySearching', { message: `${userName} is already looking for an opponent.` });
            }
        });

        socket.on('cancelRandomSearch', ({ userName }) => {
            if (randomSpace[userName]) {
                delete randomSpace[userName];
            }
        });

        socket.on('joinRoom', ({ roomID, userName }) => {
            socket.join(roomID);
            onlineUsers[userName] = socket.id;
            socket.to(roomID).emit('userJoined', { userName });
        });

        socket.on('leaveRoom', ({ roomID, userName }) => {
            socket.leave(roomID);
            delete onlineUsers[userName];
            socket.to(roomID).emit('userLeft', { userName });
        });

        socket.on('contestResult', ({ roomID, winner }) => {
            const roomParts = roomID.split('_');
            const participant1 = roomParts[1];
            const participant2 = roomParts[2];
            const loser = winner === participant1 ? participant2 : participant1;
            io.to(roomID).emit('contestResult', { winner, loser });

            setTimeout(() => {
                io.in(roomID).socketsLeave(roomID);
            }, 5000);
        });

        socket.on('disconnect', () => {
            for (const [username, id] of Object.entries(onlineUsers)) {
                if (id === socket.id) {
                    delete onlineUsers[username];
                    io.emit('updateOnlineStatus', { username, online: false });
                    const rooms = Object.keys(socket.rooms);
                    rooms.forEach(room => {
                        if (room.startsWith('contest_')) {
                            io.to(room).emit('userDisconnected', { username });
                        }
                    });
                    break;
                }
            }
        });
    });
};

module.exports = socketHandler;
