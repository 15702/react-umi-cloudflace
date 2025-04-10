import React, { useEffect } from "react";
// import { userList } from '@/api/login';
import { Button, Layout, Menu } from 'antd';
import styles from './index.less';
import { history } from 'umi';

import yalaJpg from '@/assets/img/yala.png';

export default function HomePage() {
  const getList = () =>{
    // userList({}).then(res=>{
    //   console.log(res)
    // })
  }
  useEffect(()=>{
    // getList()
  }, [])
  return (
    <div className={styles.index}>
      <h1>Yay! Welcome to yala! </h1>
      <img src={yalaJpg} className={styles.indexImg}  />
    </div>
  );
}
