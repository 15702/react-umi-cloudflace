import request from '@/utils/request'

export function apiDatapanel() {
  return request({
    url: '/admin/custody/bridge/v2/datapanel',
    method: 'get',
  })
}

export function apiDepositList(page: number = 1, size: number = 10, order: string = 'DESC', begin?: number, end?: number) {
    return request({
        url: '/admin/custody/bridge/v2/deposit/list',
        method: 'get',
        data: {page, size, begin, end, order}
    })
}

export function apiDepositAdd(name: string, address: string, depositAmount: number, depositMemo: string, depositScriptAddress: string
    , depositTxid: string, locktime: number, toAddress: string, type: string
) {
  return request({
    url: '/admin/custody/bridge/v2/deposit/add',
    method: 'post',
    data: {name, address, depositAmount, depositMemo, depositScriptAddress, depositTxid, locktime, toAddress, type}
  })
}

export function apiDepositConfirm(id: string) {
  return request({
    url: '/admin/custody/bridge/v2/deposit/confirm',
    method: 'post',
    data: {id}
  })
}

export function apiDepositUpdate(id: string, name: string, address: string, depositAmount: number, depositMemo: string, depositScriptAddress: string
    , depositTxid: string, locktime: number, toAddress: string, type: string
) {
    return request({
      url: '/admin/custody/bridge/v2/deposit/update',
      method: 'post',
      data: {id, name, address, depositAmount, depositMemo, depositScriptAddress, depositTxid, locktime, toAddress, type}
    })
}

export function apiWithdrawAdd(depositId: string) {
    return request({
      url: '/admin/custody/bridge/v2/withdraw/request/add',
      method: 'post',
      data: {depositId}
    })
}

export function apiWithdrawList(page: number = 1, size: number = 10, order: string = 'DESC', begin?: number, end?: number, address?: string, status?: string) {
    return request({
      url: '/admin/custody/bridge/v2/withdraw/request/list',
      method: 'get',
      data: {address, status, begin, end, order, page, size}
    })
}