import request from '@/utils/request'

export function feedbackPage(data: any) {
    console.log(data)
  return request({
    url: '/admin/feedback/page',
    method: 'get',
    data: data
  })
}

export function feedbackUpdate(id: string, done: boolean) {
  return request({
    url: '/admin/feedback/update',
    method: 'post',
    data: {id, done}
  })
}
