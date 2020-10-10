import React,{useEffect,useRef,useState} from 'react'
import * as Colyseus from 'colyseus.js'

function State() {
  const client = useRef(null)
  const message = useRef(null)
  const room = useRef(null)
  
  useEffect(() => {
    const url = 'ws://localhost:2567'
    
    client.current = new Colyseus.Client(url);
    
    client.current.joinOrCreate("state_handler").then(room_instance => {
      room.current = room_instance

      var players = {};
      var colors = ['red', 'green', 'yellow', 'blue', 'cyan', 'magenta'];

      // listen to patches coming from the server
      room.current.state.players.onAdd = function (player, sessionId) {
        var dom = document.createElement("div");
        dom.className = "player";
        dom.style.left = player.x + "px";
        dom.style.top = player.y + "px";
        dom.style.background = colors[Math.floor(Math.random() * colors.length)];
        dom.innerText = "Player " + sessionId;

        players[sessionId] = dom;
        document.body.appendChild(dom);
      }

      room.current.state.players.onRemove = function (player, sessionId) {
        document.body.removeChild(players[sessionId]);
        delete players[sessionId];
      }

      room.current.state.players.onChange = function (player, sessionId) {
        var dom = players[sessionId];
        dom.style.left = player.x + "px";
        dom.style.top = player.y + "px";
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
    })
  }, [])

  function up () {
    room.current.send("move", { y: -1 });
  }

  function right () {
    room.current.send("move", { x: 1 });
  }

  function down () {
    room.current.send("move", { y: 1 })
  }

  function left () {
    room.current.send("move", { x: -1 })
  }

  const submitMessage = e=>{
    e.preventDefault();
    
    room.current.send("message", message.current.value);
    
    message.current.value = "";
  }
  
  return (
    <div>
      <p>This example shows how to use custom data structures in your room's state.</p>

      <strong>commands</strong>
      <br/>
      <button onClick={up}>up</button>
      <button onClick={down}>down</button>
      <br />
      <button onClick={left}>left</button>
      <button onClick={right}>right</button>
    </div>
    )
  }
  
  export default State