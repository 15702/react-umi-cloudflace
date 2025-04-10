import { useState, useEffect } from 'react';
import {message} from "antd";
import {currentEnv, Env} from "@/eth/deploy";
import { intl } from "@/utils";

interface Permissions {
  code: string
  name: string
  type: string
  _id: string
}

export default () => {
  const [ loginEmail, setLoginEmail ] = useState<string>('')
  const [ ApiOrButtonPermissions, setApiOrButtonPermissions ] = useState<Permissions[]>([])
  const [ walletAddress, setWalletAddress ] = useState<string>('')

  useEffect(()=>{
    
  }, [])

  const getApiOrButtonPermissions = (code: string) => {
    const isAllowed = extractCode(ApiOrButtonPermissions).includes(code)
    return isAllowed
  }

  const extractCode = (list: any) => {
    let paths: any = [];
    list.forEach((route: any) => {
      paths.push(route.code);
    });
    return paths;
  };

  return {
    loginEmail, setLoginEmail, ApiOrButtonPermissions, setApiOrButtonPermissions, getApiOrButtonPermissions, walletAddress, setWalletAddress
  };
}
