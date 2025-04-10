import React, { useEffect, useState, useRef } from 'react';
import { Button, Table, DatePicker, Input } from "antd";
import {
  SearchOutlined,DownloadOutlined
} from '@ant-design/icons';
import styles from './index.less';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js'
import { intl, formatTime, formatCryptoBalance } from "@/utils";
import { apiDataPage, apiDatadownload } from '@/api/overview'
import Access from "@/components/Access"

export default () => {
    const [ loading, setLoading ] = useState(false);
    const [ dataSource, setDataSource ] = useState([]);
    const [ loadingDownload, setLoadingDownload ] = useState(false);
    const [ pagination, setPagination ] = useState({
        skip: 0,
        current: 1,
        pageSize: 10,
        total: 0
    });
    const sort = useRef({
        time: -1,
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
        apiDataPage(startTime, endTime, pagination.skip, pagination.pageSize, sort.current).then(res=>{
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
        })
        setLoading(false)
    }

    useEffect(()=>{
        getList()
    },[pagination.skip, startTime, endTime, sort.current])

    const columns = [
        {
            key: '_id',
            dataIndex: 'index',
            align: 'center',
            render: (_: any, item: any, index: number)=>(
                <div className={styles.tableText}>{(pagination.current - 1) * 10 + index + 1}</div>
            )
        },
        {
            title: intl('overview_1'),
            dataIndex: 'bridgeBtc',
            width: '150px',
            align: 'center',
            render:(item: string)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
          },
        {
            title: intl('overview_2'),
            dataIndex: 'mintYu',
            align: 'center',
            render:(item: string)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
        {
            title: intl('overview_3'),
            dataIndex: 'userCount',
            align: 'center',
            render:(item: string)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
        {
            title: intl('overview_4'),
            dataIndex: 'vaultBtc',
            align: 'center',
            render:(item: string)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
        {
            title: intl('overview_5'),
            dataIndex: 'time',
            align: 'center',
            sorter: true,
            render:(item: Date)=>(
                <div>{formatTime(item)}</div>
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
        if(sorter.field === 'time'){
            if(sorter.order){
                sort.current = sorter.order === 'ascend' ? {time: 1} : {time: -1};
            }else{
                sort.current = { time: -1 }
            }
        }else{
            sort.current = { time: -1 }
        }

        setPagination({
          skip: (item.current - 1) * 10,
          current: item.current,
          pageSize: item.pageSize,
          total: item.total
        })
    }

    const download = () =>{
        setLoadingDownload(true)
        apiDatadownload(startTime, endTime, sort.current).then(res=>{
            console.log(res)
            setLoadingDownload(false)
        })
    }

    return(
        <div>
            <div className={styles.search_top}>
                <div className={styles.search_text}>{intl('public_16')}</div>
                {/* @ts-ignore */}
                <DatePicker defaultValue={dayjs(getDate(), dateFormat)} className={styles.DatePicker} onChange={onStartChange} />
                <div className={styles.search_text}>{intl('public_17')}</div>
                {/* @ts-ignore */}
                <DatePicker defaultValue={dayjs(getDate(), dateFormat)} className={styles.DatePicker} onChange={onEndChange} />
                <Access code='/dashboardInfo/page:get' view={<Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={getList}>{intl('news_2')}</Button>} ></Access>
                <Access code='/dashboardInfo/download:get' view={<Button type="primary" icon={<DownloadOutlined />} loading={loadingDownload} onClick={download}>{intl('public_14')}</Button>} />
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