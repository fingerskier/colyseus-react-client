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
    client.current.joinOrCreate("lobby").then(room_instance => {
        lobby.current = room_instance;
        onjoin();
        console.log("Joined lobby room!");

    }).catch(e => {
        console.error("Error", e);
    });
  }

  function onjoin() {
      lobby.current.onMessage("rooms", (rooms) => {
          allRooms.current = rooms;
          update_full_list();

          console.log("Received full list of rooms:", allRooms.current);
      });

      lobby.current.onMessage("+", ([roomId, roomInstance]) => {
          const roomIndex = allRooms.current.findIndex((room) => room.roomId === roomId);

          if (roomIndex !== -1) {
              console.log("Room update:", roomInstance);
              allRooms.current[roomIndex] = roomInstance;

          } else {
              console.log("New room", roomInstance);
              allRooms.current.push(roomInstance);
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
    if (lobby.current) {
      lobby.current.leave();

    } else {
      console.warn("Not connected.");
    }
  }

  return (
    <div>
      <p>This example shows how to use <code>LobbyRoom</code>:</p>
      <ul>
          <li>When you join a lobby, you'll receive the current list of rooms</li>
          <li>Then, you'll receive updates when rooms are created, updated, or removed.</li>
          <li>(All rooms on colyseus-examples have <code>.enableRealtimeListing()</code>, try joining other demos to see realtime updates here)</li>
          <li><a href="https://docs.colyseus.io/builtin-rooms/lobby/">See documentation</a></li>
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