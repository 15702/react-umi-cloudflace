import React, { useEffect, useState, Fragment } from 'react';
import styles from './index.less';
import Access from "@/components/Access"
import { PlusOutlined, SearchOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Input, Button, Table, Modal, message, Form, Select, DatePicker, Space, Tooltip, InputNumber } from "antd";
import { intl, formatTime, subAddr, formatCryptoBalance, amountToWei, amountFromWei } from "@/utils";
import { apiDepositAdd, apiDepositConfirm, apiDepositList, apiDepositUpdate, apiWithdrawAdd } from '@/api/selfCustody'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs';

export default function Withdraw () {
    const [loading, setLoading] = useState<boolean>(false)
    const [dataSource, setDataSource] = useState<[]>([]);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<number>(0)
    const [endTime, setEndTime] = useState<number>(0)
    const [editLoading, setEditLoading] = useState<boolean>(false)
    const [id, setId] = useState<string>()
    const { TextArea } = Input;
    const [ form ] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [modal, modalContext] = Modal.useModal();
    const [typeList, setTypeList] = useState([
        {
            lable: 'cobo',
            value: 'cobo'
        }
    ])
    const { RangePicker } = DatePicker;
    const columns = [
        {
            key: 'id',
            dataIndex: 'index',
            align: 'center',
        },
        {
            title: 'id',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: intl('selfCustody_54'),
            dataIndex: 'name',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 100 },
            }),
            onCell: () => ({
                style: { minWidth: 100 },
            }),
        },
        {
            title: intl('selfCustody_5'),
            dataIndex: 'address',
            align: 'center',
            render:(item: string)=>(
                <Tooltip placement="topLeft" title={item}>
                    <div>{subAddr(item)}</div>
                </Tooltip>
            )
        },
        {
            title: intl('selfCustody_6'),
            dataIndex: 'depositAmount',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 100 },
            }),
            onCell: () => ({
                style: { minWidth: 100 },
            }),
            render:(item: any)=>(
                <div>{formatCryptoBalance(amountFromWei(BigNumber(item), 8))}</div>
            )
        },
        {
            title: intl('selfCustody_7'),
            dataIndex: 'depositScriptAddress',
            align: 'center',
            render:(item: string)=>(
                <Tooltip placement="topLeft" title={item}>
                    <div>{subAddr(item)}</div>
                </Tooltip>
            )
        },
        {
            title: intl('selfCustody_8'),
            dataIndex: 'depositTxid',
            align: 'center',
            render:(item: string)=>(
                <Tooltip placement="topLeft" title={item}>
                    <div>{subAddr(item)}</div>
                </Tooltip>
            )
        },
        {
            title: intl('selfCustody_13'),
            dataIndex: 'toAddress',
            align: 'center',
            render:(item: string)=>(
                <Tooltip placement="topLeft" title={item}>
                    <div>{subAddr(item)}</div>
                </Tooltip>
            )
        },
        {
            title: intl('selfCustody_14'),
            dataIndex: 'toTxid',
            align: 'center',
            render:(item: string)=>(
                <Tooltip placement="topLeft" title={item}>
                    <div>{subAddr(item)}</div>
                </Tooltip>
            )
        },
        {
            title: intl('selfCustody_26'),
            dataIndex: 'depositStatus',
            align: 'center',
        },
        {
            title: intl('selfCustody_15'),
            dataIndex: 'toStatus',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 150 },
            }),
            onCell: () => ({
                style: { minWidth: 150 },
            }),
        },
        {
            title: intl('selfCustody_16'),
            dataIndex: 'withdrawStatus',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 150 },
            }),
            onCell: () => ({
                style: { minWidth: 150 },
            }),
        },
        {
            title: intl('selfCustody_11'),
            dataIndex: 'locktime',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 120 },
            }),
            onCell: () => ({
                style: { minWidth: 120 },
            }),
            render:(item: any)=>(
                <div>{formatTime(item * 1000)}</div>
            )
        },
        {
            title: intl('selfCustody_10'),
            dataIndex: 'type',
            align: 'center',
        },
        {
            title: intl('selfCustody_9'),
            dataIndex: 'depositMemo',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 150 },
            }),
            onCell: () => ({
                style: { minWidth: 150 },
            }),
            render:(item: string)=>(
                <Tooltip placement="topLeft" title={item}>
                    <div className={styles.tableText}>{item}</div>
                </Tooltip>
            )
        },
        {
            title: intl('public_1'),
            key: 'action',
            fixed: 'right',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 80 },
            }),
            onCell: () => ({
                style: { minWidth: 80 },
            }),
            render: (item: any) => (
                <Space size={10}>
                    {
                        item.depositStatus == 'created' && 
                        <>
                        <Access code='/custody/bridge/v2/deposit/confirm:post' view={<Button type="primary" onClick={()=>confirmDeposit(item)}>{intl('selfCustody_12')}</Button>} />
                        <Access code='/custody/bridge/v2/deposit/update:post' view={<Button type="primary" onClick={()=>editFun(item)}>{intl('public_2')}</Button>} />
                        </>
                        
                    }
                    {
                        item.toStatus == 'done' && item.withdrawStatus == 'default' && <Access code='/custody/bridge/v2/withdraw/request/add:post' view={<Button type="primary" onClick={()=>clickWithdraw(item)}>{intl('selfCustody_29')}</Button>} />
                    }
                </Space>
            ),
        },
    ];

    const getList = async () =>{
        setLoading(true)
        const res: any = await apiDepositList(1, 100, 'DESC', startTime, endTime)
        if(res?.code === 0 && res.data.items){
            setDataSource(res.data.items.map((item: any, index: number)=>({...item, index: index + 1})))
        }else{
            setDataSource([])
        }
        setLoading(false)
    }

    useEffect(()=>{
        getList()
    },[])

    const onStartChange = (data: any) =>{
        console.log(data)
        if(data){
            setStartTime(data[0].unix())
            setEndTime(data[1].unix())
        }else{
            setStartTime(0)
            setEndTime(0)
        }
    }

    const clickWithdraw = async (item: any) =>{
        modal.confirm({
            title: intl('public_4'),
            icon: <ExclamationCircleFilled />,
            content: `${intl('selfCustody_30')}`,
            onOk: async()=> {
                console.log('OK',item);
                const res: any = await apiWithdrawAdd(item.id)
                if(res?.code == 0){
                    message.success(intl('public_13'))
                    getList()
                }
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }

    const editFun = (item?: any)=> {
        setOpenEdit(true)
        if(item){
            setId(item.id)
            form.setFieldsValue({
                address: item.address,
                depositAmount: amountFromWei(BigNumber(item.depositAmount), 8).toNumber(),
                depositScriptAddress: item.depositScriptAddress,
                depositTxid: item.depositTxid,
                toAddress: item.toAddress,
                type: item.type,
                depositMemo: item.depositMemo,
                locktime: dayjs(item.locktime * 1000)
            })
        }else{
            form.resetFields()
            form.setFieldsValue({
                type: 'cobo',
            })
        }
    }

    const confirmEdit = ()=>{
        form.submit()
    }
    
    const onFinish = async (values: any)=>{
        console.log(values)
        setEditLoading(true)
        if(id){
            const res: any = await apiDepositUpdate(
                id,
                values.name,
                values.address,
                amountToWei(BigNumber(values.depositAmount), 8).toNumber(),
                values.depositMemo || "",
                values.depositScriptAddress,
                values.depositTxid,
                values.locktime ? values.locktime.unix() : 0,
                values.toAddress,
                values.type
            )
            if(res?.code === 0){
                setOpenEdit(false)
                getList()
                message.success(intl('public_13'))
            }
        }else{
            const res: any = await apiDepositAdd(
                values.name,
                values.address,
                amountToWei(BigNumber(values.depositAmount), 8).toNumber(),
                values.depositMemo || "",
                values.depositScriptAddress,
                values.depositTxid,
                values.locktime ? values.locktime.unix() : 0,
                values.toAddress,
                values.type
            )
            if(res?.code === 0){
                setOpenEdit(false)
                getList()
                message.success(intl('public_13'))
            }
        }
        setEditLoading(false)
    }

    const confirmDeposit = async (item: any) =>{
        modal.confirm({
            title: intl('public_4'),
            icon: <ExclamationCircleFilled />,
            content: `${intl('selfCustody_28')}`,
            onOk: async()=> {
                console.log('OK',item);
                const res: any = await apiDepositConfirm(item.id)
                if(res?.code == 0){
                    message.success(intl('public_13'))
                    getList()
                }
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }

    return(
        <div className={styles.div_all}>
            {modalContext}
           <div className={styles.search_top}>
                <RangePicker className={styles.DatePicker} onChange={onStartChange} />
                <Access code='/custody/bridge/v2/deposit/list:get' view={<Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={getList}>{intl('public_31')}</Button>} ></Access>
                <Access code='/custody/bridge/v2/deposit/add:post' view={<Button type="primary" icon={<PlusOutlined />} onClick={()=>editFun()}>{intl('public_23')}</Button>} ></Access>
            </div>
            <div className={styles.table}>
                {/* @ts-ignore */}
                <Table dataSource={dataSource} rowKey="id" loading={loading} columns={columns} scroll={{ x: 'auto', y: 580 }} />
            </div>
            <Modal
                title={intl(id ? 'selfCustody_27' :'selfCustody_25')}
                width= '650px'
                open={openEdit}
                confirmLoading={editLoading}
                onOk={confirmEdit}
                onCancel={()=>setOpenEdit(false)}
            >
                <Form
                    className={styles.form}
                    form={form}
                    name="admin"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label={intl('selfCustody_54')}
                        name="name"
                        rules={[{required: true, message: intl('selfCustody_55')}]}
                    >
                        <Input placeholder={intl('selfCustody_55')} />
                    </Form.Item>
                    <Form.Item
                        label={intl('selfCustody_5')}
                        name="address"
                        rules={[{required: true, message: intl('selfCustody_17')}]}
                    >
                        <Input placeholder={intl('selfCustody_17')} />
                    </Form.Item>
                    <Form.Item
                        label={intl('selfCustody_6')}
                        name="depositAmount"
                        rules={[{required: true, message: intl('selfCustody_18')}]}
                    >
                        <InputNumber className={styles.from_number} min={0} placeholder={intl('selfCustody_18')} />
                    </Form.Item>
                    <Form.Item
                        label={intl('selfCustody_7')}
                        name="depositScriptAddress"
                        rules={[{required: true, message: intl('selfCustody_19')}]}
                    >
                        <Input placeholder={intl('selfCustody_19')} />
                    </Form.Item>
                    <Form.Item
                        label={intl('selfCustody_8')}
                        name="depositTxid"
                        rules={[{required: true, message: intl('selfCustody_20')}]}
                    >
                        <Input placeholder={intl('selfCustody_20')} />
                    </Form.Item>
                    <Form.Item
                        label={intl('selfCustody_13')}
                        name="toAddress"
                        rules={[{required: true, message: intl('selfCustody_21')}]}
                    >
                        <Input placeholder={intl('selfCustody_21')} />
                    </Form.Item>
                    <Form.Item
                        label={intl('selfCustody_10')}
                        name="type"
                        rules={[{required: true, message: intl('selfCustody_22')}]}
                        >
                        <Select placeholder={intl('selfCustody_22')} options={typeList} />
                    </Form.Item>
                    <Form.Item
                        label={intl('selfCustody_9')}
                        name="depositMemo"
                        rules={[{required: true, message: intl('selfCustody_23')}]}
                    >
                        <TextArea
                            placeholder={intl('selfCustody_23')}
                            autoSize={{
                                minRows: 2,
                                maxRows: 6,
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={intl('selfCustody_11')}
                        name="locktime"
                        rules={[{required: true, message: intl('selfCustody_24')}]}
                    >
                        <DatePicker className={styles.DatePicker} showTime />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}