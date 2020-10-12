import React,{useEffect,useRef,useState} from 'react'
import * as Colyseus from 'colyseus.js'

function Auth() {
  const client = useRef(null)

  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    const url = 'ws://localhost:2567'

    client.current = new Colyseus.Client(url);
  }, [])

  function join_without_token () {
    // Logged into your app and Facebook.
    client.current.joinOrCreate("auth")
    .then(room_instance => {
      console.log("Joined successfully!", room_instance); // never reached!
    })
    .catch(e => {
      console.error("Error", e);
    });
  }

  function login() {
    if (token) {
      client.current.joinOrCreate("auth", {
        accessToken: token,
        username: username,
      })
      .then(room => {
        console.log("Joined successfully!", room);
      })
      .catch(e => {
        console.error("Error", e);
      })
    } else if (username && password) {
        client.current.joinOrCreate("auth", {
          password: password,
          username: username,
        })
        .then(room => {
          console.log("Joined successfully!", room);
        })
        .catch(e => {
          console.error("Error", e);
        })
    } else {
      console.log("not connected", token);
    }
  }

  return (
    <div>
    <p>This example shows how to authenticate and retrieve user data before the websocket handshake.</p>

    <p>Open Developer Tools for log messages.</p>

    <p><strong>Commands</strong></p>

    <input 
      placeholder="username"
      type="text"
      value={username}
      onChange={event=>setUsername(event.target.value)}
    />

    <input 
      placeholder="password"
      type="text"
      value={password}
      onChange={event=>setPassword(event.target.value)}
    />

    <input 
      placeholder="token"
      type="text"
      value={token}
      onChange={event=>setToken(event.target.value)}
    />

    <button onClick={login}>login</button>
    <button onClick={join_without_token}>try to join without token</button>
    </div>
  )
}

export default Auth