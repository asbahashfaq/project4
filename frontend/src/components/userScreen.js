import Sockets from "./sockets";

function UserScreen  (props){
    
    return(  
        <div className="container">
            <Sockets user={props.user} contacts={props.contacts} accountType={props.accountType}/>
        </div> 
    )
}

export default UserScreen;