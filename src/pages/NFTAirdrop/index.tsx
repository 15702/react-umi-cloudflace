import React, { useEffect, useState, useRef } from 'react';
import { Input, Button, Table, Image, Space, Modal, message, Form, Tooltip, Upload } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import styles from './index.less';
import BigNumber from 'bignumber.js'
import { intl, formatCryptoBalance } from "@/utils";
import { apiAirdropUploadAirdropList, apiAirdropDel, apiAirdropUpdate, apiAirdropList } from '@/api/nft'

export default function NFTAirdrop () {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ open, setOpen ] = useState<boolean>(false);
    const [ confirmLoading, setConfirmLoading ] = useState<boolean>(false);
    const [ editLoading, setEditLoading ] = useState<boolean>(false);
    const [ pagination, setPagination ] = useState({
          skip: 0,
          current: 1,
          pageSize: 10,
          total: 0
      });
      const formItem = useRef({
          _id: '',
          nftNumber: 1,
          nftLevel: 1,
          stage: '',
      })
    const [ dataSource, setDataSource ] = useState([]);

    const [ modal, modalContext] = Modal.useModal();
    const [ messageApi, contextHolder ] = message.useMessage();
    
    const [ form ] = Form.useForm();
    const { TextArea } = Input;

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
          title: intl('nft_1'),
          dataIndex: 'address',
          width: 300,
          align: 'center',
        },
        {
          title: intl('nft_3'),
          dataIndex: 'nftNumber',
          width: 100,
          align: 'center',
        },
        {
          title: intl('nft_4'),
          dataIndex: 'nftLevel',
          width: 100,
          align: 'center',
        },
        {
          title: intl('nft_5'),
          dataIndex: 'stage',
          width: 200,
          align: 'center',
        },
        {
          title: intl('public_1'),
          key: 'action',
          width: 300,
          align: 'center',
          render: (_ :any, item: any) => (
            <Space size={10}>
              <Button type="primary" onClick={()=>editClick(item)} >{intl('public_2')}</Button>
              <Button type="primary" danger onClick={()=>delClick(item)}>{intl('public_3')}</Button>
            </Space>
          ),
        }
    ];

    useEffect(()=>{
        getList()
    }, [])

    const getList = () =>{
        setLoading(true)
        apiAirdropList(pagination.skip, pagination.pageSize).then(res=>{
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

    const editClick = (item: any)=>{
        console.log(item)
        setOpen(true)
        formItem.current = {
            _id: item._id,
            nftNumber: item.nftNumber,
            nftLevel: item.nftLevel,
            stage: item.stage,
        }
        form.setFieldsValue(formItem.current)
    }

    const delClick = (item: any)=>{
        modal.confirm({
            title: intl('public_4'),
            icon: <ExclamationCircleFilled />,
            content: `${intl('public_19')} "${item.address}" ?`,
            okType: 'danger',
            onOk() {
                console.log('OK',item);
                apiAirdropDel(item._id).then((res: any)=>{
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
    
    const tableChange = (item: any)=>{
        console.log(item)
        setPagination({
            skip: (item.current - 1) * 10,
            current: item.current,
            pageSize: item.pageSize,
            total: item.total
        })
    }

    const customRequest = async (file: any) =>{
        console.log(file)
        if(file.file){
            const formData = new FormData();
            formData.append('file', file.file)
            const res: any = await apiAirdropUploadAirdropList(formData);
            console.log(res)
            if(res?.code === 0){
                getList()
                message.success(intl('public_13'))
            }
        }
        // return false
    }

    const onOk = () =>{
        form.submit()
    }

    const onFinish = (values: any) =>{
        console.log(values)
        setEditLoading(true)
        apiAirdropUpdate(formItem.current._id, values.stage ,values.nftNumber, values.nftLevel).then((res: any)=>{
            console.log(res)
            setEditLoading(false)
            if(res?.code == 0){
                setConfirmLoading(false)
                setOpen(false)
                getList()
                message.success(intl('public_13'))
            }
        })
    }

    return(
        <div>
            {contextHolder}
            {modalContext}
            <div className={styles.search_top}>
                <Upload 
                    showUploadList={false}
                    // beforeUpload={beforeUpload}
                    customRequest={customRequest}
                    accept='.csv'>
                    <Button className={styles.news_add} icon={<PlusOutlined />}>
                        {intl('news_3')}
                    </Button>
                </Upload>
            </div>
            <div className={styles.table}>
                {/* @ts-ignore */}
                <Table dataSource={dataSource} rowKey="_id" onChange={tableChange} loading={loading} columns={columns} scroll={{ x: 'auto', y: 550 }} pagination={pagination} />
            </div>
            <Modal
                title={intl('public_2')}
                width= '500px'
                open={open}
                confirmLoading={editLoading}
                onOk={onOk}
                onCancel={()=>setOpen(false)}
            >
                <Form
                    className={styles.form}
                    form={form}
                    name="nft"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label={intl('nft_4')}
                        name="nftLevel"
                        labelAlign='right'
                        labelCol={{span: 5, offset: 0}}
                        rules={[{required: true}]}
                        >
                        <Input placeholder={intl('nft_7')}/>
                    </Form.Item>
                    <Form.Item
                        label={intl('nft_5')}
                        name="stage"
                        labelAlign='right'
                        labelCol={{span: 5, offset: 0}}
                        rules={[{required: true, message: intl('public_20')}]}
                        >
                        <Input placeholder={intl('public_20')}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}