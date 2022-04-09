import { useEffect, useState, useRef } from 'react'


import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;

function Sockets(props){
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false); 
  
  
  
  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
     

  async function startCamera (){
    // e.preventDefault()
    document.querySelector('.leftSideMenu button').classList.add('hide')
    navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true, video: true },
          function(stream) {
            var video = document.querySelector('.myVideo');
            video.srcObject = stream;
            setStream(stream); 
            video.onloadedmetadata = function(e) {
              video.play();
              return stream
            };
          },
          function(err) {
            console.log("The following error occurred: " + err.name);
          }
      );
    } else {
      console.log("getUserMedia not supported");
    }

    // video.src = stream1;
    // video.play(); 
  }
  // const startCamera = () => {
  //   const video = document.querySelector('.myVideo')
  //   navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
  //     setStream(stream); 
  //     video.src = stream;
  //     video.play(); 
  //   })
  // }
  //VideoCall webrtc stuff
  useEffect(() => {
    socket.current = io.connect("/", { 
        query: {
            uuid: props.user.uuid,
            account_type: props.accountType
        }
     }); 

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (onlineusers) => {
        console.log(onlineusers)
      setUsers(onlineusers);

    })

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, []);

  function callPeer(id) {  
    if (id=='')
      return null
    
    // startCamera().then((stream2) => {console.log("Done")
    // startCamera()
    const peer = new Peer({
      initiator: true,
      trickle: false,
      // config: {

      //   iceServers: [
      //       {
      //           urls: "stun:numb.viagenie.ca",
      //           username: "sultan1640@gmail.com",
      //           credential: "98376683"
      //       },
      //       {
      //           urls: "turn:numb.viagenie.ca",
      //           username: "sultan1640@gmail.com",
      //           credential: "98376683"
      //       }
      //   ]
      // },
        stream: stream,
      });

      peer.on("signal", data => {
        socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
      })

      peer.on("stream", stream => {
        if (partnerVideo.current) {
          console.log("partnerStream: ",stream)
          partnerVideo.current.srcObject = stream;
        }
      });

      socket.current.on("callAccepted", signal => {
        setCallAccepted(true);
        peer.signal(signal);
      })
    
  }

  function acceptCall() {  
  document.querySelector('.incomingCall').classList.add('hide')

      setCallAccepted(true);
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });
      peer.on("signal", data => {
        socket.current.emit("acceptCall", { signal: data, to: caller })
      })
      
      peer.on("stream", stream => {
        console.log("partnerStream: ", stream)
        partnerVideo.current.srcObject = stream;
      });

      peer.signal(callerSignal);
    
  }

  let UserVideo; 
  if (stream) { 
      UserVideo = (
      <Video playsInline muted ref={userVideo} autoPlay />
      );
  } 
  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <Video playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;
  if (receivingCall) {
    if(!callAccepted)
      // document.querySelector('.incomingCall').classList.remove('hide')

    incomingCall = (
      <div>
        <h1>{caller} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>
    )
  }



  return(
    <div>
      <div className="leftSideMenu">
        <div className="userDetails">
          <div className="imgWrapper">
            <img src={props.user.profile_image} alt="" />
          </div>
          <h2>{props.user.name}</h2>
          <p>{(props.accountType=='c')?props.user.email:''}</p>
          <p>{(props.accountType=='c')?`Age: ${props.user.age}`:''}</p>
          <p>Username: {props.user.username}</p>
        </div>
        <div className="myVideoArea">
          <video className='myVideo' autoPlay muted></video> 
          <button className='videoButton' onClick={startCamera} >Start Camera</button>
        </div>
      </div>
      <div className='mainDiv'>

        <div className="incomingCall">
          {incomingCall}    
        </div>
        <div className="videoCallDiv">   
          {PartnerVideo} 
        </div> 
        <div className="contactsWrapper">
            <ul className="contacts">
                { props.contacts.map ( (contact, key) => {
                  //Check if contact.uuid is present in Object.values(users).map(user => user.uuid), then get users.id for that one
                  var callID = (Object.values(users).map(user => user.uuid).includes(contact.uuid))?Object.values(users).filter(user=> user.uuid == contact.uuid)[0]:''

                  return <li className="item"  key={key} contact_id={contact.id} onClick={() => callPeer(callID.id)} > 
                      <div className="imgWrapper">
                          <img src={(!contact.profile_image)
                      ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                      : contact.profile_image} alt="" /> 
                      </div>
                      <div className="detailsWrapper">
                          <h3>{contact.name}</h3>
                          <p>{contact.email}</p>
                          <span className="username">Username: {contact.username}</span> 
                      </div> 
                  </li>
                  })
                } 
            </ul> 
        </div>



        {/* <div className="controls">
          {Object.keys(users).map(key => {
              if (key === yourID) {
              return null;
              }
              return (
                <button onClick={() => callPeer(key)} key={key}>Call {key}</button>
              );
          })}
        </div>
        <div className='customControls'>
            {Object.values(users).filter(user => props.contacts.map(contact => contact.uuid).includes(user.uuid))
                    //  check if user.uuid is in props.contacts
                    .map((user,key) => 
                    <div key={key}>
                        <p>id: {user.id}</p>
                        <p>uuid: {user.uuid}</p>
                        <p>type: {user.type}</p>
                    </div>
                ) 
            }
        </div>  */}
      </div>
    </div>
  )
}

export default Sockets;