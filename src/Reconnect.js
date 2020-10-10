import React,{useEffect,useRef,useState} from 'react'
import * as Colyseus from 'colyseus.js'

function Reconnect() {
  const client = useRef(null)
  const room = useRef(null)

  useEffect(() => {
    const url = 'ws://localhost:2567'

    client.current = new Colyseus.Client(url);
  }, [])

  function join () {
    // Logged into your app and Facebook.
    client.current.joinOrCreate("reconnection").then(room_instance => {
      room.current = room_instance;
      onjoin();
      console.log("Joined successfully!");

    }).catch(e => {
      console.error("Error", e);
    });
  }

  function onjoin() {
    room.current.onMessage("status", (message) => console.log(message));
    room.current.onLeave(() => console.log("Bye, bye!"));

    localStorage.setItem("roomId", room.current.id);
    localStorage.setItem("sessionId", room.current.sessionId);
  }

  function leave() {
    if (room.current) {
      room.current.connection.close();

    } else {
      console.warn("Not connected.");
    }
  }

  function reconnect() {
    var roomId = localStorage.getItem("roomId");
    var sessionId = localStorage.getItem("sessionId");

    client.current.reconnect(roomId, sessionId)
    .then(room_instance => {
      room.current = room_instance;
      onjoin();
      console.log("Reconnected successfully!");
    })
    .catch(e => {
      console.error("Error", e);
    });

  }

  return (<>
    <p>This example shows how to use</p>
    
    <ul>
      <li><code>allowReconection()</code> - server-side</li>
      <li><code>reconnect()</code> - client-side</li>
    </ul>

    <p>...to reestablish a connection into a <code>Room</code>.</p>

    <p>Open Developer Tools for log messages.</p>

    <p><strong>Commands</strong></p>

    <button onClick={join}>join room</button>
    <button onClick={leave}>forcibly close room connection</button>
    <button onClick={reconnect}>reconnect</button>
  </>)
}

export default Reconnect