import React,{useEffect,useRef,useState} from 'react'
import * as Colyseus from 'colyseus.js'

function Auth() {
  const client = useRef(null)
  const message = useRef(null)
  const room = useRef(null)
  
  // Load the Facebook SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

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

  // window.fbAsyncInit = function () {
  //   FB.init({
  //     appId: '135829507120512',
  //     cookie: true,  // enable cookies to allow the server to access
  //     // the session
  //     xfbml: true,  // parse social plugins on this page
  //     version: 'v2.8' // use graph api version 2.8
  //   });
  // }

  function join_without_token () {
    // Logged into your app and Facebook.
    client.joinOrCreate("auth").then(room_instance => {
        console.log("Joined successfully!"); // never reached!

    }).catch(e => {
        console.error("Error", e);
    });
  }

  function login () {
      // FB.login(function (response) {
      //     // Handle the response object, like in statusChangeCallback() in our demo
      //     // code.
      //     // The response object is returned with a status field that lets the
      //     // app know the current login status of the person.
      //     // Full docs on the response object can be found in the documentation
      //     // for FB.getLoginStatus().
      //     if (response.status === 'connected') {
      //         // Logged into your app and Facebook.
      //         client.joinOrCreate("auth", {
      //             accessToken: response.authResponse.accessToken
      //         }).then(room => {
      //             console.log("Joined successfully!");
      //         }).catch(e => {
      //             console.error("Error", e);
      //         });

      //     } else {
      //         console.log("not connected", response.authResponse);
      //     }
      // });
  }

  return (
    <div>
      <p>This example shows how to authenticate and retrieve user data before the websocket handshake.</p>

      <p>Open Developer Tools for log messages.</p>

      <p><strong>Commands</strong></p>

      <button onclick="login()">login</button>
      <button onclick="join_without_token()">try to join without token</button>
    </div>
    )
  }
  
  export default Auth