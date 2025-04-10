import request from '@/utils/request'

export function apiLogin(email: string, password: string){
  return request({
    url: '/admin/admin/login',
    method: "POST",
    data: {email, password},
  })
}

export function apiAdminPage(){
  return request({
    url: '/admin/admin/page',
    method: "GET",
  })
}

export function apiAdminAdd(email: string, password: string, des: string, roles: string, captcha: string){
  return request({
    url: '/admin/admin/add',
    method: "POST",
    data: {email, password, des, roles, captcha},
  })
}

export function apiAdminUpdateOthers(id: string, password: string, des: string, disable: boolean, roles: string, captcha: string){
  return request({
    url: '/admin/admin/updateOthers',
    method: "PUT",
    data: {id, password, des, disable, roles, captcha},
  })
}

export function apiAdminUpdateSelf(password: string, des: string, captcha: string){
  return request({
    url: '/admin/admin/updateSelf',
    method: "PUT",
    data: {password, des, captcha},
  })
}

export function apiCaptchaSend(email: string, type: number){
  return request({
    url: '/admin/captcha/send',
    method: "POST",
    data: {email, type},
  })
}