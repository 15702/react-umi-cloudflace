import request from '@/utils/request'

export function apiRolePage(){
    return request({
        url: '/admin/roles/page',
        method: "GET",
    })
}

export function apiRoleAdd(name: string, des: string, permissions: string[]){
    return request({
        url: '/admin/roles/add',
        method: "POST",
        data: {name, des, permissions},
    })
}

export function apiRoleUpdate(id: string, des: string, permissions: string[]){
    return request({
        url: '/admin/roles/update',
        method: "PUT",
        data: {id, des, permissions},
    })
}

export function apiRoleDetail(id: string){
    return request({
        url: '/admin/roles/detail',
        method: "GET",
        data: {id},
    })
}

export function apiRoleDel(id: string){
    return request({
        url: '/admin/roles/del',
        method: "DELETE",
        data: {id},
    })
}