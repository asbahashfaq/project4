import axios from "axios" 

function parentalControl(props){
    const openChildDetails = (e) => {
        const childID = e.target.closest('li').getAttribute('child_id')

        axios.get(`http://localhost:3001/children?id=${childID}`)
        .then(response => {
            console.log(response.data)
            props.setChildandContactsData([response.data])
        })
        
        //document.querySelector('.contentDiv').innerHTML

    }
    const addtoChildsContacts = (e) => {
        var parentID = props.user.id
        var contactID = e.target.closest('.item').getAttribute('contact_id')
        var childID = e.target.closest('.viewChild').getAttribute('child_id')
        console.log( "contact parent child" , contactID, parentID, childID )

        axios.post(`http://localhost:3001/contacts/newContact?c_id=${childID}&p_id=${parentID}&u_id=${contactID}`).then(
            //console.log(props.childandContactsData[0].contacts[0].push())
            res => { 
                console.log(res)
                e.target.closest('.item').classList.remove('parentsContact')
                e.target.closest('.item').onclick=removefromChildsContacts
            })
    }
    const removefromChildsContacts = (e) => {
        var parentID = props.user.id
        var contactID = e.target.closest('.item').getAttribute('contact_id')
        var childID = e.target.closest('.viewChild').getAttribute('child_id')
        console.log( "contact parent child" , contactID, parentID, childID )

        axios.delete(`http://localhost:3001/contacts/del?c_id=${childID}&u_id=${contactID}`).then(
            //console.log(props.childandContactsData[0].contacts[0].push())
            res => { 
                console.log(res)
                e.target.closest('.item').classList.add('parentsContact')
                e.target.closest('.item').onclick=addtoChildsContacts

            })
    }
    const openContactDetails = (e) => {
        const contactID = e.target.closest('.item').getAttribute('contact_id')
        
        axios.get(`http://localhost:3001/users?id=${contactID}`)
        .then(res => {
            console.log("HERE1" ,res)
            var div = document.createElement('div')
            var src = (!res.data.user.profile_image)
                ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                : res.data.user.profile_image
            div.innerHTML = `<img src="${src}"/><h2>${res.data.user.name}</h2><p>${res.data.user.email}</p><p>Username: ${res.data.user.username}</p>`
            document.querySelector('.viewContact').innerHTML = ""
            document.querySelector('.viewContact').appendChild(div)

            document.querySelector('.contentDiv .default').classList.add("hide")
            document.querySelector('.contentDiv .viewChild').classList.add("hide")
            document.querySelector('.contentDiv .viewContact').classList.remove("hide")
            document.querySelector('.contentDiv .addForm').classList.add("hide")
        })
        

    }
    const getContactsData = (contactsArray) => {

        var contactDiv = document.querySelector('.contacts')
        document.querySelector('.contentDiv .default').classList.add("hide")
        document.querySelector('.contentDiv .viewChild').classList.remove("hide")
        document.querySelector('.contentDiv .viewContact').classList.add("hide")
        document.querySelector('.contentDiv .addForm').classList.add("hide")

        // var contactDiv = document.createElement('div')
        // contactDiv.classList.add('contacts')
        // document.querySelector('.contactsWrapper').appendChild(contactDiv)
        contactDiv.innerHTML = ""  
        console.log("contactsarray: ", contactsArray)
        var counter = 0
        if(contactsArray){
            contactsArray.forEach( (contact) => {
                console.log("HELLO")
                if(contact.account_type == 'p'){ 
                     axios.get(`http://localhost:3001/parents?id=${contact.user_id}`)
                        .then(res => {
                            console.log(res.data)
                            console.log(counter)
                            counter = counter + 1;
                            var div = document.createElement('div')
                            var src = (!res.data.profile_image)
                                ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                                : res.data.profile_image
                            div.innerHTML = `<img src="${src}"/><h2>${res.data.name}</h2><span>Parent</span>` 
                            contactDiv.appendChild(div)

                        })
                        
                }else if(contact.account_type == 's'){
                    axios.get(`http://localhost:3001/users?id=${contact.user_id}`)
                    .then(res => {
                        console.log(res.data.user)
                        var div = document.createElement('div')
                        div.classList.add('item')
                        div.setAttribute("contact_id",res.data.user.id)
                        div.onclick = openContactDetails
                        var src = (!res.data.user.profile_image)
                            ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                            : res.data.user.profile_image
                        div.innerHTML = `<img src="${src}"/><h2>${res.data.user.name}</h2><p>${res.data.user.username}</p>`
                        div.onclick=removefromChildsContacts
                        document.querySelector('.contacts').appendChild(div)
                        if( props.contacts.filter( (contact) => contact.id == res.data.user.id ).length > 0 ){
                            //contact is added already, remove this contact's relevant parentscontact
                            document.querySelector(`.parentsContact[contact_id='${res.data.user.id}']`).remove()
                            console.log("YAY!  REMOVED ")

                        }
                        
                    })
                }
            })

            // console.log("RETURNED: ", data)
            // return data.map( (contact, key) => ` 
            //     <li>${contact.email}
            //     </li>
            // `)
        }
        var contactDIV = document.querySelector('.contacts')
        props.contacts.map ( (contact, key) => {
            var div = document.createElement('div')
            div.classList.add('item')
            div.classList.add('parentsContact')
            div.setAttribute('key',key)
            div.setAttribute('contact_id', contact.id)
            div.onclick = addtoChildsContacts
            div.innerHTML = `
                <img src=${contact.profile_image} alt="" />  
                <h2>${contact.name}</h2>
                <p>${contact.email}</p>
                <span className="username">Username: ${contact.username}</span> `
            contactDIV.appendChild(div)
            return contact 
        })
        //var div = document.querySelector('.contacts')
        // //div.appendChild(otherContacts)
        // var thisDiv = document.querySelector('div.item')
        // thisDiv.onclick = openContactDetails

        // else 
            // return [{}]

        //axios.get('https:/') 
    }

    // name             TEXT,
    // username         TEXT UNIQUE,
    // age              INTEGER,
    // password_digest  TEXT,
    // profile_image    bytea
    // parents_id       INTEGER,

    const addChildForm = () =>{ 
        var form = `
            <h2>Add Child</h2>
            <form action="" method="" > 
                <input type="text" name="name" placeholder="Child's Name" />  
                <input type="text" name="username" placeholder="Child's Username"/> 
                <input type="number" name="age" placeholder="Child's Age" /> 
                <input type="password" name="password" placeholder="Child's Password" />
                <fieldset>
                    <label htmlFor="">Picture: </label> 
                    <input type="file" id="fileUpload"/>
                </fieldset>
                <input type="hidden" name="parents_id" value="${props.user.id}"/>
                <button>Add</button>
            </form>
        `  
        document.querySelector('.contentDiv .addForm').innerHTML = form
        document.querySelector('.contentDiv .default').classList.add("hide")
        document.querySelector('.contentDiv .viewChild').classList.add("hide")
        document.querySelector('.contentDiv .addForm').classList.remove("hide")
        document.querySelector('.contentDiv form').onsubmit = props.handleAddChild;
    } 

    const addContactForm = () => { //add to contacts as well as standard users table
        var form = `
            <h2>Add New Contact</h2> 
            <form action="" method="" > 
                <input type="text" name="name" placeholder="Contact's Name"/> 
                <input type="text" name="username" placeholder="Contact's Username"/>
                <input type="email" name="email" placeholder="Contact's Email"/>
                <input type="password" name="password" placeholder="Contact's Password"/>
                <fieldset> 
                    <label htmlFor="">Profile Picture: </label> 
                    <input type="file" id="fileUpload"/>
                </fieldset>
                <input type="hidden" name="parents_id" value="${props.user.id}"/>
                <button>Add</button>
            </form>
        `  
        document.querySelector('.contentDiv .addForm').innerHTML = form
        document.querySelector('.contentDiv .default').classList.add("hide")
        document.querySelector('.contentDiv .viewChild').classList.add("hide")
        document.querySelector('.contentDiv .addForm').classList.remove("hide")
        document.querySelector('.contentDiv form').onsubmit = props.handleAddContact;

    }
    const viewChildrenMenu = () => {
        document.querySelector('.leftSideBar .childrenMenu').classList.remove("hide")
        document.querySelector('.leftSideBar .contactsMenu').classList.add("hide")
        document.querySelector('.leftSideBar .co_button').classList.add("hide")
        document.querySelector('.leftSideBar .ch_button').classList.remove("hide")
    }
    const viewContactsMenu = () => {
        document.querySelector('.leftSideBar .childrenMenu').classList.add("hide")
        document.querySelector('.leftSideBar .contactsMenu').classList.remove("hide")
        document.querySelector('.leftSideBar .co_button').classList.remove("hide")
        document.querySelector('.leftSideBar .ch_button').classList.add("hide")
    }
    return(
        <main>
            <h2>{props.user.name}</h2>
            <div className="container">
                <div className="leftSideBar">
                    <h2><span onClick={viewChildrenMenu}>Children</span>|<span onClick={viewContactsMenu}>Contacts</span></h2>
                    <ul className="childrenMenu">
                        { props.children.map ( (child, key) => 
                            <li onClick={openChildDetails} key={key} child_id={child.id}> 
                                <div className="imgWrapper">
                                    <img src={child.profile_image} alt="" /> 
                                </div>
                                <div className="detailsWrapper">
                                    <h3>{child.name}</h3>
                                    <p>{child.age} year{(child.age>1)?"s":''} old</p>
                                    <span className="username">Username: {child.username}</span> 
                                </div>
                                <span className="border"></span>
                            </li>
                        )} 
                    </ul>
                    <ul className="contactsMenu hide">
                        { props.contacts.map ( (contact, key) => 
                            <li className="item" onClick={openContactDetails} key={key} contact_id={contact.id}> 
                                <div className="imgWrapper">
                                    <img src={contact.profile_image} alt="" /> 
                                </div>
                                <div className="detailsWrapper">
                                    <h3>{contact.name}</h3>
                                    <p>{contact.email}</p>
                                    <span className="username">Username: {contact.username}</span> 
                                </div>
                                <span className="border"></span>
                            </li>
                        )} 
                    </ul>
                    <button onClick={addChildForm} className="ch_button">Add Child</button>
                    <button onClick={addContactForm} className="co_button hide">Add Contact</button>
                </div>
                <div className="contentDiv"> 
                    <div className="default"><p>Click on a child to view details</p></div>
                    <div className="viewChild hide"  child_id={props.childandContactsData[0].child.id}>
                        <div className="child">
                            <div className="imgWrapper">
                                <img src={props.childandContactsData[0].child.profile_image} alt="" /> 
                            </div>
                            <div className="detailsWrapper">
                                <h3>{props.childandContactsData[0].child.name}</h3>
                                <p>{props.childandContactsData[0].child.age} year{(props.childandContactsData[0].child.age>1)?'s':''} old</p>
                                <span className="username">{props.childandContactsData[0].child.username}</span> 
                            </div>
                        </div> 
                        <div className="contactsWrapper">
                            <h3>Contacts Editor</h3>
                            <div className="contacts">
                                No contacts to show
                            </div>
                        </div>
                        {(props.childandContactsData[0].contacts[0])?getContactsData(props.childandContactsData[0].contacts[0]):''}
                        {/* <div className="contacts">
                            {(props.childandContactsData[0].contacts[0])?getContactsData(props.childandContactsData[0].contacts[0]):''}
                        </div>         */}
                    </div>
                    <div className="viewContact hide"></div>
                    <div className="addForm hide"></div>
                </div>
                
                <div className="notifications">
                    <h2>Notifications</h2>
                    {/* <Notifications /> */}
                </div>
            </div>
        </main>
    )
}

export default parentalControl;

/**
 * enctype="multipart/form-data"
 */