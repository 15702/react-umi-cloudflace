import React, { useEffect, useState, Fragment } from 'react';
import styles from './index.less';
import { Outlet, setLocale , getLocale, } from 'umi';
import { apiDataView, apiDataVault, apiDataWallet, apiDatacdp } from '@/api/statistics'

export default () => {

    return(
        <div className={styles.div_all}>
            <Outlet />
        </div>
    )
}