import React,{useEffect,useRef,useState} from 'react'
import * as Colyseus from 'colyseus.js'

function Lobby() {
  const allRooms = useRef(null)
  const client = useRef(null)
  const lobby = useRef(null)
  
  useEffect(() => {
    const url = 'ws://localhost:2567'
    
    client.current = new Colyseus.Client(url);
    
  }, [])
  
  function join () {
    // Logged into your app and Facebook.
    client.current.joinOrCreate("custom_lobby").then(room_instance => {
      lobby.current = room_instance;
      console.log(lobby.current.serializer);
      onjoin();
      console.log("Joined lobby room!");
    }).catch(e => {
      console.error("Error", e);
    });
  }
  
  function onjoin() {
    lobby.current.onStateChange((state) => {
      console.log("Custom lobby state:", state);
    })

    lobby.current.onMessage("rooms", (rooms) => {
      allRooms.current = rooms;
      update_full_list();
      
      console.log("Received full list of rooms:", allRooms.current);
    });
    
    lobby.current.onMessage("+", ([roomId, room]) => {
      const roomIndex = allRooms.current.findIndex((room) => room.roomId === roomId);
      if (roomIndex !== -1) {
        console.log("Room update:", room);
        allRooms.current[roomIndex] = room;
      } else {
        console.log("New room", room);
        allRooms.current.push(room);
      }
      update_full_list();
    });

    lobby.current.onMessage("-", (roomId) => {
      console.log("Room removed", roomId);
      allRooms.current = allRooms.current.filter((room) => room.roomId !== roomId);
      update_full_list();
    });

    lobby.current.onLeave(() => {
      allRooms.current = [];
      update_full_list();
      console.log("Bye, bye!");
    });
  }

  function update_full_list() {
    var el = document.getElementById('all_rooms');
    el.innerHTML = allRooms.current.map(function(room) {
      return "<li><code>" + JSON.stringify(room) + "</code></li>";
    }).join("\n");
  }

  function leave() {
    if (lobby) {
      lobby.current.leave();

    } else {
      console.warn("Not connected.");
    }
  }

  return (
    <div>
    <p>This example shows how to use a custom <code>LobbyRoom</code>:</p>
    <ul>
    <li>The same as <a href="05-lobby-room.html">05-lobby-room.html</a> (<a href="https://docs.colyseus.io/builtin-rooms/lobby/">See documentation</a>)</li>
    <li>Uses a room that extends LobbyRoom, and use a custom state.</li>
    </ul>

    <p>Open Developer Tools for log messages.</p>

    <p><strong>Commands</strong></p>

    <button onClick={join}>join lobby</button>
    <button onClick={leave}>leave lobby</button>

    <h2>All rooms:</h2>
    <ul id="all_rooms"></ul>
    </div>
    )
  }
  
  export default Lobby