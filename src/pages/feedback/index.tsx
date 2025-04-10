import React, { useEffect, useState, Fragment } from 'react';
import { Input, Button, Table, Image, Space, Modal, message, DatePicker, Tooltip, Select } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import styles from './index.less';
import { intl, formatTime } from "@/utils";
import { feedbackPage, feedbackUpdate } from '@/api/feedback'
import Access from "@/components/Access"

export default () => {
  const [ loading, setLoading ] = useState(false);
  const [ done, setDone ] = useState(null);
  const [ pagination, setPagination ] = useState({
      skip: 0,
      current: 1,
      pageSize: 10,
      total: 0
  });
  const [ dataSource, setDataSource ] = useState([]);

  const [ modal, contextHolder] = Modal.useModal();

  const getList = () =>{
    setLoading(true)
    let params: any = {
      skip: pagination.skip,
      limit: pagination.pageSize,
    }
    if(done != null){
      params.done = done
    }

    feedbackPage(params).then(res=>{
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

  const deleteTr= (item: any) =>{
    modal.confirm({
      title: intl('public_4'),
      icon: <ExclamationCircleFilled />,
      content: `${intl('feedback_6')}`,
      okType: 'danger',
      onOk() {
        console.log('OK',item);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const handle= (item: any) =>{
    modal.confirm({
      title: intl('public_4'),
      icon: <ExclamationCircleFilled />,
      content: `${intl('feedback_7')}`,
      onOk() {
        feedbackUpdate(item._id, true).then((res: any)=>{
          console.log(res)
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

  const columns = [
    {
      key: '_id',
      width: '100px',
      align: 'center',
      render: (_: any, item: any, index: number)=>(
          <div className={styles.tableText}>{(pagination.current - 1) * 10 + index + 1}</div>
      )
    },
    {
      title: intl('feedback_2'),
      dataIndex: 'timeCreate',
      width: '150px',
      align: 'center',
      render:(item: any)=>(
        <div>{formatTime(item)}</div>
      )
    },
    {
      title: intl('feedback_3'),
      dataIndex: 'email',
      width: '250px',
      align: 'center',
      render: (_: any, item: any)=>(
        <div className={styles.tableText}>{item.email}</div>
      )
    },
    {
      title: intl('public_9'),
      dataIndex: 'done',
      width: '250px',
      align: 'center',
      render: (_: any, item: any)=>(
        <div>{item.done ? intl('public_10') : intl('public_11')}</div>
      )
    },
    {
      title: intl('feedback_4'),
      dataIndex: 'imgs',
      width: '450px',
      align: 'center',
      render: (_: any, imgs: any)=>(
        <Image.PreviewGroup
          preview={{
            onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
          }}
        >
          <div className={styles.previewGroup}>
            {
              imgs.files.map((item: any,index: number)=>{
                return <div className={styles.preview} key={index}>
                  <Image width={90} height={60} src={item} />
                </div>
              })
            }
          </div>
        </Image.PreviewGroup>
      )
    },
    {
      title: intl('feedback_5'),
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
      title: intl('public_1'),
      key: 'action',
      width: '150px',
      align: 'center',
      render: (_: any, item: any) => (
        <Space size={10}>
          {
            item.done ? null : <Access code='/feedback/update:post' view={<Button type="primary" onClick={()=>handle(item)}>{intl('public_8')}</Button>} />
          }
          {/* <Button type="primary" danger onClick={()=>deleteTr(item)}>{intl('public_3')}</Button> */}
        </Space>
      ),
    }
  ];

  const onDateChange = (data: any) =>{
    console.log(data)
  }

  const selectChange = (value: any) =>{
    console.log(value)
    setDone(value)
  }

  return (
    <div>
      {contextHolder}
      <div className={styles.search_top}>
        {/* <DatePicker className={styles.DatePicker} onChange={onDateChange} /> */}
        {/* <Input className={styles.input} placeholder={intl('feedback_1')} /> */}
        <Access code='/feedback/page:get' view={<Select className={styles.feedbackSelect} placeholder={intl('public_12')} onChange={selectChange} options={[
          {
            label: intl('public_10'),
            value: true
          },
          {
            label: intl('public_11'),
            value: false
          }
        ]} />} />
        <Access code='/feedback/page:get' view={<Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={getList}>{intl('news_2')}</Button>} />
      </div>
      <div className={styles.table}>
        {/* @ts-ignore */}
        <Table dataSource={dataSource} rowKey="_id" onChange={tableChange} loading={loading} columns={columns} scroll={{ x: 'auto', y: 550 }} pagination={pagination} />
      </div>
    </div>
  );
};
  