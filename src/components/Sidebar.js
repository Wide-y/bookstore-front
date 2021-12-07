import React from 'react';
import {Menu} from 'antd';
import 'antd/dist/antd.css';
import {Link} from 'react-router-dom';
import {
    HomeOutlined,
    ShoppingCartOutlined,
    ProfileOutlined,
    UserOutlined,
    BarChartOutlined
} from '@ant-design/icons';


export class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        }
    }

    show = () => {
        return this.props.user.userType === 2;
    }

    componentDidMount() {
        this.setState({user: this.props.user});
    }

    render() {
        const visible = !this.show()
        return (
            <div>
                <Menu theme={'light'} style={{minWidth: '120px'}} defaultSelectedKeys={['1']}>
                    <Menu.Item key='1'>
                        <Link to={{
                            pathname: "/book",
                            state: this.props.user
                        }}/>
                        <HomeOutlined/>
                        <span>Book</span>
                    </Menu.Item>
                    <Menu.Item key='2'>
                        <Link to={{
                            pathname: "/cart",
                            state: this.props.user
                        }}/>
                        <ShoppingCartOutlined/>
                        <span>My Cart</span>
                    </Menu.Item>
                    <Menu.Item key={'3'}>
                        <Link to={{
                            pathname: "/order",
                            state: this.props.user
                        }}/>
                        <ProfileOutlined/>
                        <span>My Order</span>
                    </Menu.Item>
                    <Menu.Item key={'4'}>
                        <Link to={{
                            pathname: "/profile",
                            state: this.props.user
                        }}/>
                        <UserOutlined/>
                        <span>My Profile</span>
                    </Menu.Item>
                    <Menu.Item key={'5'}>
                        <Link to={{
                            pathname: "/collection",
                            state: this.props.user
                        }}/>
                        <BarChartOutlined/>
                        <span>My Order Count</span>
                    </Menu.Item>
                    <Menu.Item key={'6'} hidden={visible}>
                        <Link to={{
                            pathname: "/manager",
                            state: this.props.user
                        }}/>
                        <UserOutlined/>
                        <span>Manager</span>
                    </Menu.Item>
                </Menu>
            </div>
        );
    }
}
