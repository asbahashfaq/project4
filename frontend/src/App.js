
import React, { useEffect, useState, useRef } from 'react';
import Navigation from './components/nav'
import './App.css'; 
import axios from 'axios'

import './scss/main.scss'
import './scss/login.scss'
// require('dotenv').config()
// const cloudinary = require('cloudinary').v2
// console.log(cloudinary.config().cloud_name)



function App() { 

  const [userDetails, setUserDetails] = useState({})
  const [loggedIn, setloggedInStatus] = useState(false)
  const [signinorup, setSignInOrUp] = useState(true)
  const [accountType, setAccountType] = useState('s')
  const [children, setChildrenData] = useState([])
  const [contacts, setContactData] = useState([])
  const [childandContactsData, setChildandContactsData] = useState([{child: {}, contacts: [], contactDetails: [] }])

  //socket webrtc stuff

  const toggleSignUpSignIn = (e) => {
    e.preventDefault()
    setSignInOrUp(!signinorup)    
  }
  const handleSignUp = (e) => {
    e.preventDefault()
    const form = e.target
    const data = Object.fromEntries(new FormData(form))
    console.log(data)
 
    axios
      .post('/parents/new', {...data, mode:'cors'})
      .then(response => {
        if(response.data.error)console.log(response.data.error)
        else{
          setSignInOrUp(!signinorup)  
        }
      }) 
      .catch(error => { 
        console.log(error)
      }) 
  }
  const handleSignIn = (e) => {
    e.preventDefault()
    const form = e.target
    const data = Object.fromEntries(new FormData(form))
    setAccountType(data.accountType)
    console.log('login data:', data) 
    axios.defaults.headers.common = {
      "Content-Type": "application/json"
    }
    if (data.accountType=='p') {                                          //PARENT LOGIN
      axios
        .post('/sessions/new', data)
        .then(response => {
          if(response.data.error)console.log(response.data.error)
          else {
            setUserDetails(response.data)
            console.log(userDetails)
            setloggedInStatus(true)  
            setAccountType(response.data.accountType) 
            console.log(response.data.id)
            return response.data.id
          }
        })
        .then( ( parentId ) => {
          //all good up to here
          console.log("getting children from parent: " , parentId)
          axios.get(`/children/all?parent=${parentId}`)
            .then( response => {
              console.log("CHILDREN: ")
              console.log(response)
              if( response.data.length > 0 ){
                setChildrenData(response.data)
              } 
            })
            .catch(err => console.log(err))
            return parentId
        })
        .then( ( parentId ) => {
          //all good up to here
          console.log("getting contacts from parent: " , parentId)
          axios.get(`/users/all?parent=${parentId}&t=p`)
            .then( response => {
              console.log("Contacts: ")
              console.log(response)
              if( response.data.length > 0 ){
                setContactData(response.data)
              } 
            })
          .catch(err => console.log(err))

        })      
        .catch(error => { 
          console.log(error)
        }) 
    }
    else if (data.accountType == 'c')   {                                                          //CHILD LOGIN
    axios
    .post('/sessions/new', data)
    .then(response => {
      if(response.data.error)console.log(response.data.error)
      else {
        setUserDetails(response.data)
        console.log(userDetails)
        setloggedInStatus(true)  
        setAccountType(response.data.accountType) 
        console.log(response.data)
        return response.data.id
      }
    })
    .then( ( child_id ) => {              //getting contacts for child
      //all good up to here
      console.log("getting contacts for child: " , child_id)
      axios.get(`/contacts/getusers?child_id=${child_id}`)
        .then( response => {
          console.log("Contacts: ")
          console.log(response)
          if( response.data.length > 0 ){
            setContactData(response.data)
          } 
        })
      .catch(err => console.log(err))

    })    

  }
  else if(data.accountType == 's')  {                                                         //USER LOGIN
    axios
    .post('/sessions/new', data)
    .then(response => {
      if(response.data.error)console.log(response.data.error)
      else {
        setUserDetails(response.data)
        console.log(userDetails)
        setloggedInStatus(true)  
        setAccountType(response.data.accountType) 
        console.log(response.data)
        return response.data.id
      }
    })
    .then( ( user_id ) => {              //getting contacts for user
      //all good up to here
      console.log("getting contacts for user: " , user_id)
      axios.get(`/contacts/getuserscontacts?user_id=${user_id}`)
        .then( response => {
          console.log("Contacts: ")
          console.log(response)
          if( response.data.length > 0 ){
            setContactData(response.data)
          } 
        })
      .catch(err => console.log(err))

    })    
  }
  document.querySelector('body').setAttribute('account_type',data.accountType)
  }
  const handleAddChild = e => {
    e.preventDefault()
    const form = e.target
    const data = Object.fromEntries(new FormData(form))
    const fileUrl = document.querySelector('#fileUpload').files
    console.log(fileUrl[0])

    const imageData = new FormData()
    imageData.append("file", fileUrl[0])
    imageData.append("upload_preset", "oaf6m1oc")
    axios.post("https://api.cloudinary.com/v1_1/ddh3ahpvd/image/upload", imageData)
      .then(response => {
         console.log("adding children data")
        //axios add child
        axios
          .post('/children/new', {...data, image_url:response.data.secure_url, mode:'cors'})
          .then( res2 => {

            console.log( res2 )
            console.log('time to add parent to childs contacts')
            // Contact.create(res2.data.id,)
          })
      }) 
  }
  const handleAddContact = e => {
    e.preventDefault()
    const form = e.target
    const data = Object.fromEntries(new FormData(form))
    const fileUrl = document.querySelector('#fileUpload').files
    console.log(fileUrl[0])

    const imageData = new FormData()
    imageData.append("file", fileUrl[0])
    imageData.append("upload_preset", "oaf6m1oc")
    axios.post("https://api.cloudinary.com/v1_1/ddh3ahpvd/image/upload", imageData)
      .then(response => {
         console.log("adding contact data")
        //axios add standard user
        //create standard user model and routes in server

        axios
          .post('/users/new', {...data, image_url:response.data.secure_url, mode:'cors'})
          .then( res2 => {

            console.log( res2 )
            //console.log('time to add standard user to childs contacts') 
            //also add parent_id column in standard user table, to get it's created contacts. Then add click events to link to child using contacts table
          })
      }) 
  }


  return (
    <div className="App">
      <Navigation handleAddContact={handleAddContact} childandContactsData={childandContactsData} setChildandContactsData={setChildandContactsData} user={userDetails} children={children} contacts={contacts} loggedIn={loggedIn} signinorup={signinorup} accountType={accountType} toggleSignUpSignIn={toggleSignUpSignIn} handleSignUp={handleSignUp} handleSignIn={handleSignIn}  handleAddChild={handleAddChild}/>      
      
    </div>
  );
}

export default App;

 