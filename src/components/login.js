import {Form, Input, Button, Checkbox, message, Modal} from 'antd';
import React from "react";
import "antd/dist/antd.css"
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {browserHistory} from "../history";


const u_id = 0;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

export class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: u_id,
            log: false,
            visible:false,
            username:'',
            password:'',
            repeat:'',
            email:''
        }
    }

    checkUser = (username, password) => {
        fetch("http://localhost:8088/checkLog/?username=" + username + "&password=" + password)
            .then(response => response.json())
            .then(u_id => {
                this.setState({
                    userId: u_id,
                });
                console.log(this.state.log);
                this.logSuccess(this.state.userId);
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }

    sendmsg = (id) => {
        if (id === 0)
            message.info("Error username or password");

        else
            message.info("Your account has been locked");
    }

    logSuccess = (id) => {
        if (id > 0) {
            browserHistory.push('/' + this.state.userId)
            this.setState({
                log: true
            })
            console.log(this.props)
            this.props.history.push('/' + this.state.userId)
        } else {
            this.sendmsg(id);
        }
    }
    onFinish = values => {
        this.checkUser(values.username, values.password);
    }
    onshow=()=>{
        this.setState({visible:true});
    }
    onhandleOK=()=>{
        switch (this.checkValid()) {
            case 1:message.error("Need Username");return;
            case 2:message.error("Need Password");return;
            case 3:message.error("Repeat password error");return;
            case 4:message.error("Need Email");return;
            case 5:message.error("Invalid Email");return;
            default: this.addUser();
        }

    }
    onhandleCancel=()=>{
        this.setState({visible:false});
    }
    setUsername=(e)=>{
        this.setState({username:e.target.value})
    }
    setPassword=(e)=>{
        this.setState({password:e.target.value})
    }
    setRepeat=(e)=>{
        this.setState({repeat:e.target.value})
    }
    setEmail=(e)=>{
        this.setState({email:e.target.value})
    }
    checkValid=()=>{
        if (this.state.username === '') return 1;
        if (this.state.password === '') return 2;
        if (this.state.repeat !== this.state.password) return 3;
        if (this.state.email!== '') {
            let reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.\-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            // let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            if (!reg.test(this.state.email)) return 5;
            else
                return 0;
        }
        else return 4;
    }
    addUser=()=>{
        fetch("http://localhost:8088/addUser?username="+this.state.username+"&pwd="+this.state.password+"&email="+this.state.email)
            .then(response => response.json())
            .then(result => {

                console.log(result);
                if (result){message.info("Register Success,Please Login");this.setState({visible:false});return 1;}
                else {message.error("Username has been used"); }

            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }

    render() {

        return (
            <div>
            <Form
                name="normal_login"
                style={{maxWidth: '600px'}}
                initialValues={{remember: true}}
                onFinish={this.onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{required: true, message: 'Please input your Username!'}]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{required: true, message: 'Please input your Password!'}]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{width: '40%',marginRight:20}}>
                        Log in
                    </Button>
                    Or <Button type={"link"} onClick={this.onshow}>register NOW</Button>
                </Form.Item>
            </Form>
                <Modal
                    title={"register"}
                    visible={this.state.visible}
                    onOk={this.onhandleOK}
                    onCancel={this.onhandleCancel}
                >
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input onBlur={this.setUsername}/>
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password onBlur={this.setPassword} />
                        </Form.Item>

                        <Form.Item
                        label="Repeat Password"
                        name="Repeat password"
                        rules={[{ required: true, message: 'Please repeat your password!' }]}
                        >
                            <Input.Password onBlur={this.setRepeat}/>
                        </Form.Item>

                        <Form.Item
                            label="E-mail"
                            name="E-mail"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input onBlur={this.setEmail}/>
                        </Form.Item>

                    </Form>
                </Modal>
            </div>
        );
    }
}

