import React from "react";
import {Avatar, Menu, Dropdown} from "antd";
import {Link} from "react-router-dom";
import {UserOutlined} from "@ant-design/icons";

export class UserAvatar extends React.Component {
    logMenu = (flag = 0) => {
        if (flag) {
            return (
                <Menu>
                    <Menu.Item>
                        <Link to={"/profile"}>My Profile</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to={"/"} onClick={this.props.logOut}>Log out</Link>
                    </Menu.Item>
                </Menu>);
        } else {
            return (
                <Menu>
                    <Menu.Item>
                        <Link to={"/login"}>Log in</Link>
                    </Menu.Item>
                </Menu>);
        }
    }
    setName = (log = 0, name = '') => {
        if (log) {
            return name;
        } else
            return "Someone";
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.render()
    }

    render() {
        const menu = (this.logMenu(this.props.isLog));

        const user = {username: this.setName(this.props.isLog, this.props.user.nickname)};

        // const imgUrl = config.imgUrl + "/" + user.username + ".jpg";

        return (
            <div id="avatar">
                <span className="name" style={{color: this.props.color}}>Hi, {user.username}</span>
                <Dropdown overlay={menu} placement="bottomRight">
                    <Avatar src={this.props.user.avatarBase64} style={{cursor: "pointer"}}/>
                </Dropdown>
            </div>
        );
    }
}
