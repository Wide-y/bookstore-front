import React from "react";
import {Card, Col, Row, Descriptions, Button, message, InputNumber} from "antd";

const book = [];
const cart = [];

export class BookDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            data: book,
            tocart: cart,
            num:1
        }
    }

    getBook = (id) => {
        fetch("http://localhost:8088/getBook/?id=" + id)
            .then(response => response.json())
            .then(book => {
                this.setState({
                    data: book
                });
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }

    addToCart = () => {
        if (!this.props.location.state) {
            console.log("not login");
            this.sendMsg();
            return;
        }
        fetch("http://localhost:8088/addCartItem/?userId=" + this.props.location.state.user.userId + "&bookId=" + this.state.data.bookID+"&num="+this.state.num)
            .then(response => response.json())
            .then(cart => {
                this.setState({
                    tocart: cart,
                });
                console.log(this.state.data)
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }
    changeNum=(value)=> {
        this.setState({num: value})
        console.log(value)
    }

    sendMsg = () => {
        message.info("Please Log in")
    }

    componentDidMount() {
        this.getBook(this.props.location.state.bookId);
        this.setState({user: this.props.location.state.user,})
        console.log(this.props.location.state)
    }

    render() {

        return (
            <div>
                <Row>
                    <Col span={6}>
                        <Card
                            style={{margin: 30}}
                            cover={<img src={this.state.data.imgBase64} alt="Fail to Load"/>}>
                        </Card>
                    </Col>
                    <Col span={18}>
                        <Descriptions bordered title={this.state.data.name} style={{margin: 30}}>
                            <Descriptions.Item label="Author">{this.state.data.author}</Descriptions.Item>
                            <Descriptions.Item label="Type">{this.state.data.type}</Descriptions.Item>
                            <Descriptions.Item label="Price">{'$' + this.state.data.price}</Descriptions.Item>
                            <Descriptions.Item label="Inventory"
                                               span={3}>{this.state.data.inventory}</Descriptions.Item>

                            <Descriptions.Item label="Description" span={2}>
                                {this.state.data.description}
                            </Descriptions.Item>
                        </Descriptions>

                    </Col>
                </Row>
                <Row>
                    <Col span={12}/>
                    <Col span={6}>
                        <InputNumber
                            min={1}
                            max={this.state.data.inventory}
                            defaultValue={1}
                            onChange={this.changeNum}
                        />
                    </Col>
                    <Col span={6}>
                        <Button type={"primary"} onClick={this.addToCart}>Add to Cart</Button>
                    </Col>
                </Row>
            </div>
        );

    }
}
