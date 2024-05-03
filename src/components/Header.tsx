interface Props {
    setPage: (page: string) => void;
  }
  
  function Header(props: Props) {
    return (
      <header>
        <button onClick={() => props.setPage("start")}>Start</button>
        <button onClick={() => props.setPage("task")}>Task</button>
        <button onClick={() => props.setPage("user")}>User</button>
      </header>
    );
  }
  
  export default Header;