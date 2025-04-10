import request from '@/utils/request'

export function previewByUrl(url:string) {
  return request({
    url: '/admin/news/previewByUrl',
    method: 'get',
    data: {url},
  })
}

export function addNews(data: any) {
  return request({
    url: '/admin/news/add',
    method: 'post',
    data: data,
  })
}

export function delNews(id: string) {
  return request({
    url: '/admin/news/del',
    method: 'post',
    data: {id},
  })
}

export function updateNews(data: any) {
  return request({
    url: '/admin/news/update',
    method: 'post',
    data: data
  })
}

export function pageNews(skip: number, limit: number) {
    return request({
      url: '/admin/news/page',
      method: 'get',
      data: {skip, limit}
    })
  }