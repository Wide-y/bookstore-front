import React from "react";
import {Card, Input} from "antd";
import "../style.css"
import {Link,withRouter} from "react-router-dom";

const {Meta} = Card;

export class Bookcard extends React.Component {

    submit = (e) => {
        this.setState(
            {
                inputDisable: true,
                name: e.target.value,
                author: this.props.author
            }
        );
        console.log(this.state.name)
        this.props.update(this.props.id, this.state.name, this.state.author);
    }

    constructor(props) {
        super(props);

        this.state = {
            inputDisable: true,
            name: this.props.book.name,
            author: this.props.book.author,
        }
    }

    render() {
        return (
            <Link to={{
                pathname: "/bookdetail",
                state: {user:this.props.user,
                        bookId:this.props.id
                },
            }}>
                <Card
                    hoverable
                    style={{width: '240'}}

                    cover={<img src={this.props.book.imgBase64} alt="Fail to Load"/>}
                >
                    <Meta title={<Input className={this.state.inputDisable ? "inputDisable" : "inputEnable"}
                                        id="input"
                                        readOnly
                                        defaultValue={this.props.book.name}
                                        onBlur={this.submit}
                                        onPressEnter={this.submit.bind(this)}
                    />}
                          description={this.props.book.author}>
                    </Meta>
                </Card>
            </Link>
        );
    }
}

Bookcard.defaultProps = {
    name: "Unknown",
    author: "Unknown"
}

export default withRouter(Bookcard)

