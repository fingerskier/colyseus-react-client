import React,{useEffect,useRef,useState} from 'react'
import * as Colyseus from 'colyseus.js'

function Chat() {
  const client = useRef(null)
  const message = useRef(null)
  const room = useRef(null)
  
  useEffect(() => {
    const url = 'ws://localhost:2567'
    
    client.current = new Colyseus.Client(url);
  }, [])
  
  var colors = ['red', 'green', 'yellow', 'blue', 'cyan', 'magenta'];
  var players = {};
  
  function join() {
    client.current.joinOrCreate("relay", {
      name: document.getElementById('username').value
    }).then(room_instance => {
      room.current = room_instance
      
      room.current.onLeave(() => console.log("Bye, bye."));
      
      room.current.onMessage('move', ([sessionId, movement]) => {
        local_move(sessionId, movement);
      });
      
      // listen to patches coming from the server
      room.current.state.players.onAdd = function (player, sessionId) {
        var dom = document.createElement("div");
        dom.className = "player";
        dom.style.left = "0px";
        dom.style.top = "0px";
        dom.style.background = colors[Math.floor(Math.random() * colors.length)];
        dom.innerText = `${player.name || "[no name]"} (${sessionId})`;

        players[sessionId] = dom;
        document.body.appendChild(dom);
      }

      room.current.state.players.onRemove = function (player, sessionId) {
        document.body.removeChild(players[sessionId]);
        delete players[sessionId];
      }

      window.addEventListener("keydown", function (e) {
        if (e.which === 38) {
          up();
        } else if (e.which === 39) {
          right();
        } else if (e.which === 40) {
          down();
        } else if (e.which === 37) {
          left();
        }
      });
    });
  }
  
  function leave() {
    if (room.current) {
      room.current.leave();
    }
  }
  
  function local_move(sessionId, movement) {
    var dom = players[sessionId];
    if (movement.x) {
      dom.style.left = parseInt(dom.style.left) + movement.x + "px";
    }
    if (movement.y) {
      dom.style.top = parseInt(dom.style.top) + movement.y + "px";
    }
  }
  
  function up () {
    var movement = { y: -10 };
    
    // move locally instantly
    local_move(room.current.sessionId, movement);
    
    room.current.send("move", movement);
  }
  
  function right () {
    var movement = { x: 10 };
    
    // move locally instantly
    local_move(room.current.sessionId, movement);
    
    room.current.send("move", movement);
  }
  
  function down () {
    var movement = { y: 10 };
    
    // move locally instantly
    local_move(room.current.sessionId, movement);
    
    room.current.send("move", movement);
  }
  
  function left () {
    var movement = { x: -10 };
    
    // move locally instantly
    local_move(room.current.sessionId, movement);
    
    room.current.send("move", movement);
  }
  
  return (
    <div>
      <p>This example shows how to use <code>RelayRoom</code>:</p>
      <ul>
      <li>Messages are broadcasted to all other clients.</li>
      <li>It is <strong>client-authoritative</strong> instead of <strong>server-authoritative</strong>.</li>
      <li><a href="https://docs.colyseus.io/builtin-rooms/relay/">See documentation</a></li>
      </ul>
      
      <strong>commands</strong><br/>
      
      <input type="text" id="username" placeholder="Enter your name" />
      <button onClick={join}>Join RelayRoom</button>
      <button onClick={leave}>Leave room</button>
      
      <br />
      <button onClick={up}>up</button>
      <button onClick={down}>down</button>
      <br />
      <button onClick={left}>left</button>
      <button onClick={right}>right</button>
    </div>
  )
}

export default Chat