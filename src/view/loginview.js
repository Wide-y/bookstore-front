import React from "react";
import {Login} from "../components/login";
import "../style.css"

export class Loginview extends React.Component {
    render() {
        return (
            <div class={"login-background"}>
                <div class={"login"}>
                    <h1>Login</h1>
                    <Login history={this.props.history}/>
                </div>
            </div>
        );
    }
}