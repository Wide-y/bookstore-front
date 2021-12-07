import React from "react";
import {Tabs} from "antd";
import {BookManager} from "./BookManager";
import {UserManager} from "./UserManager";
import {OrderManage} from "./OrderManage";
import {BookRank} from "./bookRank";
import {UserRank} from "./UserRank";

const {TabPane} = Tabs;

export class ManageTab extends React.Component {
    callback = (key) => {
        console.log(key)
    }

    render() {
        return (
            <Tabs defaultActiveKey="1" onChange={this.callback}>
                <TabPane tab="Books" key="1">
                    <BookManager/>
                </TabPane>
                <TabPane tab="User" key="2">
                    <UserManager/>
                </TabPane>
                <TabPane tab="Order" key="3">
                    <OrderManage/>
                </TabPane>
                <TabPane tab="BookRank" key="4">
                    <BookRank/>
                </TabPane>
                <TabPane tab="UserRank" key="5">
                    <UserRank/>
                </TabPane>
            </Tabs>
        );
    }
}
