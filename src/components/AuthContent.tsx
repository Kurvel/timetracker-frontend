import React from "react";
import { request } from "../axios_helper";
import Statistics from "./Statistics";
import Task from "./Task";
import Time from "./Time";

interface State {
    data: any[]; 
    showStatistics: boolean; 
    showTask: boolean; 
    showTime: boolean; 
}

export default class AuthContent extends React.Component<{}, State> {
 
    constructor(props: {}) {
        super(props);
        this.state = {
            data: [],
            showStatistics: false,
            showTask: false, 
            showTime: false
        };
    };

    componentDidMount() {
        const userId = localStorage.getItem('userId');
        request(
            "GET",
            `/user/${userId}`,
            {}
        ).then((response) => {
            console.log(response.data.firstName);
            this.setState({ data: response.data.firstName });
        });
    };

    render() {
        return (
            <div >
               <p>Hello {this.state.data && this.state.data} </p>  <br />

               <div className="nav">
               
                <button onClick={() => this.setState({ showTask: true, showStatistics: false, showTime: false })}>Task</button>
                
                <button onClick={() => this.setState({ showTime: true, showStatistics: false, showTask: false })}>Time Tracker</button>
                <button onClick={() => this.setState({ showStatistics: true, showTask: false, showTime: false })}>Statistics</button>
               </div>
                
                {this.state.showTask && !this.state.showStatistics && !this.state.showTime && <Task />}
                {this.state.showStatistics && !this.state.showTask && !this.state.showTime && <Statistics />}
                {this.state.showTime && !this.state.showTask && !this.state.showStatistics && <Time/>}
            </div>
        )
    }
}
