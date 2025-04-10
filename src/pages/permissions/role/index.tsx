import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import { Input, Button, Table, Modal, message, Form, Checkbox, Space } from "antd";
import type { CheckboxProps } from 'antd';
import { intl, formatTime, formatCryptoBalance } from "@/utils";
import { apiRolePage, apiRoleAdd, apiRoleUpdate, apiRoleDel, apiRoleDetail } from '@/api/role';
import Access from "@/components/Access"
import { PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { apiPermissionsList } from '@/api/permission';
import { getLocale } from 'umi';
import { PermissionType } from "@/eth/deploy"

export default function Role () {
    const [ loading, setLoading ] = useState(false);
    const [ dataSource, setDataSource ] = useState([]);
    const [ editLoading, setEditLoading ] = useState(false);
    const [ openEdit, setOpenEdit ] = useState(false);
    const [ permissionsList, setPermissionsList ] = useState({
        menu: [],
        api: []
    });
    const [ checkedListMenu, setCheckedListMenu ] = useState<string[]>([])
    const [ checkedListApi, setCheckedListApi ] = useState<string[]>([])
    const [ roleId, setRoleId ] = useState<string>();
    const { TextArea } = Input;
    const [ form ] = Form.useForm();
    const CheckboxGroup = Checkbox.Group;
    const [ modal, modalContext] = Modal.useModal();
    const checkAlMenu = permissionsList.menu.length === checkedListMenu.length;
    const checkAllApi = permissionsList.api.length === checkedListApi.length;
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
            title: intl('permissions_13'),
            dataIndex: 'name',
            width: '150px',
            align: 'center',
        },
        {
            title: intl('permissions_5'),
            dataIndex: 'des',
            align: 'center',
        },
        {
            title: intl('public_1'),
            key: 'action',
            width: 300,
            align: 'center',
            render: (item: any) => (
              <Space size={10}>
                <Access code='/roles/update:put' view={<Button type="primary" onClick={()=>editAdmin(item)} >{intl('public_2')}</Button>} />
                <Access code='/roles/del:delete' view={<Button type="primary" danger onClick={()=>delAmin(item)}>{intl('public_3')}</Button>} />
              </Space>
            ),
        },
    ];

    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        setLoading(true);
        const res: any = await apiRolePage();
        console.log(res)
        if(res?.code === 0){
            setDataSource(res.data);
        }
        setLoading(false);
    }

    const confirmEdit = ()=>{
        form.submit()
    }

    const onFinish = async (values: any)=>{
        console.log(values)
        setEditLoading(true)
        if(roleId){
            const res: any = await apiRoleUpdate(roleId, values.des, checkedListMenu.concat(checkedListApi))
            if(res?.code === 0){
                setOpenEdit(false)
                getList()
            }
        }else{
            const res: any = await apiRoleAdd(values.name, values.des, checkedListMenu.concat(checkedListApi))
            if(res?.code === 0){
                setOpenEdit(false)
                getList()
            }
        }
        setEditLoading(false)
    }

    const delAmin = async (item: any) =>{
        modal.confirm({
            title: intl('public_4'),
            icon: <ExclamationCircleFilled />,
            content: `${intl('public_27')} "${item.name}" ?`,
            okType: 'danger',
            onOk: async()=> {
                console.log('OK',item);
                const res: any = await apiRoleDel(item._id)
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

    const editAdmin = async (item?: any) => {
        setCheckedListMenu([]);
        setCheckedListApi([]);
        if(item?._id){
            setRoleId(item._id)
            const res: any = await apiRoleDetail(item._id);
            if(res?.code === 0){
                setRoleId(res.data._id)
                console.log(res.data.permissions.map((item: any) => item._id))
                const menuList = res.data.permissions.filter((item: any) => item.type === PermissionType.MENU).map((item: any) => item._id)
                const apiList = res.data.permissions.filter((item: any) => item.type === PermissionType.API || item.type === PermissionType.BUTTON).map((item: any) => item._id)
                setCheckedListMenu(menuList);
                setCheckedListApi(apiList);
                form.setFieldsValue({
                    name: res.data.name,
                    des: res.data.des,
                    permissions: res.data.permissions.map((item: any) => item._id)
                })
            }
        }else{
            setRoleId(undefined)
            form.setFieldsValue({
                name: '',
                des: '',
                permissions: []
            })
        }
        setOpenEdit(true)
        const res: any = await apiPermissionsList();
        if(res?.code === 0){
            const list = res.data.map((item: any) => {
                const locale = getLocale()
                return {
                    label: locale == 'en-US' ? item.des.en : item.des.zh,
                    value: item._id,
                    type: item.type
                }
            })
            console.log(list)
            setPermissionsList({
                menu: list.filter((item: any) => item.type === PermissionType.MENU),
                api: list.filter((item: any) => item.type === PermissionType.API || item.type === PermissionType.BUTTON)
            })
        }
    }

    const onMenuChange = (list: string[]) => {
        console.log(list)
        setCheckedListMenu(list);
      };
    
    const onCheckAllMenuChange: CheckboxProps['onChange'] = (e) => {
        console.log(permissionsList)
        console.log(checkedListMenu)
        console.log(e.target.checked)
        setCheckedListMenu(e.target.checked ? permissionsList.menu.map((item: any) => item.value) : []);
    };

    const onApiChange = (list: string[]) => {
        console.log(list)
        setCheckedListApi(list);
      };
    
    const onCheckAllApiChange: CheckboxProps['onChange'] = (e) => {
        console.log(permissionsList)
        console.log(checkedListMenu)
        console.log(e.target.checked)
        setCheckedListApi(e.target.checked ? permissionsList.api.map((item: any) => item.value) : []);
    };
    
    return(
        <div>
            {modalContext}
            <div className={styles.search_top}>
                <Access code='/admin/add:post' view={<Button type="primary" icon={<PlusOutlined />} onClick={editAdmin}>{intl('public_23')}</Button>} ></Access>
            </div>
            <div className={styles.table}>
                {/* @ts-ignore */}
                <Table dataSource={dataSource} rowKey="_id" loading={loading} columns={columns} scroll={{ x: 'auto', y: 550 }} />
            </div>
            <Modal
                title={intl('permissions_17')}
                width= '1000px'
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
                        !roleId && <Form.Item
                            label={intl('permissions_13')}
                            name="name"
                            rules={[{required: true, message: intl('permissions_14')}]}
                        >
                            <Input placeholder={intl('permissions_14')} />
                        </Form.Item>
                    }
                    <Form.Item
                        label={intl('permissions_5')}
                        name="des"
                        rules={[{required: true,message: intl('permissions_11')}]}
                    >
                        <TextArea
                            placeholder={intl('permissions_11')}
                            autoSize={{
                                minRows: 2,
                                maxRows: 6,
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={intl('permissions_15')}
                        name="permissions"
                        rules={[{required: true, message: intl('permissions_19')}]}
                    >
                        <div className={styles.checkbox}>
                            <div className={styles.checkbox_left}>
                                <div className={styles.checkbox_title}>
                                    <div>{intl('permissions_20')}</div>
                                    <Checkbox onChange={onCheckAllMenuChange} checked={checkAlMenu}>{intl('public_26')}</Checkbox>
                                </div>
                                <div className={styles.checkbox_list}><CheckboxGroup options={permissionsList.menu} value={checkedListMenu} onChange={onMenuChange} /></div>
                            </div>
                            <div className={styles.checkbox_right}>
                                <div className={styles.checkbox_title}>
                                    <div>{intl('permissions_21')}</div>
                                    <Checkbox onChange={onCheckAllApiChange} checked={checkAllApi}>{intl('public_26')}</Checkbox>
                                </div>
                                <div className={styles.checkbox_list}><CheckboxGroup options={permissionsList.api} value={checkedListApi} onChange={onApiChange} /></div>
                            </div>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}