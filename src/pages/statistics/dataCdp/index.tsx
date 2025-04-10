import React, { useEffect, useState, useRef } from 'react';
import { Button, Table, DatePicker, Input } from "antd";
import {
  SearchOutlined,DownloadOutlined
} from '@ant-design/icons';
import styles from './index.less';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js'
import { intl, formatTime, subAddr, formatCryptoBalance } from "@/utils";
import { apiDatacdp, apidownloadCdp } from '@/api/statistics'
import Access from "@/components/Access"

interface Sort {
    cdpi?: number
    ink?: number
    art?: number
}

export default () => {
    const [ loading, setLoading ] = useState(false);
    const [ dataSource, setDataSource ] = useState([]);
    const [ vaultId, setVaultId ] = useState<string>();
    const [ address, setAddress ] = useState<string>();
    const [ loadingDownload, setLoadingDownload ] = useState(false);
    const [ pagination, setPagination ] = useState({
        skip: 0,
        current: 1,
        pageSize: 10,
        total: 0
    });
    const sort = useRef<Sort>({
        cdpi: -1,
        // ink: -1,
        // art: -1
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
        apiDatacdp(vaultId, address, startTime, endTime, pagination.skip, pagination.pageSize, sort.current).then(res=>{
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
          title: intl('statistics_13'),
          dataIndex: 'cdpi',
          width: '150px',
          align: 'center',
          sorter: true,
        },
        {
            title: intl('statistics_12'),
            dataIndex: 'addressUser',
            align: 'center',
            render:(item: string)=>(
                <div>{subAddr(item)}</div>
            )
          },
        {
            title: intl('statistics_10'),
            dataIndex: 'ink',
            align: 'center',
            sorter: true,
            render:(item: string)=>(
                <div>{formatCryptoBalance(BigNumber(item).div(new BigNumber(10).pow(18)))}</div>
            )
        },
        {
            title: intl('statistics_11'),
            dataIndex: 'art',
            align: 'center',
            sorter: true,
            render:(item: string)=>(
                <div>{formatCryptoBalance(BigNumber(item).div(new BigNumber(10).pow(18)))}</div>
            )
        },
        {
            title: intl('news_17'),
            dataIndex: 'timeCreate',
            align: 'center',
            render:(item: Date)=>(
                <div>{formatTime(item)}</div>
            )
        },
        {
            title: intl('public_15'),
            dataIndex: 'timeUpdate',
            align: 'center',
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
        if(sorter.field === 'ink'){
            if(sorter.order){
                sort.current = sorter.order === 'ascend' ? {ink: 1} : {ink: -1};
            }else{
                sort.current = { cdpi: -1 }
            }
        }else if(sorter.field === 'art'){
            if(sorter.order){
                sort.current = sorter.order === 'ascend' ? {art: 1} : {art: -1};
            }else{
                sort.current = { cdpi: -1 }
            }
        }else if(sorter.field === 'cdpi'){
            if(sorter.order){
                sort.current = sorter.order === 'ascend' ? {cdpi: 1} : {cdpi: -1};
            }else{
                sort.current = { cdpi: -1 }
            }
        }else{
            sort.current = { cdpi: -1 }
        }

        setPagination({
          skip: (item.current - 1) * 10,
          current: item.current,
          pageSize: item.pageSize,
          total: item.total
        })
    }

    const onVaultChange = (e: any) =>{
        setVaultId(e.target.value)
    }

    const onAddChange = (e: any) =>{
        setAddress(e.target.value)
    }

    const download = () =>{
        setLoadingDownload(true)
        apidownloadCdp(startTime, endTime).then(res=>{
            console.log(res)
            setLoadingDownload(false)
        })
    }

    return(
        <div>
            <div className={styles.search_top}>
                <Input placeholder='请输入Vault ID' className={styles.input} value={vaultId} allowClear onChange={onVaultChange} />
                <Input placeholder='请输入地址' className={styles.input} value={address} allowClear onChange={onAddChange} />
                <div className={styles.search_text}>{intl('public_16')}</div>
                {/* @ts-ignore */}
                <DatePicker defaultValue={dayjs(getDate(), dateFormat)} className={styles.DatePicker} onChange={onStartChange} />
                <div className={styles.search_text}>{intl('public_17')}</div>
                {/* @ts-ignore */}
                <DatePicker defaultValue={dayjs(getDate(), dateFormat)} className={styles.DatePicker} onChange={onEndChange} />
                <Access code='/dataStatistics/dataCdp:get' view={<Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={getList}>{intl('news_2')}</Button>} />
                <Access code='/dataStatistics/downloadCdp:get' view={<Button type="primary" icon={<DownloadOutlined />} loading={loadingDownload} onClick={download}>{intl('public_14')}</Button>} />
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