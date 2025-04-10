import React,{ useEffect, useState } from "react";
import styles from "./index.less";
import { useModel } from 'umi';

export default function Access (props: any){
    const { ApiOrButtonPermissions, getApiOrButtonPermissions } = useModel('global');
    const [ isAccess, setIsAccess ] = useState(false);

    useEffect(()=>{
        if(props.code){
            const isAllowed = getApiOrButtonPermissions(props.code)
            setIsAccess(isAllowed)
        }
    }, [ApiOrButtonPermissions])

    return(
        <div>
            {
                isAccess ? props.view : null
            }
        </div>
    )
}