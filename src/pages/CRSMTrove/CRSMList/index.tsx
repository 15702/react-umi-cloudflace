import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import { useModel } from 'umi';
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs';
import Access from "@/components/Access"
import { Input, Button, Table, Modal, message, Form, Select, DatePicker, Space, Tooltip, InputNumber } from "antd";
import { intl, formatTime, formatPercent, formatCryptoBalance, amountToWei, amountFromWei } from "@/utils";
import { getEthWalletAddress } from '@/eth/eth';
import { getCRSMList, depositToCRSM, withdrawFromSPOT, claimYield, claimAllCollateralGains, updateCR, commitDebtGasCompensation, acceptDebtGasCompensation, withdraw } from "@/eth/eth_proxy_action"
import ConnectWallet from "@/components/ConnectWallet"

export default function CRSMList () {
    const {walletAddress, setWalletAddress} = useModel('global');
    const [loading, setLoading] = useState<boolean>(false)
    const [walletloading, setWalletLoading] = useState<boolean>(false)
    const [dataSource, setDataSource] = useState<[]>([]);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [editLoading, setEditLoading] = useState<boolean>(false)
    const [openEdit2, setOpenEdit2] = useState<boolean>(false);
    const [openEdit3, setOpenEdit3] = useState<boolean>(false);
    const [crsmAddr, setCrsmAddr] = useState<string>('');
    const [actionType, setActionType] = useState<number>(0);

    const [messageApi, contextHolder] = message.useMessage();
    const [ form ] = Form.useForm();
    const [ form2 ] = Form.useForm();
    const [ form3 ] = Form.useForm();

    const columns = [
        {
            key: 'id',
            dataIndex: 'index',
            align: 'center',
        },
        {
            title: 'id',
            dataIndex: 'id',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 70 },
            }),
            onCell: () => ({
                style: { minWidth: 70 },
            }),
        },
        {
            title: intl('CRSM_23'),
            dataIndex: 'ICR',
            align: 'center',
            render:(item: BigNumber)=>(
                <div>{formatPercent(item.times(100), { precision: 2, roundMode: BigNumber.ROUND_DOWN})}</div>
            )
        },
        {
            title: intl('CRSM_13'),
            dataIndex: 'TRGCR',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 80 },
            }),
            onCell: () => ({
                style: { minWidth: 80 },
            }),
            render:(item: BigNumber)=>(
                <div>{formatPercent(item.times(100), { precision: 2, roundMode: BigNumber.ROUND_DOWN})}</div>
            )
        },
        {
            title: intl('CRSM_14'),
            dataIndex: 'TARCR',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 80 },
            }),
            onCell: () => ({
                style: { minWidth: 80 },
            }),
            render:(item: BigNumber)=>(
                <div>{formatPercent(item.times(100), { precision: 2, roundMode: BigNumber.ROUND_DOWN})}</div>
            )
        },
        {
            title: intl('CRSM_15'),
            dataIndex: 'MAX_TARCR',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 110 },
            }),
            onCell: () => ({
                style: { minWidth: 110 },
            }),
            render:(item: BigNumber)=>(
                <div>{formatPercent(item.times(100), { precision: 2, roundMode: BigNumber.ROUND_DOWN})}</div>
            )
        },
        {
            title: intl('CRSM_16'),
            dataIndex: 'DEBT_GAS_COMPENSATION',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 90 },
            }),
            onCell: () => ({
                style: { minWidth: 90 },
            }),
            render:(item: BigNumber)=>(
                <div>{formatCryptoBalance(item)}</div>
            )
        },
        {
            title: intl('CRSM_25'),
            dataIndex: 'deposits',
            align: 'center',
            render:(item: BigNumber)=>(
                <div>{formatCryptoBalance(item)}</div>
            )
        },
        {
            title: intl('CRSM_26'),
            dataIndex: 'yieldGains',
            align: 'center',
            render:(item: BigNumber)=>(
                <div>{formatCryptoBalance(item)}</div>
            )
        },
        {
            title: intl('CRSM_27'),
            dataIndex: 'debtTokenBalance',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 90 },
            }),
            onCell: () => ({
                style: { minWidth: 90 },
            }),
            render:(item: BigNumber)=>(
                <div>{formatCryptoBalance(item)}</div>
            )
        },
        {
            title: intl('CRSM_28'),
            dataIndex: 'collateralGains',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 80 },
            }),
            onCell: () => ({
                style: { minWidth: 80 },
            }),
            render:(item: BigNumber)=>(
                <div>{formatCryptoBalance(item)}</div>
            )
        },
        {
            title: intl('CRSM_29'),
            dataIndex: 'trove_Coll',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 80 },
            }),
            onCell: () => ({
                style: { minWidth: 80 },
            }),
            render:(item: BigNumber)=>(
                <div>{formatCryptoBalance(item)}</div>
            )
        },
        {
            title: intl('CRSM_30'),
            dataIndex: 'trove_debt',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 80 },
            }),
            onCell: () => ({
                style: { minWidth: 80 },
            }),
            render:(item: BigNumber)=>(
                <div>{formatCryptoBalance(item)}</div>
            )
        },
        {
            title: intl('CRSM_31'),
            dataIndex: 'trove_interest',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 90 },
            }),
            onCell: () => ({
                style: { minWidth: 90 },
            }),
            render:(item: BigNumber)=>(
                <div>{formatCryptoBalance(item)}</div>
            )
        },
        {
            title: intl('public_1'),
            key: 'action',
            fixed: 'right',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 80 },
            }),
            onCell: () => ({
                style: { minWidth: 80 },
            }),
            render: (item: any) => (
                <div className={styles.action}>
                    <Button type="primary" onClick={()=>clickDeposit(item)}>{intl('CRSM_32')}</Button>
                    <Button type="primary" onClick={()=>clickWithdrawFromSP(item)}>{intl('CRSM_33')}</Button>
                    <Button type="primary" onClick={()=>clickClaimYield(item)}>{intl('CRSM_34')}</Button>
                    <Button type="primary" onClick={()=>clickUpdateCR(item)}>{intl('CRSM_36')}</Button>
                    <Button type="primary" onClick={()=>clickclaimAllCollateralGains(item)}>{intl('CRSM_35')}</Button>
                    <Button type="primary" onClick={()=>clickCommitDebtGas(item)}>{intl('CRSM_37')}</Button>
                    <Button type="primary" onClick={()=>clickAcceptDebtGas(item)}>{intl('CRSM_38')}</Button>
                    <Button type="primary" onClick={()=>clickWithdraw(item)}>{intl('CRSM_39')}</Button>
                </div>
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
        const res = await getCRSMList(window.YalaEthProvider, walletAddress)
        console.log(res)
        const results = res.list.map((item:any, index: number)=>{
            return{
                index: index + 1,
                crsmAddr: item.crsm,
                id: item.crsmState.troveId.toString(),
                ICR: amountFromWei(BigNumber(item.ICR.toString())),
                TRGCR: amountFromWei(BigNumber(item.crsmState.TRGCR.toString())),
                TARCR: amountFromWei(BigNumber(item.crsmState.TARCR.toString())),
                MAX_TARCR: amountFromWei(BigNumber(item.crsmState.MAX_TARCR.toString())),
                DEBT_GAS_COMPENSATION: amountFromWei(BigNumber(item.crsmState.DEBT_GAS_COMPENSATION.toString())),
                deposits: amountFromWei(BigNumber(item.crsmState.deposits.toString())),
                yieldGains: amountFromWei(BigNumber(item.crsmState.yieldGains.toString())),
                debtTokenBalance: amountFromWei(BigNumber(item.crsmState.debtTokenBalance.toString())),
                collateralGains: amountFromWei(BigNumber(item.crsmState.collateralGains.toString())),
                trove_Coll: amountFromWei(BigNumber(item.trove.coll.toString())),
                trove_debt: amountFromWei(BigNumber(item.trove.debt.toString())),
                trove_interest: amountFromWei(BigNumber(item.trove.interest.toString())),
            }
        })
        setDataSource(results)
        setLoading(false)
    }

    const clickDeposit = async (item: any) =>{
        console.log(item)
        setCrsmAddr(item.crsmAddr)
        setActionType(1)
        setOpenEdit(true)
        form.resetFields()
    }

    const clickWithdrawFromSP = async (item: any) =>{
        setCrsmAddr(item.crsmAddr)
        setActionType(2)
        setOpenEdit(true)
        form.resetFields()
        form.setFieldsValue({
            address: walletAddress
        })
    }

    const clickClaimYield = async (item: any) =>{
        setCrsmAddr(item.crsmAddr)
        setActionType(3)
        setOpenEdit(true)
        form.resetFields()
        form.setFieldsValue({
            address: walletAddress
        })
    }

    const clickclaimAllCollateralGains = async (item: any) =>{
        setCrsmAddr(item.crsmAddr)
        setActionType(4)
        setOpenEdit(true)
        form.resetFields()
        form.setFieldsValue({
            address: walletAddress
        })
    }

    const clickUpdateCR = async (item: any) =>{
        console.log(item)
        setCrsmAddr(item.crsmAddr)
        setOpenEdit2(true)
        form2.resetFields()
        form2.setFieldsValue({
            TRGCR: item.TRGCR.times(100),
            TARCR: item.TARCR.times(100),
            MAX_TARCR: item.MAX_TARCR.times(100)
        })
    }

    const clickCommitDebtGas = async (item: any) =>{
        console.log(item)
        setCrsmAddr(item.crsmAddr)
        setOpenEdit3(true)
        form3.resetFields()
        form3.setFieldsValue({
            debtGasCompensation: item.DEBT_GAS_COMPENSATION,
        })
    }

    const clickAcceptDebtGas = async (item: any) =>{
        console.log(item)
        const res: any = await acceptDebtGasCompensation(
            window.YalaEthProvider,
            item.crsmAddr,
        )
        console.log(res)
        if(res?.transactionHash){
            message.success(intl('public_13'))
            getList()
            setOpenEdit3(false)
        }
    }

    const clickWithdraw = async (item: any) =>{
        setCrsmAddr(item.crsmAddr)
        setActionType(5)
        setOpenEdit(true)
        form.resetFields()
        form.setFieldsValue({
            address: walletAddress
        })
    }

    const confirmEdit = ()=>{
        form.submit()
    }

    const confirmEdit2 = ()=>{
        form2.submit()
    }

    const confirmEdit3 = ()=>{
        form3.submit()
    }
        
    const onFinish = async (values: any)=>{
        console.log(values, crsmAddr)
        setEditLoading(true)
        let res: any
        if(actionType === 1){
            res = await depositToCRSM(
                window.YalaEthProvider,
                crsmAddr,
                amountToWei(BigNumber(values.amount)),
                walletAddress
            )
        }
        if(actionType === 2){
            res = await withdrawFromSPOT(
                window.YalaEthProvider,
                crsmAddr,
                amountToWei(BigNumber(values.amount)),
                values.address
            )
        }
        if(actionType === 3){
            res = await claimYield(
                window.YalaEthProvider,
                crsmAddr,
                values.address
            )
        }
        if(actionType === 4){
            res = await claimAllCollateralGains(
                window.YalaEthProvider,
                crsmAddr,
                values.address
            )
        }
        if(actionType === 5){
            res = await withdraw(
                window.YalaEthProvider,
                crsmAddr,
                amountToWei(BigNumber(values.amount)),
                values.address,
            )
        }
        console.log(res)
        if(res?.transactionHash){
            message.success(intl('public_13'))
            getList()
            setOpenEdit(false)
        }
        setEditLoading(false)
    }

    const onFinish2 = async (values: any)=>{
        console.log(values)
        setEditLoading(true)
        const res: any = await updateCR(
            window.YalaEthProvider,
            crsmAddr,
            amountToWei(BigNumber(values.TRGCR), 16),
            amountToWei(BigNumber(values.TARCR), 16),
            amountToWei(BigNumber(values.MAX_TARCR), 16),
        )
        console.log(res)
        if(res?.transactionHash){
            message.success(intl('public_13'))
            getList()
            setOpenEdit2(false)
        }
        setEditLoading(false)
    }

    const onFinish3 = async (values: any)=>{
        console.log(values)
        setEditLoading(true)
        const res: any = await commitDebtGasCompensation(
            window.YalaEthProvider,
            crsmAddr,
            amountToWei(BigNumber(values.debtGasCompensation)),
        )
        console.log(res)
        if(res?.transactionHash){
            message.success(intl('public_13'))
            getList()
            setOpenEdit3(false)
        }
        setEditLoading(false)
    }

    return(
        <div className={styles.div_all}>
            <ConnectWallet getList={getList} />
            <div className={styles.table}>
                {/* @ts-ignore */}
                <Table dataSource={dataSource} rowKey="id" loading={loading} columns={columns} scroll={{ x: 'auto', y: 580 }} />
            </div>
            <Modal
                title={intl(actionType === 1 ? 'CRSM_32' : actionType === 2 ? 'CRSM_33' : actionType === 3 ? 'CRSM_34' : actionType === 4 ? 'CRSM_35' : 'CRSM_39')}
                width= '500px'
                open={openEdit}
                confirmLoading={editLoading}
                onOk={confirmEdit}
                onCancel={()=>setOpenEdit(false)}
            >
                <Form
                    className={styles.form}
                    form={form}
                    name="action1"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    {
                        (actionType !== 1) && <Form.Item
                            label={intl('CRSM_40')}
                            name="address"
                            rules={[{required: true, message: intl('CRSM_41')}]}
                        >
                            <Input allowClear placeholder={intl('CRSM_41')} />
                        </Form.Item>
                    }
                    {
                        (actionType === 1 || actionType === 2 || actionType === 5) && <Form.Item
                            label={intl('CRSM_17')}
                            name="amount"
                            rules={[{required: true, message: intl('CRSM_22')}]}
                        >
                            <InputNumber className={styles.from_number} min={0} placeholder={intl('CRSM_22')} />
                        </Form.Item>
                    }
                </Form>
            </Modal>
            <Modal
                title={intl('CRSM_33')}
                width= '500px'
                open={openEdit2}
                confirmLoading={editLoading}
                onOk={confirmEdit2}
                onCancel={()=>setOpenEdit2(false)}
            >
                <Form
                    className={styles.form}
                    form={form2}
                    name="action2"
                    onFinish={onFinish2}
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
                </Form>
            </Modal>
            <Modal
                title={intl('CRSM_37')}
                width= '500px'
                open={openEdit3}
                confirmLoading={editLoading}
                onOk={confirmEdit3}
                onCancel={()=>setOpenEdit3(false)}
            >
                <Form
                    className={styles.form}
                    form={form3}
                    name="action3"
                    onFinish={onFinish3}
                    autoComplete="off"
                >
                    <Form.Item
                        label={intl('CRSM_16')}
                        name="debtGasCompensation"
                        rules={[{required: true, message: intl('CRSM_21')}]}
                    >
                        <InputNumber className={styles.from_number} min={0} placeholder={intl('CRSM_21')} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}