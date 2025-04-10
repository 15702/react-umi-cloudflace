// import { getRoutes } from 'umi';
import React, { useEffect, useState, useRef } from 'react';
import { Input, Button, Table, Image, Space, Modal, message, Form, Tooltip, DatePicker } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import styles from './index.less';
import { intl, formatTime } from "@/utils";
import {pageNews, updateNews, previewByUrl, addNews, delNews} from '@/api/news'
import Access from "@/components/Access"

const newsPage = () => {
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ open, setOpen ] = useState<boolean>(false);
  const [ openObtain, setOpenObtain ] = useState<boolean>(false);
  const [ confirmLoading, setConfirmLoading ] = useState<boolean>(false);
  const [ addLoading, setAddLoading ] = useState<boolean>(false);
  const [ pagination, setPagination ] = useState({
      skip: 0,
      current: 1,
      pageSize: 10,
      total: 0
  });
  const formItem = useRef({
      id: '',
      newsTitle: '',
      newsDec: '',
      newsImg: '',
      newsTime: '',
      newsLink: '',
      show: true,
  })
  const [ dataSource, setDataSource ] = useState([]);

  const [ modal, modalContext] = Modal.useModal();
  const [ messageApi, contextHolder ] = message.useMessage();
  
  const [ form ] = Form.useForm();
  const [ form2 ] = Form.useForm();
  const { TextArea } = Input;

  const getList = () =>{
    setLoading(true)
    pageNews(pagination.skip, pagination.pageSize ).then(res=>{
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

  const deleteNews= (item: any) =>{
    modal.confirm({
      title: intl('public_4'),
      icon: <ExclamationCircleFilled />,
      content: `${intl('news_10')} "${item.title}" ?`,
      okType: 'danger',
      onOk() {
        console.log('OK',item);
        delNews(item._id).then((res: any)=>{
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
      width: 100,
      align: 'center',
      render: (_: any, item: any, index: number)=>(
          <div className={styles.tableText}>{(pagination.current - 1) * 10 + index + 1}</div>
      )
    },
    {
      title: intl('news_4'),
      dataIndex: 'title',
      width: 200,
      align: 'center',
      render: (_: any, item: any)=>(
        <Tooltip placement="topLeft" title={item.title}>
          <div className={styles.tableText}>{item.title}</div>
        </Tooltip>
      )
    },
    {
      title: intl('news_5'),
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
      title: intl('news_6'),
      dataIndex: 'img',
      width: 200,
      align: 'center',
      render: (item: any)=>(
        <Image
          width={200}
          src={item}
        />
      )
    },
    {
      title: intl('news_7'),
      dataIndex: 'date',
      width: 150,
      align: 'center',
    },
    {
      title: intl('news_16'),
      dataIndex: 'show',
      width: 150,
      align: 'center',
      render: (item: any)=>(
        <div>{item ? intl('news_18') : intl('news_19')}</div>
      )
    },
    {
      title: intl('news_8'),
      dataIndex: 'url',
      width: 300,
      align: 'center',
      render:(item: any)=>(
        <a href={item} target={'_blank'}>{item}</a>
      )
    },
    {
      title: intl('news_17'),
      dataIndex: 'timeCreate',
      width: 150,
      align: 'center',
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
          <Button type="primary" onClick={()=>editNews(item)} >{intl('public_2')}</Button>
          { <Button type="primary" danger={item.show} onClick={()=>editShow(item)}>{!item.show ? intl('news_18') : intl('news_19')}</Button>
          }
          <Button type="primary" danger onClick={()=>deleteNews(item)}>{intl('public_3')}</Button>
        </Space>
      ),
    }
  ];

  const tableChange = (item: any)=>{
    console.log(item)
    setPagination({
      skip: (item.current - 1) * 10,
      current: item.current,
      pageSize: item.pageSize,
      total: item.total
    })
  }

  const editShow = (item: any) =>{
    modal.confirm({
      title: intl('public_4'),
      icon: <ExclamationCircleFilled />,
      content: `${intl(item.show ? 'news_23' : 'news_24')}`,
      okType: 'danger',
      onOk() {
        let obj = {
          id: item._id,
          title: item.title,
          des: item.des,
          img: item.img,
          date: item.date,
          url: item.url,
          show: !item.show
        }
        updateNews(obj).then((res: any)=>{
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

  const editNews = (item: any) =>{
    console.log(item)
    setOpen(true)
    formItem.current = {
        id: item._id,
        newsTitle: item.title,
        newsDec: item.des,
        newsImg: item.img,
        newsTime: item.date,
        newsLink: item.url,
        show: item.show
    }
    form.setFieldsValue(formItem.current)
  }
  
  const Addnews = () =>{
    formItem.current = {
      id: '',
      newsTitle: '',
      newsDec: '',
      newsImg: '',
      newsTime: '',
      newsLink: '',
      show: true,
    }
    setOpenObtain(true)
    form2.resetFields();
  }

  const copyTextToClipboard =(text: any) => {
    navigator.clipboard.writeText(text).then(
      () => {
        messageApi.open({
          type: 'success',
          content: intl('public_5'),
        });
        console.log('Text successfully copied to clipboard');
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  }

  const confirmAdd = () =>{
    form.submit()
  }

  const onFinish = (values: any) => {
    console.log(values)
    let item = {
      id: formItem.current.id,
      title: values.newsTitle,
      des: values.newsDec,
      img: values.newsImg,
      date: values.newsTime,
      url: values.newsLink,
      show: formItem.current.show
    }
    setConfirmLoading(true)
    if(formItem.current.id){
      updateNews(item).then((res: any)=>{
        setConfirmLoading(false)
        if(res?.code == 0){
          message.success(intl('public_13'))
          getList()
          setOpen(false)
        }
      }).catch(err=>{
        setConfirmLoading(false)
      })
    }else{
      addNews(item).then((res: any)=>{
        console.log(res)
        setConfirmLoading(false)
        if(res?.code == 0){
          message.success(intl('public_13'))
          getList()
          setOpen(false)
        }
      }).catch(err=>{
        setConfirmLoading(false)
      })
    }
  }

  const onDateChange = (data: any) =>{
    console.log(data)
  }

  const confirmObtain = ()=>{
    form2.submit()
  }

  const onObtain = (values: any)=>{
    console.log(values)
    setAddLoading(true)
    previewByUrl(values.newsLink).then((res: any)=>{
      console.log(res)
      setAddLoading(false)
      if(res?.code == 0){
        formItem.current = {
          id: '',
          newsTitle: res.data.title,
          newsDec: res.data.des,
          newsImg: res.data.img,
          newsTime: res.data.date,
          newsLink: res.data.url,
          show: true,
        }
        setConfirmLoading(false)
        setOpenObtain(false)
        setOpen(true)
        form.resetFields();
        form.setFieldsValue(formItem.current)
      }
    })
  }
  return (
    <div>
      {contextHolder}
      {modalContext}
      <div className={styles.search_top}>
        {/* <DatePicker className={styles.DatePicker} onChange={onDateChange} /> */}
        {/* <Input className={styles.input} placeholder={intl('news_1')} /> */}
        {/* <Button type="primary" icon={<SearchOutlined />} loading={loading}>{intl('news_2')}</Button> */}
        <Access code='/news/add:post' view={<Button className={styles.news_add} icon={<PlusOutlined />} onClick={Addnews}>{intl('news_3')}</Button>} ></Access>
      </div>
      <div className={styles.table}>
        {/* @ts-ignore */}
        <Table dataSource={dataSource} rowKey="_id" onChange={tableChange} loading={loading} columns={columns} scroll={{ x: 'auto', y: 550 }} pagination={pagination} />
      </div>
      <Modal
        title={intl('news_20')}
        width= '500px'
        open={openObtain}
        confirmLoading={addLoading}
        onOk={confirmObtain}
        onCancel={()=>setOpenObtain(false)}
      >
        <Form
          className={styles.form}
          form={form2}
          name="obtain"
          onFinish={onObtain}
          autoComplete="off"
          >
        <Form.Item
            label={intl('news_8')}
            name="newsLink"
            rules={[{required: true,message: intl('news_15'),}]}
            >
              <TextArea
                placeholder={intl('news_15')}
                autoSize={{
                  minRows: 2,
                  maxRows: 6,
                }}
              />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={formItem.current.id ? intl('news_22') : intl('news_21')}
        width= '700px'
        open={open}
        onOk={confirmAdd}
        confirmLoading={confirmLoading}
        onCancel={()=>setOpen(false)}
      >
        <Form
          className={styles.form}
          form={form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label={intl('news_4')}
            name="newsTitle"
            rules={[{required: true,message: intl('news_1')}]}
            >
              <TextArea
                placeholder={intl('news_1')}
                autoSize={{
                  minRows: 2,
                  maxRows: 6,
                }}
              />
          </Form.Item>
          <Form.Item
            label={intl('news_5')}
            name="newsDec"
            rules={[{required: true,message: intl('news_11'),}]}
            >
              <TextArea
                placeholder={intl('news_11')}
                autoSize={{
                  minRows: 2,
                  maxRows: 6,
                }}
              />
          </Form.Item>
          <Form.Item
            label={intl('news_12')}
            name="newsImg"
            rules={[{required: true,message: intl('news_13'),}]}
            >
              <TextArea
                placeholder={intl('news_13')}
                autoSize={{
                  minRows: 2,
                  maxRows: 6,
                }}
              />
          </Form.Item>
          <Form.Item
            label={intl('news_7')}
            name="newsTime"
            rules={[{required: true,message: intl('news_14'),}]}
            >
              <Input placeholder={intl('news_14')} />
          </Form.Item>
          <Form.Item
            label={intl('news_8')}
            name="newsLink"
            rules={[{required: true,message: intl('news_15'),}]}
            >
              <TextArea
                placeholder={intl('news_15')}
                autoSize={{
                  minRows: 2,
                  maxRows: 6,
                }}
              />
          </Form.Item>
          </Form>
      </Modal>
    </div>
  );
};

export default newsPage;
