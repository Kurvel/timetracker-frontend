import React from "react";
import { request } from "../axios_helper";

interface State {
    data: any[]; // You can replace 'any' with the actual type of your data
}

export default class AuthContent extends React.Component<{}, State> {
    
    constructor(props: {}) {
        super(props);
        this.state = {
            data : []
        };
    };

    componentDidMount() {
        request(
            "GET",
            "/test",
            {}
        ).then((response) => {
            console.log(response.data);
            
            this.setState({data : response.data})
        });
    };

    render() {
        return (
            <div>
                {this.state.data && this.state.data.map((line: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined) => <p>{line}</p>
                )}
            </div>
        )
    }
}