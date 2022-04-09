import { AiFillWechat } from 'react-icons/ai';
function signIn (props){
    return(
        <div className="sign_in">
            <AiFillWechat className='logo'/>
            <div className="wrapper">
                <form action="" method="POST" onSubmit={props.handleSignIn}>
                    <input type="text" name="username" placeholder='Username'/>
                    <input type="password" name="password" placeholder='Password'/>
                    <select name="accountType" id="">
                        <option value="s">Standard Account</option>
                        <option value="c">Child Account</option>
                        <option value="p">Parent Account</option>
                    </select>
                    <button>Sign In</button> 
                </form>
                <p>Don't have an account? <button className='toggleButton' href="" onClick={props.toggleSignUpSignIn}>Register here.</button></p>
            </div>
        </div>
    )
}

export default signIn;