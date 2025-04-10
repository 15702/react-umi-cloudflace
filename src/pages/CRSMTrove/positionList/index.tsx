import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import { useModel } from 'umi';
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs';
import Access from "@/components/Access"
import { Input, Button, Table, Modal, message, Form, Select, DatePicker, Space, Tooltip, InputNumber } from "antd";
import { intl, formatTime, formatPercent, formatCryptoBalance, amountToWei, amountFromWei } from "@/utils";
import { getCdpsList, createNewCRSM } from "@/eth/eth_proxy_action"
import ConnectWallet from "@/components/ConnectWallet"

export default function PostitionList () {
    const {walletAddress} = useModel('global');
    const [loading, setLoading] = useState<boolean>(false)
    const [dataSource, setDataSource] = useState<[]>([]);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [editLoading, setEditLoading] = useState<boolean>(false)
    const [troveId, setTroveId] = useState<string>('');

    const [modal, modalContext] = Modal.useModal();
    const [ form ] = Form.useForm();

    const columns = [
        {
            key: 'id',
            dataIndex: 'index',
            align: 'center',
        },
        {
            title: intl('CRSM_9'),
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: intl('CRSM_5'),
            dataIndex: 'lockedCollateral',
            align: 'center',
            render:(item: BigNumber)=>(
                <div>{formatCryptoBalance(item)} YBTC</div>
            )
        },
        {
            title: intl('CRSM_6'),
            dataIndex: 'debt',
            align: 'center',
            render:(item: BigNumber)=>(
                <div>{formatCryptoBalance(item, 4)} YU</div>
            )
        },
        {
            title: intl('CRSM_7'),
            dataIndex: 'liquidationPrice',
            align: 'center',
            render:(item: BigNumber)=>(
                <div>$ {formatCryptoBalance(item)}</div>
            )
        },
        {
            title: intl('CRSM_8'),
            dataIndex: 'collateralizationRatio',
            align: 'center',
            render:(item: BigNumber)=>(
                <div>{formatPercent(item.times(100), { precision: 2, roundMode: BigNumber.ROUND_DOWN})}</div>
            )
        },
        {
            title: intl('public_1'),
            key: 'action',
            align: 'center',
            render: (item: any) => (
                <Access code='/custody/bridge/v2/withdraw/requestRefund' view={<Button type="primary" onClick={()=>clickEdit(item)}>{intl('CRSM_10')}</Button>} />
            ),
        },
    ];

    useEffect(()=>{
        if(walletAddress){
            getList()
        }
    }, [walletAddress])

    const getList = async () =>{
        setLoading(true)
        const cdpsList = await getCdpsList(window.YalaEthProvider, walletAddress)
        console.log(cdpsList)
        const results = cdpsList.list.map((item:any, index: number)=>{
            console.log(amountFromWei(BigNumber(item.trove.interest.toString())).toString())
            return{
                index: index + 1,
                idStr: item.id,
                id: item.id.toString(),
                lockedCollateral: amountFromWei(BigNumber(item.trove.coll.toString())),
                debt: amountFromWei(BigNumber(item.trove.debt.toString()).plus(BigNumber(item.trove.interest.toString()))),
                liquidationPrice: amountFromWei(BigNumber(item.liquidationPrice.toString())),
                collateralizationRatio: amountFromWei(BigNumber(item.ICR.toString())),
                interest: amountFromWei(BigNumber(item.trove.interest.toString()))
            }
        })
        setDataSource(results)
        setLoading(false)
    }

    const confirmEdit = ()=>{
        form.submit()
    }
    
    const onFinish = async (values: any)=>{
        console.log(values)
        setEditLoading(true)
        const res: any = await createNewCRSM(
            window.YalaEthProvider,
            troveId,
            amountToWei(BigNumber(values.TRGCR), 16),
            amountToWei(BigNumber(values.TARCR), 16),
            amountToWei(BigNumber(values.MAX_TARCR), 16),
            amountToWei(BigNumber(values.debtGasCompensation)),
            amountToWei(BigNumber(values.amount)),
            walletAddress
        )
        console.log(res)
        if(res?.transactionHash){
            message.success(intl('public_13'))
            getList()
            setOpenEdit(false)
        }
        setEditLoading(false)
    }

    const clickEdit = (item: any)=> {
        console.log(item)
        setOpenEdit(true)
        form.resetFields()
        setTroveId(item.idStr)
    }

    return(
        <div className={styles.div_all}>
            <ConnectWallet getList={getList} />
            <div className={styles.table}>
                {/* @ts-ignore */}
                <Table dataSource={dataSource} rowKey="id" loading={loading} columns={columns} scroll={{ x: 'auto', y: 580 }} />
            </div>
            <Modal
                title={intl('CRSM_10')}
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
                    <Form.Item
                        label={intl('CRSM_13')}
                        name="TRGCR"
                        rules={[{required: true, message: intl('CRSM_18')}]}
                    >
                        <InputNumber className={styles.from_number} min={0} placeholder={intl('CRSM_18')} />
                    </Form.Item>
                    <Form.Item
                        label={intl('CRSM_14')}
                        name="TARCR"
                        rules={[{required: true, message: intl('CRSM_19')}]}
                    >
                        <InputNumber className={styles.from_number} min={0} placeholder={intl('CRSM_19')} />
                    </Form.Item>
                    <Form.Item
                        label={intl('CRSM_15')}
                        name="MAX_TARCR"
                        rules={[{required: true, message: intl('CRSM_20')}]}
                    >
                        <InputNumber className={styles.from_number} min={0} placeholder={intl('CRSM_20')} />
                    </Form.Item>
                    <Form.Item
                        label={intl('CRSM_16')}
                        name="debtGasCompensation"
                        rules={[{required: true, message: intl('CRSM_21')}]}
                    >
                        <InputNumber className={styles.from_number} min={0} placeholder={intl('CRSM_21')} />
                    </Form.Item>
                    <Form.Item
                        label={intl('CRSM_17')}
                        name="amount"
                        rules={[{required: true, message: intl('CRSM_22')}]}
                    >
                        <InputNumber className={styles.from_number} min={0} placeholder={intl('CRSM_22')} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}