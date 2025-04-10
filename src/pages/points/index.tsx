import React, { useEffect, useState, useRef } from 'react';
import { Input, Button, Upload, Modal, message, Form,} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';
import styles from './index.less';
import { intl, formatTime } from "@/utils";
import { apiPointsManualRewardPoints } from '@/api/points'
import Access from "@/components/Access"

export default () => {

    const [ modal, modalContext] = Modal.useModal();
    const [ messageApi, contextHolder ] = message.useMessage();
    
    const [ form ] = Form.useForm();
    const { TextArea } = Input;

    const customRequest = async (file: any) =>{
        console.log(file)
        if(file.file){
            const formData = new FormData();
            formData.append('file', file.file)
            const res: any = await apiPointsManualRewardPoints(formData);
            console.log(res)
            if(res?.code === 0){
                // getList()
                message.success(intl('public_13'))
            }
        }
        return false
    }

    return(
        <div>
            {contextHolder}
            {modalContext}
            <div className={styles.search_top}>
                <Access 
                    code='/points/manualRewardPoints:post' 
                    view={<Upload 
                        showUploadList={false}
                        // beforeUpload={beforeUpload}
                        customRequest={customRequest}
                        accept='.csv,.xls,.xlsx'>
                        <Button className={styles.news_add} icon={<PlusOutlined />}>
                            {intl('public_21')}
                        </Button>
                    </Upload>} 
                />
            </div>
        </div>
    )
}
