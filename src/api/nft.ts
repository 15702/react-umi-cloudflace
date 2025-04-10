import request from '@/utils/request'

export function apiAirdropList(skip: number, limit: number) {
  return request({
    url: "/admin/airdrop/list",
    method: "get",
    data: {skip, limit}
  })
}

export function apiAirdropUpdate(_id: string, stage: string, nftNumber: number, nftLevel: number){
  return request({
    url: '/admin/airdrop/update',
    method: "put",
    data: {_id, stage, nftNumber, nftLevel},
  })
}

export function apiAirdropDel(id: string){
    return request({
      url: '/admin/airdrop/del',
      method: "delete",
      data: {'_id': id},
    })
}

export function apiAirdropUploadAirdropList(form: FormData){
    return request({
        url: '/admin/airdrop/uploadAirdropList',
        headers: {'Content-Type': 'multipart/form-data'},
        method: "post",
        data: form,
    })
}