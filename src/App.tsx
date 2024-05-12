import React, { useState, useEffect } from 'react';

import AuthContent from './components/AuthContent';
import LoginForm from './components/LoginForm';
import WelcomeContent from './components/WelcomeContent';
import Buttons from './components/Buttons';
import { request, setAuthHeader, getAuthToken } from './axios_helper';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from './entity/CustomJwtPayload';
import Admin from './components/Admin';

interface Props {}




const App: React.FC<Props> = () => {
  const url = "https://monkfish-app-ztbvn.ondigitalocean.app";
  localStorage.setItem("myUrl", url);
  
  const [componentToShow, setComponentToShow] = useState<string>('welcome');
  
  


  const login = () => {
    setComponentToShow('login');
    
    
  };

  const logout = () => {
    console.log('Logging out');
    setComponentToShow('welcome');
    setAuthHeader(null);
    setIsAdmin(false);
    setIsAuthenticated(false);
    localStorage.clear();
    
    
    
  };

  const onLogin = (e: React.FormEvent<HTMLFormElement>, username: string, password: string) => {
    e.preventDefault();
    request('POST', '/login', {
      login: username,
      password: password,
    })
      .then((response) => {
        localStorage.setItem('userId', response.data.id);
        setAuthHeader(response.data.token);
        console.log(response.data.token);
        localStorage.setItem('role', response.data.role);
        setComponentToShow('messages');
      })
      .catch((error) => {
        console.log(error);
        
        setAuthHeader(null);
        setComponentToShow('welcome');
      });
  };
  interface RegistrationData {
    login: string;
    password: string;
    firstName: string;
    lastName: string;
    tasks: any[]; 
  }

  const onRegister = (
    event: React.FormEvent<HTMLFormElement>,
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    tasks: any[] 
  ) => {
    event.preventDefault();
    const registrationData: RegistrationData = {
      login: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      tasks: tasks 
    };
    request('POST', '/register', registrationData)
      .then((response) => {
        setAuthHeader(response.data.token);
        localStorage.setItem('userId', response.data.id);
        
        console.log(response.data.token);
        localStorage.setItem('role', response.data.role);
        setComponentToShow('messages');
      })
      .catch((error) => {
        console.log(error);
        
        setAuthHeader(null);
        setComponentToShow('welcome');
      });
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {

    let token = getAuthToken();
    if (token !== null) {
        setIsAuthenticated(true);
        const decoded = jwtDecode<CustomJwtPayload>(token);
        console.log("decoded", decoded);
        if (decoded.role == "ADMIN") {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    } else {
        setIsAuthenticated(false);
    }

  }, [login]);

  // useEffect(() => {
  //   let pageUrl = page;

  //   if (!pageUrl) {
  //     const queryParameters = new URLSearchParams(window.location.search);
  //     const getUrl = queryParameters.get('page');

  //     if (getUrl) {
  //       pageUrl = getUrl;
  //       setPage(getUrl);
  //     } else {
  //       pageUrl = 'start';
  //     }
  //   }
  //   window.history.pushState(null, '', `?page=${pageUrl}`);
  // }, [page]);

  return (
    <>
    
      {/* <Start/> */}
      <Buttons login={login} logout={logout} />
      {!isAuthenticated && <WelcomeContent/>}
      {/* {componentToShow === 'welcome' && <WelcomeContent />} */}
      {componentToShow === 'login' && <LoginForm onLogin={onLogin} onRegister={onRegister} />}
      {/* {!isAuthenticated&& <LoginForm onLogin={onLogin} onRegister={onRegister}/>} */}
      {/* {componentToShow === 'messages' && <AuthContent />  } */}
      {isAuthenticated && !isAdmin && <AuthContent />}
      {isAuthenticated && isAdmin && <Admin/>}
      
    </>
  );
};

export default App;
