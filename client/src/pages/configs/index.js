import React, { useState, useEffect} from 'react';
import { Form, Input, Button, Select, Modal, Table, message , Popconfirm} from 'antd';
import axios from '../../axios';
import { apis } from '../../api';

const { Option } = Select;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
const reload = ()=>{
 setTimeout(()=>{
    window.location.reload()
 },800)
}
export const Configs = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dataSource, setdataSource] = useState([])
    const [editData, seteditData] = useState(false) 
    const onFinish = values => {
        axios.post(editData ? apis.update :apis.create,values).then(
            res=>{
                setIsModalVisible(false)
                reload()
            }
        ).catch(e=>console.error(e))
    };

    const onReset = () => {
        form.resetFields();
    };
    const updateRecord = (data)=>{
        setIsModalVisible(true)
        seteditData(true)
        form.setFieldsValue(data)
    }
    const deleteRecord = (data)=>{
       axios.post(apis.delete,data).then(
        res=>{
            // message.success(res)
            reload()
        }
        ).catch(e=>console.error(e))
    }
    const initData = ()=>{
        axios.get(apis.getAll).then(
            res=>{
                setdataSource(res.data)
            }
        ).catch(e=>console.error(e))
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const columns = [
        {
            title: 'depart',
            dataIndex: 'depart',
            key: 'depart',
          },
          {
            title: 'env',
            dataIndex: 'env',
            key: 'env',
          },
          {
            title: 'group',
            dataIndex: 'group',
            key: 'group',
          },
          {
            title: 'key',
            dataIndex: 'key',
            key: 'key',
          },  {
            title: 'value',
            dataIndex: 'value',
            key: 'value',
          },{
            title: 'actions',
            render(data){
                return <div>
                    <Button type="primary"  onClick={()=>updateRecord(data)} style={{marginRight:'10px'}}>编辑</Button>
                    <Popconfirm
    title="确定删除？"
    onConfirm={()=>deleteRecord(data)}
    okText="Yes"
    cancelText="No"
  >
    <Button type="primary" danger >删除</Button>
  </Popconfirm>
                </div>
            }
        }
    ]
    useEffect(()=>{
        initData()
    },[])
    return (
        <div style={{padding:'20px'}}>
            <Modal
                title="新增配置"
                visible={isModalVisible}
                footer={null}
                onCancel={handleCancel}
                
            >
                <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
                    <Form.Item name="depart" label="部门" rules={[{ required: true }]}>
                        <Select
                            placeholder="选择部门"
                            allowClear
                            disabled={editData}
                        >
                            <Option value="plat">plat</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="group" label="组" rules={[{ required: true }]}>
                        <Select
                            placeholder="选择组"
                            allowClear
                            disabled={editData}
                        >
                            <Option value="fe">fe</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="env" label="环境" rules={[{ required: true }]}>
                        <Select
                            placeholder="选择配置环境"
                            allowClear
                            disabled={editData}
                        >
                            <Option value="development">development</Option>
                            <Option value="test">test</Option>
                            <Option value="production">production</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="key" label="键" rules={[{ required: true }]}>
                        <Input type="text" disabled={editData} />
                    </Form.Item>
                    <Form.Item name="value" label="值" rules={[{ required: true }]}>
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            提交
                </Button>
                        <Button htmlType="button" onClick={onReset}>
                            取消
                </Button>
                    </Form.Item>
                </Form>
            </Modal>
        <Button type="primary" style={{marginBottom:'10px'}} onClick={()=>{setIsModalVisible(true);seteditData(false);form.resetFields();}}>新增</Button>
        <Table dataSource={dataSource} columns={columns} />
        </div>
    )
}