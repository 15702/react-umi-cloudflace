import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import { Outlet } from 'umi';

export default () => {

    return(
        <div className={styles.div_all}>
            <Outlet />
        </div>
    )
}