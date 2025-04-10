import React, { useState } from "react";
import styles from './login.less';
import { history, useModel, setLocale , getLocale, } from 'umi';
import { intl } from "@/utils";
import { Input, Button, message } from "antd";
import { UserOutlined, LockTwoTone } from '@ant-design/icons';
import { apiLogin } from '@/api/admin';

export default function HomePage() {
  const { setLoginEmail } = useModel('global');
  const [ loading, setLoading ] = useState<boolean>(false);
  const [ email, setEmail ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');

  const [ messageApi, contextHolder ] = message.useMessage();

  const onLogin = async () =>  {
    if(!email){
      message.error(intl('login_4'))
      return
    }
    if (!password) {
      message.error(intl('login_5'))
      return
    }
    setLoading(true)
    const apiLoginRes: any = await apiLogin(email, password)
    console.log(apiLoginRes)
    if (apiLoginRes?.code === 0) {
      setLoginEmail(apiLoginRes.data.email)
      localStorage.setItem("Authorization", apiLoginRes.data.token)
      localStorage.setItem("loginEmail", apiLoginRes.data.email)
      history.push('/');
    }
    setLoading(false)
  };

  const switchLocale = () => {
    const locale = getLocale()
    if(locale == 'en-US'){
      setLocale('zh-CN')
    }
    if(locale == 'zh-CN'){
      setLocale('en-US')
    }
  }

  return (
    <div className={styles.login}>
      {contextHolder}
      <div className={styles.loginCenter} >
          <h3 className={styles.loginTitle}>{intl('login_1')}</h3>
          <div className={styles.locale} onClick={()=>switchLocale()}>{intl('header_1')}</div>
          <div className={styles.input_all}>
            <div className={styles.input_all_img} title={intl('login_2')}>
              <UserOutlined style={{color: '#21c789'}} /><Input className={styles.input} placeholder={intl('login_2')} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles.input_all_img} title={intl('login_3')}>
              <LockTwoTone twoToneColor={'#21c789'} /><Input className={styles.input} type="password" placeholder={intl('login_3')} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button className={styles.loginButton} onClick={onLogin} loading={loading} title='login'>{intl('login_6')}</Button>
          </div>
      </div>
    </div>
  );
}
