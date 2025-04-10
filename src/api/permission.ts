import request from '@/utils/request'

export function apiPermissionsList(filter?: object){
    return request({
      url: '/admin/permissions/list',
      method: "GET",
      data: {filter},
    })
}

export function apiPermissionsListOfMenu(){
    return request({
      url: '/admin/permissions/listOfMenu',
      method: "GET",
    })
}

export function apiPermissionsMenu(){
    return request({
        url: '/admin/permissions/minePermissionsOfMenu',
        method: "GET",
    })
}

export function apiPermissionsApiOrButton(){
    return request({
        url: '/admin/permissions/minePermissionsOfApiOrButton',
        method: "GET",
    })
}

interface Des{
    zh: string
    en: string
}

export function apiPermissionsAdd(code: string, des: Des, type: string, parent?: string){
    return request({
      url: '/admin/permissions/add',
      method: "POST",
      data: { code, des, type, parent },
    })
}

export function apiPermissionsUpdate(id: string, des: Des){
    return request({
      url: '/admin/permissions/update',
      method: "PUT",
      data: { id, des },
    })
}

export function apiPermissionsDel(id: string){
    return request({
        url: '/admin/permissions/del',
        method: "DELETE",
        data: {id},
    })
}