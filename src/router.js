import {BrowserRouter, Route, Switch,} from 'react-router-dom';
import React from "react";
import {HomeView} from "./view/homeview";
import {Bookoutline} from "./components/bookoutline";
import {browserHistory} from "./history";
import {Cartlist} from "./components/cartlist";
import {Loginview} from "./view/loginview";
import {User} from "./components/User";
import {Orderlist} from "./components/orderlist";
import {BookDetail} from "./components/BookDetail";
import {ManageTab} from "./components/ManageTab"
import {Collection} from "./components/Collection";

export class BasicRouter extends React.Component {
    constructor(props) {
        super(props);

        browserHistory.listen((location, action) => {
            console.log(11)
        });
    }

    render() {
        return (
            <BrowserRouter history={browserHistory}>
                <Switch>
                    <Route path="/login" component={Loginview}/>
                    <Route path="/:userId" component={HomeView}/>
                    <Route path="/" component={HomeView}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export class HomeRouter extends React.Component {
    render() {
        return (

            <Switch>
                <Route path="/cart" component={Cartlist}/>
                <Route path="/book" component={Bookoutline}/>
                <Route path="/order" component={Orderlist}/>
                <Route path="/profile" component={User}/>
                <Route path="/collection" component={Collection}/>
                <Route path="/manager" component={ManageTab}/>
                <Route path={"/bookdetail"} component={BookDetail}/>
                <Route path="/" component={Bookoutline}/>
            </Switch>

        );
    }
}
