import React from "react";
import {List, Avatar, Button} from "antd";

export class UserManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        fetch("http://localhost:8088/getUsers")
            .then(response => response.json())
            .then(users => {
                this.setState({
                    users: users,
                });
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }

    transUserType = (type) => {
        if (type === 1) return 'Status: Normal';
        else return 'Status: Lock'
    }
    lock = (e) => {
        let userId = e.target.id;
        if (userId !== 0)
        {
            fetch("http://localhost:8088/updateUser?userId=" + userId + "&type=0")
                .then(response => response.json())
                .then(success => {
                    console.log(success)
                    this.getData();
                }).catch(function (ex) {
                console.log("parsing failed", ex)
            })
        }
    }
    unlock = (e) => {
        let userId = e.target.id;
        if (userId !== 0)
        {
            fetch("http://localhost:8088/updateUser?userId=" + userId + "&type=1")
                .then(response => response.json())
                .then(success => {
                    console.log(success)
                    this.getData();
                }).catch(function (ex) {
                console.log("parsing failed", ex)
            })
        }
    }
    disable = (type) => {
        return type === 1;
    }

    render() {
        return (
            <List
                bordered={true}
                itemLayout="horizontal"
                dataSource={this.state.users}
                renderItem={item => (
                    <List.Item
                        actions={[<Button id={item.userId} disabled={!this.disable(item.userType)} danger
                                          onClick={this.lock}>Lock</Button>,
                            <Button id={item.userId} disabled={this.disable(item.userType)}
                                    onClick={this.unlock}>Unlock</Button>]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={item.avatarBase64}/>}
                            title={<span style={{float:'left'}}>{item.name}</span>}
                            description={this.transUserType(item.userType)}
                        />
                    </List.Item>
                )}
            />
        );
    }
}
