import Start from './components/Start'
import Header from './components/Header'
import Task from './components/Task';
import './App.css'
import { useEffect, useState } from 'react';

function App() {
  const [page, setPage] = useState<string>("");

  useEffect(() => {
    let pageUrl = page;

    if (!pageUrl) {
      const queryParameters = new URLSearchParams(window.location.search);
      const getUrl = queryParameters.get("page");

      if (getUrl) {
        pageUrl = getUrl;
        setPage(getUrl);
      } else {
        pageUrl = "start";
      }
    }
    window.history.pushState(null, "", "?page=" + pageUrl);
  }, [page]);

  return (
    <>
    <Header setPage={setPage} />
    {{
        start: <Start />,
        task: <Task />,
        
      }[page] || <Start />}
    </>
  )
}

export default App
