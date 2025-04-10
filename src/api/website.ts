import request from '@/utils/request'

export function noticesPage(skip: number, limit: number, done: boolean | undefined) {
  return request({
    url: '/admin/notices/page',
    method: 'get',
    data: {skip, limit, done}
  })
}

export function noticesUpdate(id: string, des: string, url: string, show: boolean, platform: string) {
  return request({
    url: '/admin/notices/update',
    method: 'post',
    data: {id, des, url, show, platform}
  })
}

export function noticesAdd(des: string, url: string, platform: string) {
  return request({
    url: '/admin/notices/add',
    method: 'post',
    data: {des, url, platform}
  })
}

export function noticesDel(id: string) {
  return request({
    url: '/admin/notices/del',
    method: 'post',
    data: {id}
  })
}