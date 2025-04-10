import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import { Input, Button, Table, Modal, message, Form, Select } from "antd";
import { intl, formatTime, formatCryptoBalance } from "@/utils";
import { apiAdminPage, apiCaptchaSend, apiAdminAdd, apiAdminUpdateOthers, apiAdminUpdateSelf } from '@/api/admin';
import Access from "@/components/Access"
import { PlusOutlined } from '@ant-design/icons';
import { apiRolePage } from '@/api/role';
import { CaptchaType } from "@/eth/deploy"
import { history, useModel, setLocale , getLocale, } from 'umi';

export default function Administrator () {
    const { loginEmail } = useModel('global');
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ dataSource, setDataSource ] = useState([]);
    const [ editLoading, setEditLoading ] = useState<boolean>(false);
    const [ openEdit, setOpenEdit ] = useState<boolean>(false);
    const [ roleList, setRoleList ] = useState([]);
    const [ adminId, setAdminId ] = useState<string>();
    const [ isAdd, setIsAdd ] = useState<boolean>(true);
    const [ captchaLoading, setCaptchaLoading ] = useState<boolean>(false);
    const [ statusList, setStatusList ] = useState([
        { label: intl('permissions_9'), value: 1 },
        { label: intl('permissions_8'), value: 0 },
    ]);
    const { TextArea } = Input;
    const [ form ] = Form.useForm();
    const [ messageApi, contextHolder ] = message.useMessage();
    const columns = [
        {
            key: '_id',
            dataIndex: 'index',
            align: 'center',
            render: (_: any, item: any, index: number)=>(
                <div className={styles.tableText}>{index + 1}</div>
            )
        },
        {
            title: intl('permissions_4'),
            dataIndex: 'email',
            width: '250px',
            align: 'center',
        },
        {
            title: intl('permissions_5'),
            dataIndex: 'des',
            align: 'center',
        },
        {
            title: intl('public_9'),
            dataIndex: 'disable',
            align: 'center',
            render:(item: boolean)=>(
                <div>{item ? intl('permissions_8') : intl('permissions_9')}</div>
            )
        },
        {
            title: intl('permissions_7'),
            dataIndex: 'roles',
            align: 'center',
            render:(item: any)=>(
                <div>{formatRoles(item)}</div>
            )
        },
        {
            title: intl('public_22'),
            dataIndex: 'createdAt',
            align: 'center',
            render:(item: Date)=>(
                <div>{formatTime(item)}</div>
            )
        },
        {
            title: intl('public_1'),
            key: 'action',
            width: 200,
            align: 'center',
            render: (item: any) => (
                <Access code={adminId ? '/admin/updateOthers:put' : '/admin/updateSelf:put' } view={<Button type="primary" onClick={()=>editAdmin(item)} >{intl('public_2')}</Button>} />
            ),
        },
    ];

    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        setLoading(true);
        const res: any = await apiAdminPage();
        console.log(res)
        if(res?.code === 0){
            setDataSource(res.data);
        }
        setLoading(false);
    }

    const formatRoles = (arr: any) =>{
        return arr.map((item: any) => item.des).join(', ')
    }

    const confirmEdit = ()=>{
        form.submit()
    }

    const onFinish = async (values: any)=>{
        console.log(values)
        setEditLoading(true)
        if(isAdd){
            const res: any = await apiAdminAdd(values.email, values.password, values.des, values.roles, values.captcha)
            if(res?.code === 0){
                setOpenEdit(false)
                getList()
            }
        }else{
            if(adminId){
                const res: any = await apiAdminUpdateOthers(adminId, values.password, values.des, values.disable === 0 ? true : false, values.roles, values.captcha)
                if(res?.code === 0){
                    setOpenEdit(false)
                    getList()
                }
            }else{
                const res: any = await apiAdminUpdateSelf(values.password, values.des, values.captcha)
                if(res?.code === 0){
                    setOpenEdit(false)
                    getList()
                }
            }
        }
        setEditLoading(false)
    }

    const editAdmin = async (item?: any) => {
        setOpenEdit(true)
        form.resetFields()
        if(item?._id){
            setIsAdd(false)
            if(loginEmail === item.email){
                setAdminId(undefined)
            }else{
                setAdminId(item._id)
            }
            form.setFieldsValue({
                email: item.email,
                password: item.password,
                des: item.des,
                disable: item.disable ? 0 : 1,
                roles: item.roles.map((item: any) => item._id),
                captcha: ''
            })
        }else{
            setIsAdd(true)
            setAdminId(undefined)
            form.setFieldsValue({
                email: '',
                password: '',
                des: '',
                disable: 0,
                roles: [],
                captcha: ''
            })
        }
        const res: any = await apiRolePage()
        if(res?.code === 0){
            const list = res.data.map((item: any) => {
                return {
                    label: item.name +': '+item.des,
                    value: item._id,
                }
            })
            setRoleList(list)
        }
    }

    const getCaptcha = async () =>{
        setCaptchaLoading(true)
        let captchaType = CaptchaType.ADMIN_ADD
        if(!isAdd){
            if(adminId){
                captchaType = CaptchaType.ADMIN_UPDATE_OTHERS
            }else{
                captchaType = CaptchaType.ADMIN_UPDATE_SELF
            }
        }
        console.log(captchaType)
        const res: any = await apiCaptchaSend(loginEmail, captchaType)
        if(res?.code === 0){
            message.success(intl('public_30'))
        }
        setCaptchaLoading(false)
    }

    return(
        <div>
            {contextHolder}
            <div className={styles.search_top}>
                <Access code='/admin/add:post' view={<Button type="primary" icon={<PlusOutlined />} onClick={editAdmin}>{intl('public_23')}</Button>} ></Access>
            </div>
            <div className={styles.table}>
                {/* @ts-ignore */}
                <Table dataSource={dataSource} rowKey="_id" loading={loading} columns={columns} scroll={{ x: 'auto', y: 580 }} />
            </div>
            <Modal
                title={intl(isAdd ? 'permissions_23' : 'permissions_24')}
                width= '500px'
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
                    {
                        isAdd &&  <Form.Item
                            label={intl('permissions_4')}
                            name="email"
                            rules={[{required: true, message: intl('permissions_6')}]}
                        >
                            <Input placeholder={intl('permissions_6')} />
                        </Form.Item>
                    }
                    <Form.Item
                        label={intl('permissions_12')}
                        name="password"
                        rules={[{required: isAdd ? true : false, message: intl('permissions_10')}]}
                    >
                        <Input.Password placeholder={intl('permissions_10')} />
                    </Form.Item>
                    <Form.Item
                        label={intl('permissions_5')}
                        name="des"
                        rules={[{required: true, message: intl('permissions_11')}]}
                    >
                        <TextArea
                            placeholder={intl('permissions_11')}
                            autoSize={{
                                minRows: 2,
                                maxRows: 6,
                            }}
                        />
                    </Form.Item>
                    {
                        (isAdd || adminId) && <Form.Item
                            label={intl('permissions_7')}
                            name="roles"
                            rules={[{required: true, message: intl('permissions_22')}]}
                            >
                            <Select mode="multiple" placeholder={intl('permissions_22')} options={roleList} />
                        </Form.Item>
                    }
                    {
                        !isAdd && adminId && <Form.Item
                            label={intl('public_9')}
                            name="disable"
                            rules={[{required: true, message: intl('public_12')}]}
                            >
                            <Select placeholder={intl('public_12')} options={statusList} />
                        </Form.Item>
                    }
                    <Form.Item
                        label={intl('public_25')}
                        name="captcha"
                        rules={[{required: true, message: intl('public_28')}]}
                    >
                        <div className={styles.captcha}>
                            <Input placeholder={intl('public_28')} />
                            <Button type='primary' loading={captchaLoading} onClick={getCaptcha}>{intl('public_29')}</Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}