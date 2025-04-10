import React, { useEffect, useState, Fragment } from 'react';
import styles from './index.less';
import { apiWithdrawList } from '@/api/selfCustody'
import { SearchOutlined } from '@ant-design/icons';
import { Input, Button, Table, message, Select, DatePicker, Space, Tooltip } from "antd";
import { intl, formatTime, subAddr, formatCryptoBalance, amountToWei, amountFromWei } from "@/utils";
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs';
import Access from "@/components/Access"
import { getEthWalletAddress } from '@/eth/eth';
import { requestRefund, confirmRefund } from '@/eth/eth_proxy_action'
import { useModel } from 'umi';

export default function Withdraw () {
    const { walletAddress, setWalletAddress } = useModel('global');
    const [loading, setLoading] = useState<boolean>(false)
    const [dataSource, setDataSource] = useState<[]>([]);
    const [startTime, setStartTime] = useState<number>(0)
    const [endTime, setEndTime] = useState<number>(0)
    const [searchAddress, setSearchAddress] = useState<string>()
    const [selectStatus, setSelectStatus] = useState<string>()
    const [statusList, setStatusList] = useState([
        {
            lable: 'todo',
            value: 'todo'
        },
        {
            lable: 'doing',
            value: 'doing'
        },
        {
            lable: 'withdrawable',
            value: 'withdrawable'
        },
        {
            lable: 'canceled',
            value: 'canceled'
        }
    ])

    const { RangePicker } = DatePicker;

    const columns = [
        {
            key: 'id',
            dataIndex: 'index',
            align: 'center',
            // render: (_: any, item: any, index: number)=>(
            //     <div className={styles.tableText}>{index + 1}</div>
            // )
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
            title: intl('selfCustody_33'),
            dataIndex: 'value',
            width: '150px',
            align: 'center',
            render:(item: any)=>(
                <div>{formatCryptoBalance(amountFromWei(BigNumber(item), 8))}</div>
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
            dataIndex: 'receiver',
            align: 'center',
            render:(item: string)=>(
                <Tooltip placement="topLeft" title={item}>
                    <div>{subAddr(item)}</div>
                </Tooltip>
            )
        },
        {
            title: intl('selfCustody_32'),
            dataIndex: 'nonce',
            align: 'center',
            width: '100px'
        },
        {
            title: intl('public_9'),
            dataIndex: 'status',
            align: 'center',
            width: '100px'
        },
        {
            title: intl('selfCustody_11'),
            dataIndex: 'locktime',
            align: 'center',
            render:(item: any)=>(
                <div>{formatTime(item * 1000)}</div>
            )
        },
        {
            title: intl('selfCustody_31'),
            dataIndex: 'cooldownEndAt',
            align: 'center',
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
            title: intl('public_22'),
            dataIndex: 'createdAt',
            align: 'center',
            render:(item: any)=>(
                <div>{formatTime(item)}</div>
            )
        },
        {
            title: intl('public_1'),
            key: 'action',
            width: 200,
            align: 'center',
            render: (item: any) => (
                <Space size={10}>
                    {
                        !walletAddress && (item.status == 'todo' || item.status == 'doing') && <Button type="primary" loading={item.walletLoading} onClick={()=>connectWallet(item)}>{intl('selfCustody_34')}</Button>
                    }
                    {
                        walletAddress === item.address && item.status == 'todo' && <Access code='/custody/bridge/v2/withdraw/requestRefund' view={<Button type="primary" loading={item.walletLoading} onClick={()=>clickRequestRefund(item)}>{intl('selfCustody_35')}</Button>} />
                    }
                    {
                        walletAddress === item.address && item.status == 'doing' && judgeTime(item) && <Access code='/custody/bridge/v2/withdraw/confirmRefund' view={<Button type="primary" loading={item.walletLoading} onClick={()=>clickConfirmRefund(item)}>{intl('selfCustody_36')}</Button>} />
                    }
                </Space>
            ),
        },
    ];

    const judgeTime = (item: any) => {
        const timetamp = new Date().getTime()
        if(timetamp / 1000 > item.cooldownEndAt || timetamp / 1000 > item.locktime){
            return true
        }
        return false
    }

    const connectWallet = async (item: any) => {
        const address = await getEthWalletAddress()
        console.log(address)
        setWalletAddress(address)
    }

    const clickRequestRefund = async (item: any) =>{
        const list: any = dataSource.map((el: any, index: number)=>({...el, index: index + 1, walletLoading: el.id === item.id ? true : false}))
        setDataSource(list)
        const res = await requestRefund(window.YalaEthProvider, item.depositTxid, item.receiver, BigNumber(item.value), walletAddress)
        if(res){
            getList()
        }else{
            const list: any = dataSource.map((el: any, index: number)=>({...el, index: index + 1, walletLoading: false}))
            setDataSource(list)
        }
    }

    const clickConfirmRefund = async (item: any) =>{
        const list: any = dataSource.map((el: any, index: number)=>({...el, index: index + 1, walletLoading: el.id === item.id ? true : false}))
        setDataSource(list)
        const res = await confirmRefund(window.YalaEthProvider, item.nonce)
        if(res){
            getList()
        }else{
            const list: any = dataSource.map((el: any, index: number)=>({...el, index: index + 1, walletLoading: false}))
            setDataSource(list)
        }
    }

    const getList = async () =>{
        setLoading(true)
        const res: any = await apiWithdrawList(1, 100, 'DESC', startTime, endTime, searchAddress, selectStatus)
        if(res?.code === 0 && res.data.items){
            setDataSource(res.data.items.map((item: any, index: number)=>({...item, index: index + 1, walletLoading: false})))
        }else{
            setDataSource([])
        }
        setLoading(false)
    }

    useEffect(()=>{
        getList()
    }, [])

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

    return(
        <div className={styles.div_all}>
            <div className={styles.search_top}>
                <Input className={styles.input} placeholder={intl('selfCustody_37')} allowClear onChange={(e: any)=>setSearchAddress(e.target.value)} />
                <Select className={styles.select} placeholder={intl('public_33')} allowClear options={statusList} onChange={(e: any)=>setSelectStatus(e)} />
                <RangePicker className={styles.DatePicker} onChange={onStartChange} />
                <Access code='/custody/bridge/v2/withdraw/request/list:get' view={<Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={getList}>{intl('public_31')}</Button>} ></Access>
            </div>
            <div className={styles.table}>
                {/* @ts-ignore */}
                <Table dataSource={dataSource} rowKey="id" loading={loading} columns={columns} scroll={{ x: 'auto', y: 580 }} />
            </div>
        </div>
    )
}