import * as React from 'react';
import { App, Credentials } from "realm-web";

/**
 * Note: we used to have a NoSSR wrapper inside the AppLayout component (which was delaying rendering 1 cycle),
 * however this wrapper is now providing the same function, given the network roundtrip.
 */
const app = new App("__APP_ID__");

export function logout () {
  app.currentUser?.logOut();
  window.location.reload();
}
export function ProviderAtlasAppServices(props: { children: React.ReactNode }) {
  
  const [haveCapabilities, setCapabilties] = React.useState([] as any);
  // load from the backend
  const capabilities = [] as any;
  const [tempAccounts,setTempAccounts] = React.useState([] as any);
  
  const try2login = (userEmail:string,password:string) => {
    console.log("logging in",userEmail,password);
    const credentials = Credentials.emailPassword(userEmail,password);
    app.logIn(credentials).then((user:any) => {
      console.log("Successfully logged in",user);
      user.functions.callFunction("Function_0").then((accounts:any[]) => {
        console.log("accounts",accounts);
        let newAccounts = [];
        for (let i = 0; i < accounts.length; i++) {
          newAccounts.push({"id":accounts[i]['_id']});
        }
        setTempAccounts(newAccounts);
      });
    });
  }


  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // block rendering until the capabilities are loaded
  return !app.currentUser ? <div className="login-wrapper">
    <div className="login-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}>
        <h3>YOU SHALL NOT PASS</h3>
        <img style={{ width: '250px' }} src="https://creativewizard.in/wp-content/uploads/2022/01/img-11.png" alt="Wizard Logo" />
        <p><i>unless you already have an account</i></p>
        <label htmlFor="email">Email:</label><br />
        <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password:</label><br />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <hr />
        <button type="button" style={{width:"200px"}} onClick={() => try2login(email,password)}>Login</button>
      </div>
  </div> : props.children;
}
