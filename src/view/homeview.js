import React from "react";
import {Sidebar} from "../components/Sidebar";
import {Layout} from "antd";
import {HomeRouter} from "../router";
import "../style.css"
import {UserAvatar} from "../components/avatar";



const {Header,Sider,Content,Footer} = Layout;

export class HomeView extends React.Component{

    constructor(props) {
        super(props);

        this.state={
            data: [],
            isLogged: 0,
        }
    }

    getUser=(id=0)=>{
        console.log(id);

        fetch("http://localhost:8088/getUser/?id="+id)
            .then(response => response.json())
            .then(user => {
                this.setState({
                    data: user,
                    isLogged: id===0?0:1,
                });
                console.log(this.state.data)
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }

    componentDidMount() {
        this.getUser(this.props.match.params.userId);
    }

    logOut=()=>{
        this.getUser()
    }
    render() {
        console.log(this.state.data)
        return (
            <Layout style={{minHeight : '100vh'}} >
                <Header>
                    <h1 class={"homeHeader"}>Book Store</h1>
                    <div class={"homeAvatar"}>
                        <UserAvatar color={"white"} isLog={this.state.isLogged} user={this.state.data} logOut={this.logOut}/>
                    </div>
                </Header>

                <Layout>
                    <Sider theme={'light'}>
                        <Sidebar log={this.state.isLogged} user={this.state.data}/>
                    </Sider>
                    <Content style={{margin:'30px'}}>
                        {/*<div>{this.props.children}</div>*/}
                        <HomeRouter/>
                    </Content>

                </Layout>
                <Footer>
                    <span>hhhh</span>
                </Footer>
            </Layout>

        );
    }
}

