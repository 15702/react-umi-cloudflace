import React, { useEffect, useState, Fragment } from 'react';
import styles from './index.less';
import { Outlet } from 'umi';

export default () => {

    return(
        <div className={styles.div_all}>
            <Outlet />
        </div>
    )
}