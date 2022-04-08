
function userScreen (props){

    return(
        <main>
            <header>
                <h2>{props.user.name}</h2>
            </header> 
            <div className="container">
                <div className="contactsWrapper">
                    <ul className="contacts">
                        { props.contacts.map ( (contact, key) => 
                            <li className="item"  key={key} contact_id={contact.id}> 
                                <div className="imgWrapper">
                                    <img src={(!contact.profile_image)
                                ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                                : contact.profile_image} alt="" /> 
                                </div>
                                <div className="detailsWrapper">
                                    <h3>{contact.name}</h3>
                                    {/* <p>{contact.email}</p> NOT SHOWING BECAUSE CHILDREN DON'T HAVE EMAILS*/}
                                    <span className="username">Username: {contact.username}</span> 
                                </div> 
                            </li>
                        )} 
                    </ul> 
                </div> 
            </div>
        </main>
    )
}

export default userScreen;