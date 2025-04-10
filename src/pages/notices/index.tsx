import React, { useEffect, useState, useRef } from 'react';
import { Input, Button, Table, Image, Space, Modal, message, Form, Tooltip, Select } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import styles from './index.less';
import { intl, formatTime, subAddr, formatCryptoBalance } from "@/utils";
import { noticesPage, noticesUpdate, noticesAdd, noticesDel } from '@/api/website'
import Access from "@/components/Access"
import { PlatformType } from "@/eth/deploy"

export default function Website () {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ open, setOpen ] = useState<boolean>(false);
    const [ openObtain, setOpenObtain ] = useState<boolean>(false);
    const [ addLoading, setAddLoading ] = useState<boolean>(false);
    const [ pagination, setPagination ] = useState({
        skip: 0,
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [ dataSource, setDataSource ] = useState([]);
    const formItem = useRef({
        id: '',
        des: '',
        url: '',
        show: true,
        platform: ''
    })
    const [typeList, setTypeList] = useState([
        {label: 'DAPP', value: PlatformType.DAPP},
        {label: '官网', value: PlatformType.OFFICIAL_WEB}
    ])

    const [ modal, modalContext] = Modal.useModal();
    const [ messageApi, contextHolder ] = message.useMessage();
    const [ form ] = Form.useForm();
    const { TextArea } = Input;

    const getList = () =>{
        setLoading(true)
        noticesPage(pagination.skip, pagination.pageSize, undefined).then(res=>{
          console.log(res)
          setLoading(false)
          if(res?.data?.data){
            setDataSource(res.data.data)
            setPagination({
              skip: pagination.skip,
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: res.data.total
            })
          }
        })
      }
    
    useEffect(()=>{
        getList()
    },[pagination.skip])

    const tableChange = (item: any)=>{
        console.log(item)
        setPagination({
          skip: (item.current - 1) * 10,
          current: item.current,
          pageSize: item.pageSize,
          total: item.total
        })
    }

    const columns = [
        {
          key: '_id',
          width: 100,
          align: 'center',
          render: (_: any, item: any, index: number)=>(
              <div className={styles.tableText}>{(pagination.current - 1) * 10 + index + 1}</div>
          )
        },
        {
          title: intl('config_1'),
          dataIndex: 'createBy',
          width: 200,
          align: 'center',
        },
        {
          title: intl('config_2'),
          dataIndex: 'des',
          width: 300,
          align: 'center',
          render: (item: any)=>(
            <Tooltip placement="topLeft" title={item}>
              <div className={styles.tableText}>{item}</div>
            </Tooltip>
          )
        },
        {
          title: intl('config_3'),
          dataIndex: 'url',
          width: 200,
          align: 'center',
          render: (item: any)=>(
            <a href={item} target={'_blank'}>{item}</a>
          )
        },
        {
          title: intl('config_12'),
          dataIndex: 'platform',
          width: 150,
          align: 'center',
          render: (item: any)=>(
            <div>{getPlatform(item)}</div>
          )
        },
        {
            title: intl('config_4'),
            dataIndex: 'show',
            width: 150,
            align: 'center',
            render: (item: any)=>(
                <div>{item ? intl('news_18') : intl('news_19')}</div>
            )
        },
        {
            title: intl('news_17'),
            dataIndex: 'timeCreate',
            align: 'center',
            width: 150,
            render:(item: any)=>(
                <div>{formatTime(item)}</div>
            )
        },
        {
            title: intl('public_15'),
            dataIndex: 'timeUpdate',
            align: 'center',
            width: 150,
            render:(item: any)=>(
                <div>{formatTime(item)}</div>
            )
        },
        {
          title: intl('public_1'),
          key: 'action',
          width: 300,
          align: 'center',
          render: (_: any, item: any) => (
            <Space size={10}>
              <Access code='/notices/update:post' view={<Button type="primary" onClick={()=>edit(item)} >{intl('public_2')}</Button>} />
              <Access code='/notices/update:post' view={<Button type="primary" danger={item.show} onClick={()=>editShow(item)}>{ !item.show ? intl('news_18') : intl('news_19')}</Button>} />
              <Access code='/notices/del:post' view={<Button type="primary" danger onClick={()=>del(item)}>{intl('public_3')}</Button>} />
            </Space>
          ),
        }
    ];

    const getPlatform = (type: string) =>{
        return typeList.find((item: any)=>item.value == type)?.label
    }

    const Addnotices = () =>{
        setOpenObtain(true)
        form.resetFields();
    }

    const confirmObtain = ()=>{
        form.submit()
    }

    const onObtain = (values: any)=>{
        console.log(values)
        setAddLoading(true)
        if(formItem.current.id){
            noticesUpdate(formItem.current.id, values.des, values.url ? values.url : undefined, formItem.current.show, values.platform).then((res: any)=>{
                console.log(res)
                setAddLoading(false)
                if(res?.code == 0){
                    message.success(intl('public_13'))
                    getList()
                    setOpenObtain(false)
                }
            })
        }else{
            noticesAdd(values.des, values.url ? values.url : undefined, values.platform).then((res: any)=>{
                console.log(res)
                setAddLoading(false)
                if(res?.code == 0){
                    message.success(intl('public_13'))
                    getList()
                    setOpenObtain(false)
                }
            })
        }
       
    }

    const edit = (item: any) =>{
        formItem.current = {
            id: item._id,
            des: item.des,
            url: item.url,
            show: item.show,
            platform: item.platform
        }
        setOpenObtain(true)
        form.setFieldsValue(formItem.current)
    }
    const editShow = (item: any) =>{
        console.log(item)
        modal.confirm({
            title: intl('public_4'),
            icon: <ExclamationCircleFilled />,
            content: `${intl(item.show ? 'config_8' : 'config_9')}`,
            okType: item.show ? 'danger' : 'primary',
            onOk() {
              noticesUpdate(item._id,item.des,item.url,!item.show, item.platform).then((res: any)=>{
                if(res?.code == 0){
                    message.success(intl('public_13'))
                    getList()
                }
              })
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }
    const del = (item: any) =>{
        modal.confirm({
            title: intl('public_4'),
            icon: <ExclamationCircleFilled />,
            content: `${intl('config_11')}`,
            okType: 'danger',
            onOk() {
              noticesDel(item._id).then((res: any)=>{
                if(res?.code == 0){
                    message.success(intl('public_13'))
                    getList()
                }
              })
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }

    return(
        <div>
            {contextHolder}
            {modalContext}
            <div className={styles.search_top}>
              <Access code="/notices/add:post" view={<Button className={styles.news_add} icon={<PlusOutlined />} onClick={Addnotices}>{intl('news_3')}</Button>} />
            </div>
            <div className={styles.table}>
                {/* @ts-ignore */}
                <Table dataSource={dataSource} rowKey="_id" onChange={tableChange} loading={loading} columns={columns} scroll={{ x: 'auto', y: 550 }} pagination={pagination} />
            </div>
            <Modal
                title={intl(formItem.current.id ? 'config_10' : 'config_7')}
                width= '500px'
                open={openObtain}
                confirmLoading={addLoading}
                onOk={confirmObtain}
                onCancel={()=>setOpenObtain(false)}
            >
                <Form
                    className={styles.form}
                    form={form}
                    name="obtain"
                    onFinish={onObtain}
                    autoComplete="off"
                >
                    <Form.Item
                        label={intl('config_2')}
                        name="des"
                        rules={[{required: true,message: intl('config_5'),}]}
                        >
                        <TextArea
                            placeholder={intl('config_5')}
                            autoSize={{
                                minRows: 2,
                                maxRows: 6,
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={intl('config_12')}
                        name="platform"
                        rules={[{required: true, message: intl('config_13')}]}
                        >
                        <Select placeholder={intl('config_13')} options={typeList} />
                    </Form.Item>
                    <Form.Item
                        label={intl('config_3')}
                        name="url"
                        >
                        <TextArea
                            placeholder={intl('config_6')}
                            autoSize={{
                                minRows: 2,
                                maxRows: 6,
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}