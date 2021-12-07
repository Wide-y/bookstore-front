import React from "react";
import {List, Descriptions, Button, Radio, Modal, Avatar} from "antd";
import "../style.css"


const shoppinglist = [];

export class Orderlist extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: shoppinglist,
            userId: 0,
            orderItem: [],
            visible: false,
            type:0
        }
    }

    getOrdlist = (id,type=0) => {
        if (!id) {
            return;
        }
        fetch("http://localhost:8088/getOrderList/?userId=" + id+"&type=" +type+"&admin=0")
            .then(response => response.json())
            .then(shoppinglist => {
                this.setState({
                    data: shoppinglist,
                    userId:id,
                });
                console.log(this.state.data)
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }

    getOrderItem = (e) => {
        let id = e.target.id
        fetch("http://localhost:8088/getOrderItems/?listId=" + id)
            .then(response => response.json())
            .then(list => {
                this.setState({
                    orderItem: list,
                    visible:true
                });
                console.log(this.state.data)
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }
    onChange=(e)=>{
        this.setState({type:e.target.value})
        this.getOrdlist(this.state.userId,e.target.value)
    }

    componentDidMount() {
        this.getOrdlist(this.props.location.state.userId);
    }


    render() {
        return (
            <div>
                <Radio.Group defaultValue={this.state.type} onChange={this.onChange}>
                    <Radio.Button value={0}>全部</Radio.Button>
                    <Radio.Button value={1}>过去一周</Radio.Button>
                    <Radio.Button value={2}>过去一月</Radio.Button>
                    <Radio.Button value={3}>过去一年</Radio.Button>
                </Radio.Group>
                <List
                    header={<h1>My Order</h1>}
                    size={"large"}
                    itemLayout="horizontal"
                    dataSource={this.state.data}
                    renderItem={item => (
                        <List.Item style={{borderColor: "white"}}>
                            <List.Item.Meta
                                description={
                                    <Descriptions bordered>
                                        <Descriptions.Item
                                            label="Product">{item.indexBook} 等 {item.itemNum} 种</Descriptions.Item>
                                        <Descriptions.Item label="Username">{item.name}</Descriptions.Item>
                                        <Descriptions.Item label="Tel">{item.tel}</Descriptions.Item>
                                        <Descriptions.Item label="Total Price">￥{item.totPrice}</Descriptions.Item>
                                        <Descriptions.Item label="Address" span={2}>{item.address}</Descriptions.Item>
                                        <Descriptions.Item label="Time">{item.date}</Descriptions.Item>
                                        <Descriptions.Item label="Detail">
                                            <Button id={item.id} type={"link"}
                                                    onClick={this.getOrderItem}
                                            >
                                                view
                                            </Button>
                                        </Descriptions.Item>
                                    </Descriptions>
                                }
                            />
                        </List.Item>
                    )}
                />
                <Modal
                    visible={this.state.visible}
                    onOk={() => this.setState({visible: false})}
                >
                    <List
                        header={<h1>Detail</h1>}
                        size={"large"}
                        itemLayout="horizontal"
                        dataSource={this.state.orderItem}
                        renderItem={item => (
                            <List.Item style={{borderColor: "white"}}>
                                <List.Item.Meta
                                    avatar={<Avatar shape={"square"} src={item.book.imgBase64}/>}
                                    title={item.book.name}
                                    description={
                                        <span>×{item.num}</span>
                                    }
                                />
                                <span>￥{item.book.price*100*item.num/100}</span>
                            </List.Item>
                        )}
                    />
                </Modal>
            </div>
        );
    }
}
