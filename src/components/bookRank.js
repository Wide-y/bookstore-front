import React from "react";
import {Radio,List,Avatar} from "antd";



export class BookRank extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ranklist: [],
            type: '0',
        }
    }

    getBookRank = (type) => {
        fetch("http://localhost:8088/getRank?userId=1&type=" + type + "&admin=1")
            .then(response => response.json())
            .then(success => {
                this.setState({
                    ranklist: success
                })
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }
    onChange = (e) => {
        this.setState({type: e.target.value})
        this.getBookRank(e.target.value)
    }

    componentDidMount() {
        this.getBookRank(0)
    }

    render() {
        return (
            <div>
                <Radio.Group onChange={this.onChange} defaultValue={this.state.type}>
                    <Radio.Button value="0">总榜</Radio.Button>
                    <Radio.Button value="1">周榜</Radio.Button>
                    <Radio.Button value="2">月榜</Radio.Button>
                    <Radio.Button value="3">年榜</Radio.Button>
                </Radio.Group>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.ranklist}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar shape={"square"} src={item.book.imgBase64} />}
                                title={<span style={{float:'left'}}>{item.book.name}</span>}
                                description={<span style={{float:'right'}}>销量： {item.num}</span>}
                            />
                        </List.Item>
                    )}
                />
            </div>
        )
    }

}
