import {List, Input} from "antd";
import {Bookcard} from "./Bookcard";
import React from "react";
import "../router"


const books = [];

const {Search} = Input;

export class Bookoutline extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: books,
        }
    }

    getBooks = () => {
        fetch("http://localhost:8088/getBooks")
            .then(response => response.json())
            .then(books => {
                this.setState({
                    data: books,
                });
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }

    componentWillMount() {
        this.getBooks();
    }

    searchBook = (name) => {
        this.setState({
            data: books
        })
        fetch("http://localhost:8088/getBooksByName/?name=" + name)
            .then(response => response.json())
            .then(books => {
                this.setState({
                    data: books,
                });
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }


    render() {
        return (
            <div>
                <Search
                    placeholder=" search ..."
                    onChange={e => this.searchBook(e.target.value)}
                    style={{width: 200, marginBottom: 20}}
                />
                <List
                    grid={{gutter: 16, column: 8}}
                    size={'small'}
                    dataSource={this.state.data}
                    renderItem={item => (
                        <List.Item>
                            <Bookcard id={item.bookID}
                                      book={item}
                                      user={this.props.location.state}
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}
