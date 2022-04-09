import Sockets from './sockets'
// Same as userscreen at the moment
function ChildScreen (props){

    return(  
        <div className="container">
            <Sockets user={props.user} contacts={props.contacts} accountType={props.accountType}/>
        </div> 
    )
}

export default ChildScreen;


 