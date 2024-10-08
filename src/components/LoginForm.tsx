import React, { FormEvent } from "react";
import classNames from "classnames";

interface LoginFormProps {
  onLogin?: (
    e: FormEvent<HTMLFormElement>,
    username: string,
    password: string
  ) => void;
  onRegister?: (
    event: FormEvent<HTMLFormElement>,
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    tasks: any[]
  ) => void;
}

interface State {
  active: string;
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  tasks: any[];
}

export default class LoginForm extends React.Component<LoginFormProps, State> {
  constructor(props: LoginFormProps) {
    super(props);
    this.state = {
      active: "login",
      firstName: "",
      lastName: "",
      login: "",
      password: "",
      tasks: [],
    };
  }

  onChangeHandler = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    this.setState(
      (prevState) =>
        ({
          ...prevState,
          [name]: value,
        } as Pick<State, keyof State>)
    );
  };

  onSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { onLogin } = this.props;
    if (onLogin) {
      onLogin(e, this.state.login, this.state.password);
    }
  };

  onSubmitRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { onRegister } = this.props;
    if (onRegister) {
      const tasks: any[] = [];

      onRegister(
        e,
        this.state.firstName,
        this.state.lastName,
        this.state.login,
        this.state.password,
        tasks
      );
    }
  };

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-8">
          <ul
            className="nav nav-pills nav-justified mb-3"
            id="ex1"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className={classNames(
                  "nav-link",
                  this.state.active === "login" ? "active" : ""
                )}
                id="tab-login"
                onClick={() => this.setState({ active: "login" })}
              >
                Login
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={classNames(
                  "nav-link",
                  this.state.active === "register" ? "active" : ""
                )}
                id="tab-register"
                onClick={() => this.setState({ active: "register" })}
              >
                Register
              </button>
            </li>
          </ul>

          <div className="tab-content">
            <div
              className={classNames(
                "tab-pane",
                "fade",
                this.state.active === "login" ? "show active" : ""
              )}
              id="pills-login"
            >
              <form onSubmit={this.onSubmitLogin}>
                <div className="form-outline mb-4">
                  <input
                    type="login"
                    id="loginName"
                    name="login"
                    className="form-control"
                    onChange={this.onChangeHandler}
                  />
                  <label className="form-label" htmlFor="loginName">
                    Username
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="loginPassword"
                    name="password"
                    className="form-control"
                    onChange={this.onChangeHandler}
                  />
                  <label className="form-label" htmlFor="loginPassword">
                    Password
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block mb-4"
                >
                  Sign in
                </button>
              </form>
            </div>
            <div
              className={classNames(
                "tab-pane",
                "fade",
                this.state.active === "register" ? "show active" : ""
              )}
              id="pills-register"
            >
              <form onSubmit={this.onSubmitRegister}>
                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-control"
                    onChange={this.onChangeHandler}
                  />
                  <label className="form-label" htmlFor="firstName">
                    First name
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-control"
                    onChange={this.onChangeHandler}
                  />
                  <label className="form-label" htmlFor="lastName">
                    Last name
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="text"
                    id="login"
                    name="login"
                    className="form-control"
                    onChange={this.onChangeHandler}
                  />
                  <label className="form-label" htmlFor="login">
                    Username
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="registerPassword"
                    name="password"
                    className="form-control"
                    onChange={this.onChangeHandler}
                  />
                  <label className="form-label" htmlFor="registerPassword">
                    Password
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block mb-3"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
