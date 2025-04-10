import React, { useEffect, useState, Fragment } from 'react';
import { Button, Table, DatePicker } from "antd";
import {
  SearchOutlined,DownloadOutlined
} from '@ant-design/icons';
import styles from './index.less';
import dayjs from 'dayjs';
import { intl, formatTime } from "@/utils";
import { apiDataWallet, apidownloadWallet } from '@/api/statistics'
import Access from "@/components/Access"

export default () => {
    const [ loading, setLoading ] = useState(false);
    const [ dataSource, setDataSource ] = useState([]);
    const [ loadingDownload, setLoadingDownload ] = useState(false);
    const dateFormat = 'YYYY-MM-DD';
    
    const getDate = () =>{
        const today = dayjs();
        const formattedDate = today.format('YYYY-MM-DD'); 
        return formattedDate
    }

    const [startTime, setStartTime] = useState<string>(getDate())

    const getList = () =>{
        setLoading(true)
        apiDataWallet(startTime, undefined, undefined).then(res=>{
            console.log(res)
            if(res?.data){
                const list = res.data.map((item: any,index: number)=>{
                    return{
                        ...item,
                        index: index + 1
                    }
                })
                console.log(list)
                setDataSource(list)
            }
            setLoading(false)
        })
    }

    const download = () =>{
        setLoadingDownload(true)
        apidownloadWallet(startTime).then(res=>{
            console.log(res)
            setLoadingDownload(false)
        })
    }

    useEffect(()=>{
        getList()
    },[startTime])

    const columns = [
        {
          key: 'index',
          dataIndex: 'index',
          align: 'center',
        },
        {
          title: intl('statistics_9'),
          dataIndex: 'chain',
          align: 'center',
        },
        {
          title: intl('statistics_3'),
          dataIndex: 'date',
          align: 'center',
          render:(item: any)=>(
            <div>{formatTime(item)}</div>
          )
        },
        {
          title: 'pv',
          dataIndex: 'pv',
          align: 'center',
        },
        {
            title: 'uv',
            dataIndex: 'uv',
            align: 'center',
        },
        {
            title: intl('statistics_4'),
            dataIndex: 'country',
            align: 'center',
        },
    ];

    const onDateChange = (data: Date, dateString: string) =>{
        console.log(data)
        setStartTime(dateString)
    }

    return(
        <div>
            <div className={styles.search_top}>
                {/* @ts-ignore */}
                <DatePicker defaultValue={dayjs(getDate(), dateFormat)} className={styles.DatePicker} onChange={onDateChange} />
                <Access code='/dataStatistics/dataWallet:get' view={<Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={getList}>{intl('news_2')}</Button>} />
                <Access code='/dataStatistics/downloadWallet:get' view={<Button type="primary" icon={<DownloadOutlined />} loading={loadingDownload} onClick={download}>{intl('public_14')}</Button>} />
            </div>
            <div>
            <div className={styles.table}>
                {/* @ts-ignore */}
                <Table dataSource={dataSource} rowKey="index" loading={loading} columns={columns} scroll={{ x: 'auto', y: 550 }} />
            </div>
            </div>
        </div>
    )
}