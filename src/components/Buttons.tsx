import * as React from 'react';

export default function Buttons(props: { login: React.MouseEventHandler<HTMLButtonElement> | undefined; logout: React.MouseEventHandler<HTMLButtonElement> | undefined; }) {
  return (
    <div className="row">
      <div className="col-md-12 text-center" style={{ marginTop: '30px' }}>
        <button className="btn btn-primary" style={{ margin: '10px' }} onClick={props.login}>
          Login
        </button>
        <button className="btn btn-dark" style={{ margin: '10px' }} onClick={props.logout}>
          Logout
        </button>
      </div>
    </div>
  );
};