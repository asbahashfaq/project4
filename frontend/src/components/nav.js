
import ContactsPage from './contactsPage';
import SignUp from './sign_up';
import SignIn from './sign_in';
import ParentScreen from './parentalControl';
import ChildScreen from './childScreen';
import UserScreen from './userScreen';

function Nav(props){ //props will have loggedIn? and account type and signUp 
    return(
        <section className='page'>
            {(!props.loggedIn)
                ?(props.signinorup)
                    ?<SignIn toggleSignUpSignIn={props.toggleSignUpSignIn} handleSignIn={props.handleSignIn}/>
                    :<SignUp toggleSignUpSignIn={props.toggleSignUpSignIn} handleSignUp={props.handleSignUp}/>
                :(props.accountType=='p') 
                    ?<ParentScreen contacts={props.contacts} handleAddContact={props.handleAddContact} childandContactsData={props.childandContactsData} setChildandContactsData={props.setChildandContactsData} accountType={props.accountType} children={props.children} loggedIn={props.loggedIn} user={props.user} handleAddChild={props.handleAddChild}/>
                    :(props.user.accountType=='c') 
                        ?<ChildScreen contacts={props.contacts} user={props.user}/>
                        :(props.user.accountType=='s') 
                            ?<UserScreen contacts={props.contacts} user={props.user}/>
                            :""}
                
            {/* {(props.loggedIn)?<ContactsPage accountType={props.accountType} loggedIn={props.loggedIn} user={props.user}/>:(props.signinorup)?<SignIn toggleSignUpSignIn={props.toggleSignUpSignIn} handleSignIn={props.handleSignIn}/>:<SignUp toggleSignUpSignIn={props.toggleSignUpSignIn} handleSignUp={props.handleSignUp}/>} */}
        
            
        </section>
    )
}

export default Nav;




// function renderHeaderNav(session = false) {
//     document.querySelector("#header-nav").innerHTML = `
//           <header>
//               <nav class="left-nav">
//                   <h2 onClick="renderHomePage()">Cricket-Live ⏚ </span></h2>
//               </nav>
//               <nav class="right-nav">
//                   <ul>
//                       <li onClick="render('renderNews')">News</li>
//                       <li class="hide">Matches</li>
//                       <li onClick="render('renderTournamentsPage')">Tournaments</li>
//                       <li class="hide">Players</li>
//                       <li id="welcome" class="welcome"></li>
//                       ${
//                         !session
//                           ? `<li onClick="render('signUp')">Sign Up</li>
//                           <li onClick="render('login')">Login</li>`
//                           : ``
//                       }
//                   </ul>
//               </nav>
//           </header>
//       `;
//     renderFooter();
//   }
  
//   renderHeaderNav();
  
//   function render(component) {
//     if (component === "signUp") {
//       renderSignUp();
//     } else if (component === "login") {
//       renderLogin();
//     } else if (component === "renderTournamentsPage") {
//       renderTournamentsPage();
//     } else if (component === "renderNews"){
//       renderNewsPage();
//     }
//   }
  
//   function renderHomePage() {
//     document.querySelector("#page").innerHTML = `
//       <div class='newsSection'></div>
//       <div class='tournamentsSection'></div>
//       <div class='matchesSection'></div>
//       `;
  
//     renderAllNews();
//     renderTournaments(tournaments, 5);
//     renderMatches(matches);
//   }
  