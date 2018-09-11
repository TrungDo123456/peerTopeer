const  socket = io('http://localhost:3000');
$('#chat').hide();
socket.on('LIST_REGISTER',arrUserInfo=>{
    $('#chat').show();
    $('#register').hide();
    arrUserInfo.forEach(user=>{
        const {username,peerID} = user;
        $('#list_user').append(`<li id="${peerID}">${username}</li>`)
    });
    socket.on('NEW_USER',user=>{
        const {username,peerID} = user;
        $('#list_user').append(`<li id="${peerID}">${username}</li>`)
    });
    socket.on('USER_DISCONNECT',peerID=>{
        $(`#${peerID}`).remove();
    })
});

socket.on('FAILED',()=>{
    alert('Vui long chon user khac')
});

$('#list_user').on('click','li',function () {
   const id = $(this).attr('id');
    openStream().then(stream=>{
        playStream('localStream',stream);
        const call = peer.call(id,stream);
        call.on('stream',remoteStream =>{
            playStream('remoteStream',remoteStream)
        },function(err) {
            console.log('Failed to get local stream' ,err);
        });
    })

});

function openStream() {
    const config={audio:false,video:true};
    return navigator.mediaDevices.getUserMedia(config)
}

function playStream(idVideoTag,stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

// openStream()
// .then(stream => playStream('localStream',stream));

const peer = new Peer();
peer.on('open', id => {
    $('#id_peer').append(id);
    $('#btnSignUp').click(()=>{
        const username = $('#txtUsername').val();
        socket.emit('REGISTER_USERNAME',{username:username,peerID :id});
    });
});


//Caller
$('#btnCall').click(()=>{
    const id = $('#txtIdRemoteStream').val();
    openStream().then(stream=>{
        playStream('localStream',stream);
        const call = peer.call(id,stream);
        call.on('stream',remoteStream =>{
            playStream('remoteStream',remoteStream)
        },function(err) {
            console.log('Failed to get local stream' ,err);
        });
    })
});

//Answer
peer.on('call', call=>{
    openStream().then(stream=>{
        call.answer(stream);
        playStream('localStream',stream);
        call.on('stream',remoteStream =>{
            playStream('remoteStream',remoteStream)
        },function(err) {
            console.log('Failed to get local stream' ,err);
        });
    })
});



// Register Username

