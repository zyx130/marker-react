import React from "react";
import { Table, Divider, Icon, message, Popconfirm } from "antd";
import asyncFetch from "../utils/asyncFetch";
import Apis from "../config/api.config";
import Columns from "../config/list.config";
import _ from "lodash";
import ModalView from "../components/ModalView";

class PageList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            modalViewVisible: false,
            modalViewTitle: "",
            modalViewRecord: {}
        };
    }

    componentDidMount() {
        console.log("componentDidMount");
        this.getMarkers();
    }

    getMarkers() {
        let url = Apis.get_list;
        asyncFetch('GET', url, {},
            (res) => {
                if (res.code === 0) {
                    let markers = [];
                    res.data.map(function(row) {
                        let labels = [];
                        row.labels.map(function(label) {
                            labels.push(label.name);
                        });
                        markers.push({
                            key: row.id,
                            title: row.title,
                            content: row.content,
                            author: row.author,
                            update_date: row.updateDate,
                            label: labels.join(', ')
                        });
                    });
                    this.setState({
                        dataSource: markers
                    });
                } else {
                    message.error(res.message);
                }
            }, {}, 'cors');
    }

    deleteMarker(record) {
        let url = Apis.delete_marker.replace("%s", record.key);
        asyncFetch('DELETE', url, {},
            (res) => {
                if (res.code === 0) {
                    message.success('delete success.');
                    this.getMarkers();
                } else {
                    message.error(res.message);
                }
            }, {}, 'cors');
    }

    onView = (record) => {
        console.log("onView");
        console.log(record);
        this.setState({
            modalViewVisible: true,
            modalViewTitle: record.title,
            modalViewRecord: record
        });
    };

    onEdit = (record) => {};

    handleModalViewOnOk() {
        console.log("handleModalViewOnOk");
        this.setState({modalViewVisible: false});
    }

    handleModalViewOnCancel() {
        console.log("handleModalViewOnCancel");
        this.setState({modalViewVisible: false});
    }

    render() {

        const columns = _.clone(Columns);
        columns.push({
            title: 'Operate',
            key: 'action',
            width: '10%',
            render: (text, record) => (
                <span>
                    <a onClick={() => this.onView(record)}>View</a>
                    <Divider type="vertical" />
                    <a onClick={() => this.onEdit(record)}>Edit</a>
                    <Divider type="vertical" />

                    <Popconfirm
                        title="sure to delete?"
                        onConfirm={() => this.deleteMarker(record)}
                        okText="Yes"
                        cancelText="No">
                        <a>Delete</a>
                    </Popconfirm>
                </span>
            ),
        });

        return(
            <div>
                <Table
                    dataSource={this.state.dataSource}
                    columns={columns}
                />
                <ModalView
                    visible={this.state.modalViewVisible}
                    title={this.state.modalViewTitle}
                    record={this.state.modalViewRecord}
                    handleOnOk={() => this.handleModalViewOnOk()}
                    handleOnCancel={() => this.handleModalViewOnCancel()}
                />
            </div>

        );
    }

}

export default PageList;