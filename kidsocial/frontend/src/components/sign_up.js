import { AiFillWechat } from 'react-icons/ai';
function signUp (props){
    return(
        <div className="sign_up">
            <AiFillWechat className='logo'/>
            <div className="wrapper">
                <form action="" method="POST"  onSubmit={props.handleSignUp}> 
                        <input type="text" name="name" placeholder='Name'/> 
                        <input type="text" name="email" placeholder='Email'/> 
                        <input type="password" name="password" placeholder='Password'/>
                    <button>Sign Up</button> 
                </form>
                <p>Already have an account? <button className='toggleButton' href="" onClick={props.toggleSignUpSignIn}>Sign In</button></p>
            </div>
        </div>
    )
}

export default signUp;