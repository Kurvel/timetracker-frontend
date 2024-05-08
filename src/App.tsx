import React, { useState, useEffect } from 'react';
import Start from './components/Start';
import Header from './components/Header';
import Task from './components/Task';
import User from './components/User';
import Time from './components/Time';
import Statistics from './components/Statistics';
import AuthContent from './components/AuthContent';
import LoginForm from './components/LoginForm';
import WelcomeContent from './components/WelcomeContent';
import Buttons from './components/Buttons';
import { request, setAuthHeader } from './axios_helper';

interface Props {}

interface State {
  componentToShow: string;
}

const App: React.FC<Props> = () => {
  const [page, setPage] = useState<string>('');
  const [componentToShow, setComponentToShow] = useState<string>('welcome');

  const login = () => {
    setComponentToShow('login');
  };

  const logout = () => {
    setComponentToShow('welcome');
    setAuthHeader(null);
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
        console.log(response.data.id);
        
        setComponentToShow('messages');
      })
      .catch((error) => {
        setAuthHeader(null);
        setComponentToShow('welcome');
      });
  };

  const onRegister = (
    event: React.FormEvent<HTMLFormElement>,
    firstName: string,
    lastName: string,
    username: string,
    password: string
  ) => {
    event.preventDefault();
    request('POST', '/register', {
      firstName: firstName,
      lastName: lastName,
      login: username,
      password: password,
    })
      .then((response) => {
        setAuthHeader(response.data.token);
        setComponentToShow('messages');
      })
      .catch((error) => {
        setAuthHeader(null);
        setComponentToShow('welcome');
      });
  };

  useEffect(() => {
    let pageUrl = page;

    if (!pageUrl) {
      const queryParameters = new URLSearchParams(window.location.search);
      const getUrl = queryParameters.get('page');

      if (getUrl) {
        pageUrl = getUrl;
        setPage(getUrl);
      } else {
        pageUrl = 'start';
      }
    }
    window.history.pushState(null, '', `?page=${pageUrl}`);
  }, [page]);

  return (
    <>
      <Start/>
      <Buttons login={login} logout={logout} />
      {componentToShow === 'welcome' && <WelcomeContent />}
      {componentToShow === 'login' && <LoginForm onLogin={onLogin} onRegister={onRegister} />}
      {componentToShow === 'messages' && <AuthContent />  }
    </>
  );
};

export default App;
