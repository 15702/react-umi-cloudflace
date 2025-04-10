import axios from 'axios'
import { message as Message } from 'antd'
import { history } from 'umi';
import {currentEnv, Env} from "@/eth/deploy";
const qs = require('qs');

const host = () => {
  switch (currentEnv) {
    // @ts-ignore
    case Env.TESTINNER: {
      return 'https://2ejpnc8qpxbc5k6f4fd6b5msbd-test3.yala.org/' 
    }
    // @ts-ignore
    case Env.TESTNET: {
      return 'https://api-testnet.yala.org/'
    }
    // @ts-ignore
    case Env.PROD: {
      return 'https://api-testnet.yala.org/'
    }
    default :{
      return ''
    }
  }
}

axios.defaults.headers['Content-Type'] = 'application/json'
const service = axios.create({
  baseURL: host(),
  timeout: 120000
})

service.interceptors.request.use(config => {
  const isToken = (config.headers || {}).isToken === false
  if (!isToken) {
    config.headers['Authorization'] = "Bearer " + localStorage.getItem("Authorization")
  }
  console.log(config)
  if (config.method !== 'post' && config.data) {
    console.log(config.data)
    // const queryString = new URLSearchParams(config.data).toString()
    const queryString = qs.stringify(config.data);
    let url = config.url + '?'+ queryString; 
    config.url = url;
  }
  return config
}, error => {
    console.log(error)
    Promise.reject(error)
})

service.interceptors.response.use(res => {
  console.log(res)
  const responseData = res.data 
    console.log(responseData)
    if(res.status === 200 && !responseData.code && responseData.code != 0){
      return responseData
    }
    if(responseData.code != 0 || res.status !== 200){
      console.log(responseData.code)
      if(responseData.code == 101 || responseData.code == 401){
        localStorage.removeItem('Authorization');
        history.replace('/login')
      }
      Message.error(responseData.msg)
      return undefined
    }
    return responseData
  },
  error => {
    let { message, response } = error;
    Message.error(message, 5)
    console.log(error)
    if(response?.status == 401 || response?.status == 101){
      localStorage.removeItem('Authorization');
      history.replace('/login')
    }
    return error
  }
)

export default service
