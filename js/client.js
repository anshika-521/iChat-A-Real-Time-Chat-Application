const socket=io('http://localhost:8000');

// Get DOM elements in respective JS variables
const form=document.getElementById('send-container');
const messageInp=document.getElementById('messageInp');
const messageContainer= document.querySelector('.container');

// Audio played on receiving the messages
const audio=new Audio('Ting.mp3');

// Function which will append event to the container
const append=(message, position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');    
    messageElement.classList.add(position);    
    messageContainer.append(messageElement);
    if(position=='left')
    {
        audio.play();
    }
}

// Ask new user their name and let the server know
const user_name=prompt("Enter Your Name to join the Chat", "Guest");

socket.emit('new-user-joined', user_name);

// If the new user joins, receive their name from the server
socket.on('user-joined', user_name=>{
    append(`${user_name} joined the chat`, 'center');
});

// If server sends a message, receive it
socket.on('receive', data=>{
    append(`${data.user_name}: ${data.message}`, 'left');
});

// If a user leaves the chat, append the info to the container
socket.on('left', user_name=>{
    append(`${user_name} left the chat`, 'center');
});

// If the form get submitted, send server the message
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message=messageInp.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInp.value='';
})

