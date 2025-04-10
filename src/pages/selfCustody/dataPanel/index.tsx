import React, { useEffect, useState, Fragment } from 'react';
import styles from './index.less';
import { apiDatapanel } from '@/api/selfCustody'
import { Table, Tooltip } from "antd";
import { intl, formatTime, subAddr, formatCryptoBalance, formatPercent, amountToWei, amountFromWei } from "@/utils";
import BigNumber from 'bignumber.js'
 
export default function Withdraw () {
    const [loading, setLoading] = useState<boolean>(false)
    const [dataSource, setDataSource] = useState<[]>([]);
    const [totalInfo, setTotaInfo] = useState({
        btcDeposited: '0',
        btcPending: '0',
        depositInfos: [],
        ybtcBridged: '0',
        ybtcCollaterals: '0',
        ybtcPending: '0',
        yuDebts: '0',
        yuInSP: '0',
        yuInWallet: '0',
        totalPsmYuDebt: '0',
        totalYuInSP: '0',
        totalCdpYuDebt: '0',
        totalClaimableYBTC: '0',
        totalClaimableYU: '0',
    })

    const columns = [
        {
            key: 'index',
            dataIndex: 'index',
            align: 'center',
            // render: (_: any, item: any, index: number)=>(
            //     <div className={styles.tableText}>{index + 1}</div>
            // )
        },
        {
            title: intl('selfCustody_38'),
            dataIndex: 'btcAddress',
            align: 'center',
            width: '150px',
            render:(item: string)=>(
                <Tooltip placement="topLeft" title={item}>
                    <div>{subAddr(item)}</div>
                </Tooltip>
            )
        },
        {
            title: intl('selfCustody_39'),
            dataIndex: 'btcAmount',
            align: 'center',
            width: '150px',
            render:(item: any)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
        {
            title: intl('selfCustody_41'),
            dataIndex: 'evmAddress',
            align: 'center',
            width: '150px',
            render:(item: string)=>(
                <Tooltip placement="topLeft" title={item}>
                    <div>{subAddr(item)}</div>
                </Tooltip>
            )
        },
        {
            title: intl('selfCustody_42'),
            dataIndex: 'ybtcCollateral',
            align: 'center',
            width: '150px',
            render:(item: any)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
        {
            title: intl('selfCustody_43'),
            dataIndex: 'yudebt',
            align: 'center',
            width: '150px',
            render:(item: any)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
        {
            title: intl('selfCustody_44'),
            dataIndex: 'yuInSP',
            align: 'center',
            width: '150px',
            render:(item: any)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
        {
            title: intl('selfCustody_67'),
            dataIndex: 'yuInCRSMNotInSp',
            align: 'center',
            width: '150px',
            render:(item: any)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
        {
            title: intl('selfCustody_45'),
            dataIndex: 'yuInWallet',
            align: 'center',
            width: '150px',
            render:(item: any)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
        {
            title: intl('selfCustody_56'),
            dataIndex: 'claimableYBTC',
            align: 'center',
            width: '150px',
            render:(item: any)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
        {
            title: intl('selfCustody_57'),
            dataIndex: 'claimableYU',
            align: 'center',
            width: '150px',
            render:(item: any)=>(
                <div>{formatCryptoBalance(BigNumber(item))}</div>
            )
        },
        {
            title: intl('selfCustody_58'),
            dataIndex: 'crsmIntergrstion',
            align: 'center',
            onHeaderCell: () => ({
                style: { minWidth: 110 },
            }),
            onCell: () => ({
                style: { minWidth: 110 },
            }),
            render:(item: any)=>(
                <div>{item ? 'Yes' : 'No'}</div>
            )
        },
        {
            title: intl('selfCustody_59'),
            dataIndex: 'targetCR',
            align: 'center',
            width: '150px',
            render:(item: any)=>(
                <div>{formatPercent(BigNumber(item).times(100), { precision: 2, roundMode: BigNumber.ROUND_DOWN})}</div>
            )
        },
        {
            title: intl('selfCustody_60'),
            dataIndex: 'triggerCR',
            align: 'center',
            width: '150px',
            render:(item: any)=>(
                <div>{formatPercent(BigNumber(item).times(100), { precision: 2, roundMode: BigNumber.ROUND_DOWN})}</div>
            )
        },
        {
            title: intl('selfCustody_61'),
            dataIndex: 'maxTargetCR',
            align: 'center',
            width: '150px',
            render:(item: any)=>(
                <div>{formatPercent(BigNumber(item).times(100), { precision: 2, roundMode: BigNumber.ROUND_DOWN})}</div>
            )
        },
    ];
    
    useEffect(()=>{
        getList()
    },[]) 

    const getList = async () =>{
        setLoading(true)
        const res: any = await apiDatapanel();
        console.log(res)
        if(res?.code === 0 && res.data.depositInfos){
            const list = res.data.depositInfos.map((item: any, index: number)=>({...item, index: index + 1}))
            setDataSource(list)
            setTotaInfo(res.data)
        }else{
            setDataSource([])
        }
        setLoading(false)
    }

    return(
        <div className={styles.div_all}>
            <div className={styles.div_all_top}>
                <div className={styles.div_all_top_div}>
                    <div>{intl('selfCustody_46')}: {totalInfo.depositInfos.length}</div>
                    <div>{intl('selfCustody_47')}: {formatCryptoBalance(BigNumber(totalInfo.btcDeposited))}</div>
                    <div>{intl('selfCustody_48')}: {formatCryptoBalance(BigNumber(totalInfo.ybtcBridged))}</div>
                    <div>{intl('selfCustody_49')}: {formatCryptoBalance(BigNumber(totalInfo.btcPending))}</div>
                    <div>{intl('selfCustody_50')}: {formatCryptoBalance(BigNumber(totalInfo.ybtcCollaterals))}</div>
                    <div>{intl('selfCustody_51')}: {formatCryptoBalance(BigNumber(totalInfo.yuDebts))}</div>
                    <div>{intl('selfCustody_62')}: {formatPercent(BigNumber(totalInfo.yuDebts).div(BigNumber(totalInfo.totalPsmYuDebt).plus(BigNumber(totalInfo.totalYuInSP))).times(100), { precision: 2, roundMode: BigNumber.ROUND_DOWN})}</div>
                    <div>{intl('selfCustody_63')}: {formatPercent(BigNumber(totalInfo.yuDebts).div(BigNumber(totalInfo.totalCdpYuDebt)).times(100), { precision: 2, roundMode: BigNumber.ROUND_DOWN})}</div>
                </div>
                <div className={styles.div_all_top_div}>
                    <div>{intl('selfCustody_52')}: {formatCryptoBalance(BigNumber(totalInfo.yuInSP))}</div>
                    <div>{intl('selfCustody_64')}: {formatPercent(BigNumber(totalInfo.yuInSP).div(BigNumber(totalInfo.totalYuInSP)).times(100), { precision: 2, roundMode: BigNumber.ROUND_DOWN})}</div>
                    <div>{intl('selfCustody_53')}: {formatCryptoBalance(BigNumber(totalInfo.yuInWallet))}</div>
                    <div>{intl('selfCustody_65')}: {formatCryptoBalance(BigNumber(totalInfo.totalClaimableYBTC))}</div>
                    <div>{intl('selfCustody_66')}: {formatCryptoBalance(BigNumber(totalInfo.totalClaimableYU))}</div>
                </div>
            </div>
            <div className={styles.table}>
                {/* @ts-ignore */}
                <Table dataSource={dataSource} rowKey="index" loading={loading} columns={columns} scroll={{ x: 'max-content', y: 380 }} />
            </div>
        </div>
    )
}