import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import { Tree, Input, Button, Table, Modal, message, Form, Radio } from "antd";
import type { TreeDataNode, RadioChangeEvent } from 'antd';
import { intl } from "@/utils";
import { apiPermissionsList, apiPermissionsAdd, apiPermissionsDel, apiPermissionsUpdate, apiPermissionsListOfMenu } from '@/api/permission';
import Access from "@/components/Access"
import { PlusOutlined, ExclamationCircleFilled, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel , getLocale, } from 'umi';
import { PermissionType } from "@/eth/deploy"

export default function Permission () {
    const [ selectedKeys, setSelectedKeys ] = useState<string>('');
    const [ parentKey, setParentKey ] = useState<string>();
    const [ menuList, setMenuList ] = useState<TreeDataNode[]>([]);
    // const [ expandedKeys, setExpandedKeys ] = useState<string[]>([])
    const [ openEdit, setOpenEdit ] = useState<boolean>(false);
    const [ editLoading, setEditLoading ] = useState(false);
    const [ operateType, setAddOperate ] = useState<number>(1);
    const [ apiList, setApiList ] = useState<string[]>([]);
    const [ apiCheck, setApiCheck ] = useState<string>('');
    const [ selectType, setSelectType ] = useState<string>();
    const formItem = useRef({
        zh: '',
        en: ''
    })
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

    const [ form ] = Form.useForm();
    const [ modal, modalContext] = Modal.useModal();

    const onSelect = (selectedKeysValue: any, info: { node: any }) => {
        console.log(info)
        console.log(selectedKeysValue[0])
        formItem.current = info.node.des
        const parentKeys = getParentKeys(menuList, String(info.node.key))
        console.log(parentKeys)
        setParentKey(parentKeys[parentKeys.length - 1]);
        setCheckedKeys(selectedKeysValue)
        setSelectedKeys(selectedKeysValue[0]);
    };
    
    useEffect(()=>{
        getMenuList()
        getApiList()
    }, [])

    const getMenuList = async () => {
        const res: any = await apiPermissionsListOfMenu();
        console.log(res)
        if(res?.code === 0){
            const list = extractTitleAndKey(res.data)
            console.log(list)
            setMenuList(list)
            // setExpandedKeys(getAllKeys(list));
        }
    }

    const getApiList = async () => {
        const res: any = await apiPermissionsList();
        console.log(res)
        if(res?.code === 0){
            const list = res.data.filter((item: any) => item.type !== PermissionType.MENU).map((item: any) => {
                const locale = getLocale()
                return {
                    label: locale == 'en-US' ? item.des.en : item.des.zh,
                    id: {
                        id: item._id,
                        des: item.des
                    },
                    value: item._id,
                    type: item.type
                }
            })
            setApiList(list.filter((item: any) => item.type === PermissionType.API || item.type === PermissionType.BUTTON))
        }
    }

    const getParentKeys = (nodes: TreeDataNode[], targetKey: string, parents: string[] = []): string[] => {
        for (const node of nodes) {
          if (node.key === targetKey) {
            return parents;
          }
          if (node.children) {
            const found = getParentKeys(node.children, targetKey, [...parents, String(node.key)]);
            if (found.length) return found;
          }
        }
        return [];
      };

    const extractTitleAndKey = (arr: any) => {
        const locale = getLocale()
        return arr.map((item: any) => ({
          title: locale == 'en-US' ? item.des.en : item.des.zh,
          key: item._id,
          des: item.des,
          ...(item.children ? { children: extractTitleAndKey(item.children) } : {}),
        }));
    };

    const getAllKeys = (nodes: any) => {
        let keys: any = [];
        nodes.forEach((node: any) => {
          keys.push(node.key);
          if (node.children) {
            keys = keys.concat(getAllKeys(node.children)); 
          }
        });
        return keys;
    };

    const confirmEdit = ()=>{
        form.submit()
    }

    const onFinish = async (values: any)=>{
        console.log(values)
        setEditLoading(true)
        if(operateType === 1 || operateType === 4){
             const res: any = await apiPermissionsAdd(values.code, {en: values.en, zh: values.zh}, operateType === 1 ? PermissionType.MENU : PermissionType.BUTTON)
            if(res?.code === 0){
                setOpenEdit(false)
                if(operateType === 4){
                    getApiList()
                }else{
                    getMenuList()
                }
            }
        }
        if(operateType === 2){
            const res: any = await apiPermissionsAdd(values.code, {en: values.en, zh: values.zh}, PermissionType.MENU, selectedKeys)
           if(res?.code === 0){
               setOpenEdit(false)
               getMenuList()
           }
        }
        if(operateType === 3){
            const res: any = await apiPermissionsUpdate(selectType === PermissionType.MENU ? selectedKeys : apiCheck, {en: values.en, zh: values.zh})
           if(res?.code === 0){
               setOpenEdit(false)
            if(selectType === PermissionType.MENU){
                getMenuList()
                setCheckedKeys([])
                setSelectedKeys('')
            }else{
                getApiList()
                setApiCheck('')
            }
           }
        }
        setEditLoading(false)
    }

    const editMenu = (index: number, type?: string) => {
        console.log(index)
        form.resetFields()
        if(index === 3){
            setSelectType(type)
            form.setFieldsValue({
                zh: formItem.current.zh,
                en: formItem.current.en
            })
        }
        setAddOperate(index)
        setOpenEdit(true)
    }

    const onApiChange = ({ target }: any) => {
        console.log('radio1 checked', target, target.value);
        formItem.current = target.id.des
        setApiCheck(target.value);
    };

    const delPermissions = async (type: string) => {
        const locale = getLocale()
        modal.confirm({
            title: intl('public_4'),
            icon: <ExclamationCircleFilled />,
            content: `${intl('public_27')}: ${locale == 'en-US' ? formItem.current.en : formItem.current.zh}?`,
            okType: 'danger',
            onOk: async()=> {
                // console.log('OK',item);
                const res: any = await apiPermissionsDel(type === PermissionType.MENU ? selectedKeys : apiCheck)
                if(res?.code === 0){
                    message.success(intl('public_13'))
                    if(type === PermissionType.MENU){
                        getMenuList()
                        setCheckedKeys([])
                        setSelectedKeys('')
                    }else{
                        getApiList()
                        setApiCheck('')
                    }
                    
                }
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }

    return(
        <div className={styles.div_all}>
            {modalContext}
            <div className={styles.div_all_left}>
                <div className={styles.left_title}>
                    <Access code='/permissions/add:post' view={<Button type="primary" icon={<PlusOutlined />} onClick={()=>editMenu(1)}>{intl('permissions_25')}</Button>} />
                    {
                        selectedKeys && <div className={styles.left_title_right}>
                            <Access code='/permissions/add:post' view={<Button type="primary" icon={<PlusOutlined />} onClick={()=>editMenu(2)}>{intl('permissions_26')}</Button>} />
                            <Access code='/permissions/update:put' view={<Button type="primary" icon={<FormOutlined />} onClick={()=>editMenu(3, PermissionType.MENU)}>{intl('permissions_27')}</Button>} />
                            <Access code='/permissions/del:delete' view={<Button type="primary" icon={<DeleteOutlined />} onClick={()=>delPermissions(PermissionType.MENU)}>{intl('permissions_28')}</Button>} />
                        </div>
                    }
                </div>
                <div className={styles.left_tree}>
                    <Tree
                        // expandedKeys={expandedKeys}
                        onSelect={onSelect}
                        treeData={menuList}
                        selectedKeys={checkedKeys}
                    />
                </div>
            </div>
            <div className={styles.div_all_right}>
                <div className={styles.right_title}>
                    <Access code='/permissions/add:post' view={<Button type="primary" icon={<PlusOutlined />} onClick={()=>editMenu(4)}>{intl('permissions_18')}</Button>} />
                    {apiCheck && <Access code='/permissions/update:put' view={<Button type="primary" icon={<FormOutlined />} onClick={()=>editMenu(3, PermissionType.API)}>{intl('permissions_35')}</Button>} />}
                    {apiCheck && <Access code='/permissions/del:delete' view={<Button type="primary" icon={<DeleteOutlined />} onClick={()=>delPermissions(PermissionType.API)}>{intl('permissions_34')}</Button>} />}
                </div>
                <div className={styles.right_list}>
                    <div className={styles.checkbox_list}><Radio.Group options={apiList} onChange={onApiChange} value={apiCheck} /></div>
                </div>
            </div>
            <Modal
                title={intl(operateType ===  1 ? 'permissions_25' : operateType === 2 ? 'permissions_26' : operateType === 3 ? selectType === PermissionType.MENU ? 'permissions_27' : 'permissions_35' : 'permissions_18')}
                width= '400px'
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
                        operateType !==  3 && <Form.Item
                            label={intl('permissions_16')}
                            name="code"
                            rules={[{required: true,message: intl('permissions_31')}]}
                        >
                            <Input placeholder={intl('permissions_31')} />
                        </Form.Item>
                    }
                    <Form.Item
                        label={intl('permissions_29')}
                        name="zh"
                        rules={[{required: true, message: intl('permissions_32')}]}
                    >
                        <Input placeholder={intl('permissions_32')} />
                    </Form.Item>
                    <Form.Item
                        label={intl('permissions_30')}
                        name="en"
                        rules={[{required: true, message: intl('permissions_33')}]}
                    >
                        <Input placeholder={intl('permissions_33')} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}