import React, { useEffect, useState, useRef } from 'react';
import { Button, Table, DatePicker, Input } from "antd";
import {
  SearchOutlined,DownloadOutlined
} from '@ant-design/icons';
import styles from './index.less';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js'
import { intl, formatTime, subAddr, formatCryptoBalance } from "@/utils";
import { apidataCaptain, apidownloadCaptain } from '@/api/statistics'
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
        apidataCaptain(address, '11155111', startTime, endTime, pagination.skip, pagination.pageSize, sort.current).then(res=>{
            console.log(res)
            if(res?.data?.data){
                const list = res.data.data.map((item: any, index: number)=>{
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
            title: intl('team_2'),
            dataIndex: 'address',
            align: 'center',
            render:(item: string)=>(
                <div>{subAddr(item)}</div>
            )
          },
        {
            title: intl('team_3'),
            dataIndex: 'yu',
            align: 'center',
            sorter: true,
            render:(item: string)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
        {
            title: intl('team_4'),
            dataIndex: 'size',
            align: 'center',
            sorter: true,
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
        if(sorter.field === 'yu'){
            if(sorter.order){
                sort.current = sorter.order === 'ascend' ? {yu: 1} : {yu: -1};
            }else{
                sort.current = {}
            }
        }else if(sorter.field === 'size'){
            if(sorter.order){
                sort.current = sorter.order === 'ascend' ? {size: 1} : {size: -1};
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
        apidownloadCaptain(startTime, endTime).then(res=>{
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
                <Access code='/dataStatistics/dataCaptain:get' view={<Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={getList}>{intl('news_2')}</Button>} />
                <Access code='/dataStatistics/downloadCaptain:get' view={<Button type="primary" icon={<DownloadOutlined />} loading={loadingDownload} onClick={download}>{intl('public_14')}</Button>} />
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