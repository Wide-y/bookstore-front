import React from "react";
import {Table, Avatar, Popover, Input, Button, Upload, message, Modal, Form} from "antd";

const {Search} = Input;
const {TextArea} = Input;

const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 16},
};

export class BookManager extends React.Component {
    columns = [
        {
            title: 'Image',
            dataIndex: 'imgBase64',
            key: 'image',
            render: (imgBase64, record) => {
                return (
                    <div>
                        <Popover
                            content={<img src={imgBase64} alt={"Fail to load"}/>}
                            style={{align: 'center'}}
                        >
                            <Avatar src={imgBase64} shape={'square'} style={{float: 'left'}}/>
                        </Popover>
                        <Upload
                            id={record.bookID}
                            action={"http://localhost:3000"}
                            accept={'image/jpeg'}
                            beforeUpload={this.beforeUpload}
                            onChange={this.uploadImg}
                            showUploadList={false}
                        >
                            <Button
                                size={"small"}
                                id={record.bookID}
                                style={{margin: 20}}
                                onClick={() => {
                                    this.setState({currImg: record.bookID})
                                }}>
                                Upload Image
                            </Button>
                        </Upload>
                    </div>
                )
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => {
                return <Input id={record.bookID} name={'name'} defaultValue={name} onBlur={this.changeText}/>
            }
        },
        {
            title: 'Author',
            dataIndex: 'author',
            key: 'author',
            render: (author, record) => {
                return <Input id={record.bookID} name={'author'} defaultValue={author} onBlur={this.changeText}/>
            }
        },
        {
            title: 'Inventory',
            dataIndex: 'inventory',
            key: 'inventory',
            render: (inventory, record) => {
                return <Input id={record.bookID} name={'inventory'} defaultValue={inventory} onBlur={this.changeText}/>
            }
        },
        {
            title: 'ISBN',
            key: 'isbn',
            dataIndex: 'isbn',
            render: (isbn, record) => {
                return <Input id={record.bookID} name={'isbn'} defaultValue={isbn} onBlur={this.changeText}/>
            }
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'bookID',
            render: (bookID) => {
                return (
                    <div>
                        <Button id={bookID} onClick={this.update}>Submit</Button>
                        <Button id={bookID} danger onClick={this.delete}>Delete</Button>
                    </div>
                )
            }
        },
    ];
    changeText = (e) => {
        let tmpbooks = this.state.books;
        let tmp = e.target;
        console.log(tmp.name)
        tmpbooks[e.target.id - 1][e.target.name] = e.target.value;
        this.setState({
            books: tmpbooks,
        })
        console.log(this.state.books)
    }
    beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        return isJpgOrPng;
    }
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    uploadImg = (info) => {
        if (info.file.status === 'done') {
            let tmpbooks = this.state.books;
            console.log(info)
            this.getBase64(info.file.originFileObj, imageUrl => tmpbooks[this.state.currImg - 1]['imgBase64'] = imageUrl)
            console.log(tmpbooks)
            this.setState({
                books: tmpbooks,
            })
        }
    }
    uploadImgNew = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({uploaded: false})
        }
        if (info.file.status === 'done') {
            let tbn = this.state.newbook;
            console.log(info)
            this.getBase64(info.file.originFileObj, imageUrl => tbn['imgBase64'] = imageUrl)
            console.log(tbn)
            this.setState({newbook: tbn, uploaded: true})
        }
    }
    addText = (e) => {
        let index = e.target.id;
        let tbn = this.state.newbook;
        tbn[index] = e.target.value;
        this.setState({newbook: tbn})
    }

    componentDidMount() {
        this.getBooks();
    }

    getBooks = () => {
        fetch("http://localhost:8088/getBooks")
            .then(response => response.json())
            .then(books => {
                this.setState({
                    books: books,
                    columns: this.columns,
                });
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }
    searchBook = (name) => {
        this.setState({
            books: []
        })
        fetch("http://localhost:8088/getBooksByName/?name=" + name)
            .then(response => response.json())
            .then(books => {
                this.setState({
                    books: books,
                });
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
    }
    update = (e) => {
        let id = e.target.id
        let url = 'http://localhost:8088/addBook';
        let obj = JSON.stringify(this.state.books[id - 1])
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
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        });
    }

    handleOk = () => {

        console.log(this.state.newbook)
        if (!this.check()) {
            message.error("Invalid Element");
            return;
        }
        if (!this.state.uploaded) {
            message.info("Image is loading")
            return;
        }
        this.setState({visible: false})
        console.log(11)
        let url = 'http://localhost:8088/addBook';
        let obj = JSON.stringify(this.state.newbook)
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
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        });
        this.getBooks();
    }
    handleCancel = () => {
        this.setState({visible: false})
    }
    addClick = () => {
        this.setState({visible: true})
    }
    check = () => {
        let newbook = this.state.newbook;
        if (newbook.name === '') return false;
        if (newbook.author === '') return false;
        if (newbook.imgBase64 === '') return false;
        if (newbook.description === '') return false;
        if (newbook.isbn === '') return false;
        if (newbook.type === '') return false;
        if (newbook.price === '') return false;
        if (newbook.inventory === '') return false;

        try {
            newbook.isbn = Number(newbook.isbn);
            newbook.price = parseFloat(newbook.price);
            newbook.inventory = Number(newbook.inventory);
        } catch (e) {
            console.log(e)
            return false;
        }
        return true;
    }
    delete = (e) => {
        let id = e.target.id
        fetch("http://localhost:8088/deleteBook/?bookId=" + id)
            .then(response => response.json())
            .then(success => {
                console.log(success)
            }).catch(function (ex) {
            console.log("parsing failed", ex)
        })
        this.getBooks();
    }

    constructor(props) {
        super(props);
        this.state = {
            books: [],
            newbook: {
                bookID:0,
                isbn: '',
                name: '',
                type: '',
                author: '',
                price: '',
                inventory: '',
                description: '',
                imgBase64: ''
            },
            currImg: 0,
            visible: false,
            uploaded: true
        }
    }

    render() {
        return (
            <div>
                <Search
                    placeholder=" search ..."
                    onChange={e => this.searchBook(e.target.value)}
                    style={{width: 200, marginBottom: 20}}
                />
                <Table columns={this.state.columns} dataSource={this.state.books}
                       rowKey={record => record.bookID.toString()}/>
                <Button style={{align: 'center', width: 240, height: 40, margin: 20}}
                        onClick={this.addClick}>Add</Button>
                <Button type={"primary"} style={{
                    align: 'center',
                    width: 240,
                    height: 40,
                    margin: 20
                }}
                        onClick={this.getBooks}
                >Flash</Button>
                <Modal
                    title="Add New Book"
                    visible={this.state.visible}
                    closable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form{...layout}>
                        <Form.Item>
                            <div>
                                <Popover
                                    content={<img src={this.state.newbook.imgBase64} alt={"Fail to load"}/>}
                                    style={{align: 'center'}}
                                >
                                    <Avatar src={this.state.newbook.imgBase64} shape={'square'}
                                            style={{float: 'left'}}/>
                                </Popover>
                                <Upload
                                    action={"https://www.mocky.io/v2/5cc8019d300000980a055e76"}
                                    accept={'image/jpeg'}
                                    beforeUpload={this.beforeUpload}
                                    onChange={this.uploadImgNew}
                                    showUploadList={false}
                                >
                                    <Button
                                        size={"small"}
                                        id={1}
                                        style={{margin: 20}}
                                    >
                                        Upload Image
                                    </Button>
                                </Upload>
                            </div>
                        </Form.Item>
                        <Form.Item
                            label={"name"}
                            name={"name"}
                            rules={[{required: true, message: 'Please input book name!'}]}
                        >
                            <Input onBlur={this.addText}/>
                        </Form.Item>
                        <Form.Item
                            label={"author"}
                            name={"author"}
                            rules={[{required: true, message: 'Please input author!'}]}
                        >
                            <Input onBlur={this.addText}/>
                        </Form.Item>
                        <Form.Item
                            label={"ISBN"}
                            name={"isbn"}
                            rules={[{required: true, message: 'Please input ISBN!'}]}
                        >
                            <Input onBlur={this.addText}/>
                        </Form.Item>
                        <Form.Item
                            label={"type"}
                            name={"type"}
                            rules={[{required: true, message: 'Please input type!'}]}
                        >
                            <Input onBlur={this.addText}/>
                        </Form.Item>
                        <Form.Item
                            label={"price"}
                            name={"price"}
                            rules={[{required: true, message: 'Please input price!'}]}
                        >
                            <Input onBlur={this.addText}/>
                        </Form.Item>
                        <Form.Item
                            label={"inventory"}
                            name={"inventory"}
                            rules={[{required: true, message: 'Please input inventory!'}]}
                        >
                            <Input onBlur={this.addText}/>
                        </Form.Item>
                        <Form.Item
                            label={"description"}
                            name={"description"}
                            rules={[{required: true, message: 'Please input description!'}]}
                        >
                            <TextArea rows={4} onBlur={this.addText}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}
