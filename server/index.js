const io = require('socket.io')(3000);

const  arrUserInfo = [];
io.on('connection',socket=>{
    socket.on('REGISTER_USERNAME',user=>{
        const isExist = arrUserInfo.some(e => e.username === user.username);
        socket.peerID = user.peerID;
        if(isExist) return socket.emit('FAILED');
        arrUserInfo.push(user);
        socket.emit('LIST_REGISTER',arrUserInfo);
        socket.broadcast.emit('NEW_USER',user)
    });
    socket.on('disconnect',()=>{
        const  index = arrUserInfo.findIndex(user => user.peerID === socket.peerID);
        arrUserInfo.splice(index,1);
        io.emit('USER_DISCONNECT',socket.peerID)

    });
});

