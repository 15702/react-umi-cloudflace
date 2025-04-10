import React, { useEffect, useState, useRef } from 'react';
import { Button, Table, DatePicker, Input } from "antd";
import {
  SearchOutlined,DownloadOutlined
} from '@ant-design/icons';
import styles from './index.less';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js'
import { intl, formatTime, subAddr, formatCryptoBalance } from "@/utils";
import { apidataOpenBlindBoxRecord, apidownloadOpenBlindBoxRecord } from '@/api/statistics'
import Access from "@/components/Access"

export default () => {
    const [ loading, setLoading ] = useState(false);
    const [ dataSource, setDataSource ] = useState([]);
    const [ address, setAddress ] = useState<string>();
    const [ loadingDownload, setLoadingDownload ] = useState(false);
    const [ pagination, setPagination ] = useState({
        skip: 0,
        current: 1,
        pageSize: 10,
        total: 0
    });
    const sort = useRef({
        // yu: -1,
        // size: -1
    })
    const getDate = () =>{
        const today = dayjs();
        const formattedDate = today.format('YYYY-MM-DD'); 
        return formattedDate
    }

    const [startTime, setStartTime] = useState<string>(getDate())
    const [endTime, setEndTime] = useState<string>(getDate())
    const dateFormat = 'YYYY-MM-DD';
    
    const getList = () =>{
        setLoading(true)
        apidataOpenBlindBoxRecord(address, '11155111', startTime, endTime, pagination.skip, pagination.pageSize, sort.current).then(res=>{
            console.log(res)
            if(res?.data?.data){
                const list = res.data.data.map((item: any,index: number)=>{
                    return{
                        ...item,
                        index: index + 1
                    }
                })
                console.log(list)
                setDataSource(list)
                setPagination({
                    skip: pagination.skip,
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: res.data.total
                })
            }
            setLoading(false)
        })
    }

    useEffect(()=>{
        getList()
    },[pagination.skip, startTime, endTime, sort.current])

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
            title: intl('draw_2'),
            dataIndex: 'timeCreate',
            align: 'center',
            width: 200,
            sorter: true,
            render:(item: Date)=>(
                <div>{formatTime(item)}</div>
            )
        },
        {
            title: intl('draw_3'),
            dataIndex: 'address',
            align: 'center',
            render:(item: string)=>(
                <div>{subAddr(item)}</div>
            )
        },
        {
            title: intl('draw_4'),
            dataIndex: 'size',
            align: 'center',
            width: 250,
            sorter: true,
        },
        {
            title: intl('draw_5'),
            dataIndex: 'captainPoints',
            align: 'center',
            sorter: true,
            render:(item: string)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
        {
            title: intl('draw_6'),
            dataIndex: 'teamPoints',
            align: 'center',
            sorter: true,
            render:(item: string)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
    ];

    const onStartChange = (data: Date, dateString: string) =>{
        console.log(data)
        setStartTime(dateString)
    }

    const onEndChange = (data: Date, dateString: string) =>{
        console.log(data)
        setEndTime(dateString)
    }

    const tableChange = (item: any, filters: any, sorter: any)=>{
        console.log(item)
        console.log(sorter)
        if(sorter.field === 'timeCreate'){
            if(sorter.order){
                sort.current = sorter.order === 'ascend' ? {timeCreate: 1} : {timeCreate: -1};
            }else{
                sort.current = {}
            }
        }else if(sorter.field === 'size'){
            if(sorter.order){
                sort.current = sorter.order === 'ascend' ? {size: 1} : {size: -1};
            }else{
                sort.current = {}
            }
        }else if(sorter.field === 'captainPoints'){
            if(sorter.order){
                sort.current = sorter.order === 'ascend' ? {captainPoints: 1} : {captainPoints: -1};
            }else{
                sort.current = {}
            }
        }else if(sorter.field === 'teamPoints'){
            if(sorter.order){
                sort.current = sorter.order === 'ascend' ? {teamPoints: 1} : {teamPoints: -1};
            }else{
                sort.current = {}
            }
        }else{
            sort.current = {}
        }

        setPagination({
          skip: (item.current - 1) * 10,
          current: item.current,
          pageSize: item.pageSize,
          total: item.total
        })
    }

    const onAddChange = (e: any) =>{
        setAddress(e.target.value)
    }

    const download = () =>{
        setLoadingDownload(true)
        apidownloadOpenBlindBoxRecord(startTime, endTime).then(res=>{
            console.log(res)
            setLoadingDownload(false)
        })
    }

    return(
        <div>
            <div className={styles.search_top}>
                <Input placeholder='请输入地址' className={styles.input} value={address} allowClear onChange={onAddChange} />
                <div className={styles.search_text}>{intl('public_16')}</div>
                {/* @ts-ignore */}
                <DatePicker defaultValue={dayjs(getDate(), dateFormat)} className={styles.DatePicker} onChange={onStartChange} />
                <div className={styles.search_text}>{intl('public_17')}</div>
                {/* @ts-ignore */}
                <DatePicker defaultValue={dayjs(getDate(), dateFormat)} className={styles.DatePicker} onChange={onEndChange} />
                <Access code='/dataStatistics/dataOpenBlindBoxRecord:ge' view={<Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={getList}>{intl('news_2')}</Button>} />
                <Access code='/dataStatistics/downloadOpenBlindBoxRecord:ge' view={<Button type="primary" icon={<DownloadOutlined />} loading={loadingDownload} onClick={download}>{intl('public_14')}</Button>} />
            </div>
            <div>
            <div className={styles.table}>
                {/* @ts-ignore */}
                <Table dataSource={dataSource} rowKey="index" onChange={tableChange} loading={loading} columns={columns} scroll={{ x: 'auto', y: 550 }} pagination={pagination} />
            </div>
            </div>
        </div>
    )
}