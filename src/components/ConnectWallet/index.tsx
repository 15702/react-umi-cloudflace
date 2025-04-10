import React,{ useEffect, useState } from "react";
import styles from "./index.less";
import { useModel } from 'umi';
import { Button } from "antd";
import { intl } from "@/utils";
import { getEthWalletAddress } from '@/eth/eth';
import { eventBus } from '@/utils';

export default function Access (props: any){
    const {walletAddress, setWalletAddress} = useModel('global');
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const handleCustomEvent = (message: string) => {
          console.log(message);
            if (message == 'ETH') {
                setWalletAddress('');
            }
        };
        eventBus.addListener('emitAdderss', handleCustomEvent);
        return () => {
          eventBus.removeListener('emitAdderss', handleCustomEvent);
        };
    }, [walletAddress]);

    const connectWallet = async (item: any) => {
        setLoading(true)
        const address = await getEthWalletAddress()
        console.log(address)
        setWalletAddress(address)
        setLoading(false)
    }

    return(
        <div className={styles.connect_div}>
            <Button type="primary" loading={loading} onClick={connectWallet}>{intl( walletAddress ? 'CRSM_12' : 'CRSM_4')}</Button>
            { walletAddress && <Button type="primary" loading={loading} onClick={props.getList}>{intl('CRSM_11')}</Button>}
            { walletAddress && <div>{intl('CRSM_3')}: {walletAddress}</div>}
        </div>
    )
}