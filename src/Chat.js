import React,{useEffect,useRef,useState} from 'react'
import * as Colyseus from 'colyseus.js'

function Chat() {
  const client = useRef(null)
  const message = useRef(null)
  const room = useRef(null)
  
  useEffect(() => {
    const url = 'ws://localhost:2567'
    
    client.current = new Colyseus.Client(url);
    
    client.current.joinOrCreate("chat").then(rm => {
      console.log("joined");
      room.current = rm
      
      rm.onStateChange.once(function(state) {
        console.log("initial room state:", state);
      });
      
      // new room state
      rm.onStateChange(function(state) {
        // this signal is triggered on each patch
      });
      
      // listen to patches coming from the server
      rm.onMessage("messages", function(message) {
        var p = document.createElement("p");
        p.innerText = message;
        document.querySelector("#messages").appendChild(p);
      });

      console.log(room)
    })
  }, [])

  const submitMessage = e=>{
    e.preventDefault();
    
    room.current.send("message", message.current.value);
    
    message.current.value = "";
  }
  
  return (
    <div>
      <h1>
        <a href="https://github.com/colyseus/colyseus-examples"><img src="https://cdn.jsdelivr.net/gh/colyseus/colyseus@master/media/header.png" height="100" alt="colyseus" /></a>
      </h1>
      
      <p>This room doesn't use the room's state. It just broadcast messages through "broadcast" method.</p>
      
      <strong>Messages</strong><br/>
      
      <form onSubmit={submitMessage}>
        <input type="text" ref={message} autoFocus/>
        <input type="submit" value="send" />
      </form>
      
      <div id="messages"></div>
    </div>
    )
  }
  
  export default Chat