import React from "react";
import {Avatar, List, Radio} from "antd";

export class Collection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            type: '0',
            userId: 0,
            user: []
        }
    }

    getBookRank = (type, userId) => {
        fetch("http://localhost:8088/getRank?userId=" + userId + "&type=" + type + "&admin=0")
            .then(response => response.json())
            .then(success => {
                this.setState({
                    data: success
                })
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }
    onChange = (e) => {
        this.setState({type: e.target.value})
        this.getBookRank(e.target.value, this.state.userId)
    }

    componentDidMount() {
        console.log(this.props.location.state.userId);
        this.setState({
            userId: this.props.location.state.userId,
            user: this.props.location.state
        })
        this.getBookRank(0, this.props.location.state.userId)
    }

    render() {
        return (
            <div>
                <Radio.Group onChange={this.onChange} defaultValue={this.state.type}>
                    <Radio.Button value="0">全部</Radio.Button>
                    <Radio.Button value="1">过去一周</Radio.Button>
                    <Radio.Button value="2">过去一月</Radio.Button>
                    <Radio.Button value="3">过去一年</Radio.Button>
                </Radio.Group>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar shape={"square"} src={item.book.imgBase64}/>}
                                title={<span style={{float: 'left'}}>{item.book.name}</span>}
                                description={
                                    <div>
                                        <span style={{float: 'right'}}>购买数： {item.num}</span>
                                        <span>总金额：{item.book.price*1000*item.num/1000}</span>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}
