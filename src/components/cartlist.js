import React from "react";
import {List, Avatar, Checkbox, Button, InputNumber, Modal, Select, message, Col, Row} from "antd";
import "../style.css"

const {Option} = Select;

const shoppinglist = [];
let paylist = [];
let address = [];
let tel = [];
let selectAddr = '';
let selectTel = '';
let json = {};
let priceList=[];

export class Cartlist extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: shoppinglist,
            userId: 0,
            user: [],
            visible: false,
            totValue:0
        }
    }

    getCartlist = (id) => {
        if (!id) {
            return;
        }
        fetch("http://localhost:8088/getCartlist/?id=" + id)
            .then(response => response.json())
            .then(shoppinglist => {
                this.setState({
                    data: shoppinglist,
                });
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
        console.log(this.state.data)
    }
    updateCartNum = (e) => {
        console.log(e.target)
        let cid = e.target.id;
        let num = e.target.value;
        fetch("http://localhost:8088/updateCart/?id=" + cid + "&num=" + num)
            .then(response => response.json())
            .then(n => {
                console.log(n)
                this.getCartlist(this.state.userId);
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })

    }

    optCart = e => {
        console.log(e.target.value)
        if (e.target.checked) {
            let tmp = this.state.data;
            let index = (tmp || []).findIndex((tmp) => tmp.itemId === e.target.id);
            let num = tmp[index].num;
            let json = {
                id: e.target.id,
                userId: this.state.userId,
                bookId: e.target.value.bookId,
                num: num,
            }
            paylist.push(json);
            priceList.push(tmp[index].book.price);
            console.log(paylist)
        } else {
            let index = (paylist || []).findIndex((paylist) => paylist.id === e.target.id);
            paylist.splice(index, 1);
            priceList.splice(index, 1);
            console.log(paylist);
        }
    }

    pay = () => {
        let totPrice = 0;
        for (let i in paylist){
            let price_int = priceList[i]*100
            let num = paylist[i].num
            totPrice += price_int*num;
        }
        totPrice = totPrice/100;
        console.log(paylist);
        console.log(priceList);
        this.setState({visible: true,totValue:totPrice})
    }
    onClickOK = () => {
        this.loadJson();
        console.log(json)
        if (this.check()) {
            this.loadOrder();
            this.setState({visible: false})
        } else message.error("Invalid Order");
    }
    onClickCancel = () => {
        this.setState({visible: false})
    }
    loadJson = () => {
        let totPrice = this.state.totValue;
        let list = this.state.data;
        let index = (list || []).findIndex((list) => list.itemId === paylist[0].id);
        console.log(index)
        let name = list[index].book.name;

        json = {
            userId: this.state.userId,
            name:this.state.user.name,
            address: selectAddr,
            tel: selectTel,
            itemNum: 0,
            totPrice: totPrice,
            cartList: paylist,
            indexBook:name
        }
    }
    check = () => {
        if (json.userId === 0) return false;
        if (json.address === '') return false;
        if (json.tel === '') return false;
        return json.cartList !== [];


    }
    loadOrder = () => {
        let url = 'http://localhost:8088/pay';
        let obj = JSON.stringify(json)
        let fetchOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: obj
        }
        console.log(obj)
        fetch(url, fetchOption)
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
                this.getCartlist(this.state.userId)
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        });
    }

    setaddr=(value)=>{
        selectAddr = value;
        console.log(value)
    }
    setTel=(value)=>{
        selectTel = value;
        console.log(value)
    }

    deleteCart=(e)=>{
        console.log(e.target.id)
        fetch("http://localhost:8088/deleteCart/?id=" + e.target.id)
            .then(response => response.json())
            .then(n => {
                console.log(n)
                this.getCartlist(this.state.userId);
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }

    componentWillMount() {
        console.log(this.props.location.state)
        this.setState({
            userId: this.props.location.state.userId,
            user: this.props.location.state
        })
        this.getCartlist(this.props.location.state.userId);
    }


    render() {
        address = this.state.user.address
        tel = this.state.user.tel
        console.log(address)
        return (
            <div>
                <List
                    header={<h1>My Cart</h1>}
                    size={"large"}
                    itemLayout="horizontal"
                    dataSource={this.state.data}
                    renderItem={item => (

                        <List.Item style={{borderColor: "white"}}>
                            <Checkbox style={{marginRight: "20px"}} id={item.itemId}
                                      value={{bookId: item.book.bookID}} onChange={this.optCart}/>
                            <List.Item.Meta
                                avatar={<Avatar shape={"square"} size={64} src={item.book.imgBase64}/>}
                                title={<span style={{float: "left", fontSize: "16px"}}>{item.book.name}</span>}
                                description={<span class={"priceStyle"}>${item.book.price}</span>}
                                style={{float: "right"}}
                            />
                            <InputNumber id={item.itemId}
                                         defaultValue={item.num}
                                         min={1}
                                         max={item.book.inventory}
                                         onBlur={this.updateCartNum}
                            />
                            <Button danger id={item.itemId} style={{marginLeft:10}} onClick={this.deleteCart}>Delete</Button>

                        </List.Item>

                    )}
                />
                <Row>
                    <Col span={16}/>

                    <Col span={4}>
                        <Button type={"primary"} shape={"round"} size={"large"} onClick={this.pay}>Pay NOW</Button>
                    </Col>
                </Row>


                <Modal
                    visible={this.state.visible}
                    title={"Submit Order"}
                    onOk={this.onClickOK}
                    onCancel={this.onClickCancel}
                >
                    <span>User: {this.state.user.name}</span>
                    <br/>
                    <span>Total Price: ￥{this.state.totValue}</span>
                    <br/>
                    <span>Tel:</span>
                    <br/>
                    <Select
                        placeholder="请选择"
                        filterOption={false}
                        onChange={this.setTel}
                        style={{width:'100%'}}

                    >
                        {
                            tel.map((item, index) => (
                                <Option key={index} value={item}>{item}</Option>
                            ))
                        }
                    </Select>
                    <br/>
                    <span>Address:</span>
                    <br/>
                    <Select
                        placeholder="请选择"
                        filterOption={false}
                        // defaultValue={address && address[0]}
                        onChange={this.setaddr}
                        style={{width:'100%'}}
                    >
                        {
                            address.map((item, index) => (
                                <Option key={index} value={item}>{item}</Option>
                            ))
                        }
                    </Select>
                </Modal>
            </div>
        );
    }
}
