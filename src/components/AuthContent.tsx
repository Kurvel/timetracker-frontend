import React from "react";
import { request } from "../axios_helper";
import Statistics from "./Statistics";
import Task from "./Task";
import Time from "./Time";

interface State {
    data: any[]; // You can replace 'any' with the actual type of your data
    showStatistics: boolean; // State variable to control visibility of Statistics component
    showTask: boolean; // State variable to control visibility of Task component
    showTime: boolean;

}

export default class AuthContent extends React.Component<{}, State> {
    
    constructor(props: {}) {
        super(props);
        this.state = {
            data : [],
            showStatistics: false,
            showTask: false, 
            showTime: false
        };
    };

    componentDidMount() {
        request(
            "GET",
            "/test",
            {}
        ).then((response) => {
            console.log(response.data);
            
            this.setState({ data: response.data })
        });
    };

    render() {
        return (
            <div>
                {this.state.data && this.state.data.map((line: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined) => <p>{line}</p>)}
                <button onClick={() => this.setState({ showTask: true, showStatistics: false, showTime: false })}>Task</button>
                <button onClick={() => this.setState({ showStatistics: true, showTask: false, showTime: false })}>Statistics</button>
                <button onClick={() => this.setState({ showTime: true, showStatistics: false, showTask: false })}>Time Tracker</button>
                {this.state.showTask && <Task />}
                {this.state.showStatistics && <Statistics />}
                {this.state.showTime && <Time/>}
            </div>
        )
    }
}
