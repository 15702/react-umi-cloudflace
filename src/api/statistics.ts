import request from '@/utils/request'

export function apiDataView(date: string, skip: number | undefined, limit: number | undefined) {
  return request({
    url: '/admin/dataStatistics/dataView',
    method: 'get',
    data: {date, skip, limit}
  })
}

export function apiDataVault(date: string, skip: number | undefined, limit: number | undefined) {
  return request({
    url: '/admin/dataStatistics/dataVault',
    method: 'get',
    data: {date, skip, limit}
  })
}

export function apiDataWallet(date:string, skip: number | undefined, limit: number | undefined) {
    return request({
      url: '/admin/dataStatistics/dataWallet',
      method: 'get',
      data: {date, skip, limit}
    })
}

export function apiDatacdp(cdpi: string | undefined, address: string | undefined, startTime:string, endTime: string, skip: number, limit: number, sort: object) {
    return request({
        url: '/admin/dataStatistics/dataCdp',
        method: 'get',
        data: {cdpi, address, startTime, endTime, skip, limit, sort}
    })
}

export function apidataCaptain(address: string | undefined, chain: string, startTime:string, endTime: string, skip: number, limit: number, sort: object) {
  return request({
      url: '/admin/dataStatistics/dataCaptain',
      method: 'get',
      data: {address, chain, startTime, endTime, skip, limit, sort}
  })
}

export function apidataOpenBlindBoxRecord(address: string | undefined, chain: string, startTime:string, endTime: string, skip: number, limit: number, sort: object) {
  return request({
      url: '/admin/dataStatistics/dataOpenBlindBoxRecord',
      method: 'get',
      data: {address, chain, startTime, endTime, skip, limit, sort}
  })
}

export function apidownloadView(date: string, action: string = 'csv') {
    return request({
        url: '/admin/dataStatistics/downloadView',
        method: 'get',
        responseType: 'arraybuffer',
        data: {date, action}
    }).then((res: any) => {
      const BOM = '\uFEFF';
      const decodedText = BOM + new TextDecoder('utf-8').decode(res);
      const blob = new Blob([decodedText], {
          type: 'text/csv;charset=utf-8'
      });
      const objectURL = URL.createObjectURL(blob)
      let btn: HTMLAnchorElement | null = document.createElement('a')
      btn.download = 'downloadView.' + action
      btn.href = objectURL
      btn.click()
      URL.revokeObjectURL(objectURL)
      btn = null
      return res
    })
}

export function apidownloadVault(date: string, action: string = 'csv') {
    return request({
        url: '/admin/dataStatistics/downloadVault',
        method: 'get',
        responseType: 'arraybuffer',
        data: {date, action}
    }).then((res: any) => {
      const BOM = '\uFEFF';
      const decodedText = BOM + new TextDecoder('utf-8').decode(res);
      const blob = new Blob([decodedText], {
          type: 'text/csv;charset=utf-8'
      });
      const objectURL = URL.createObjectURL(blob)
      let btn: HTMLAnchorElement | null = document.createElement('a')
      btn.download = 'downloadVault.' + action
      btn.href = objectURL
      btn.click()
      URL.revokeObjectURL(objectURL)
      btn = null
      return res
  })
}

export function apidownloadWallet(date: string, action: string = 'csv') {
    return request({
        url: '/admin/dataStatistics/downloadWallet',
        method: 'get',
        responseType: 'arraybuffer',
        data: {date, action},
    }).then((res: any) => {
      const BOM = '\uFEFF';
      const decodedText = BOM + new TextDecoder('utf-8').decode(res);
      const blob = new Blob([decodedText], {
          type: 'text/csv;charset=utf-8'
      });
      const objectURL = URL.createObjectURL(blob)
      let btn: HTMLAnchorElement | null = document.createElement('a')
      btn.download = 'downloadWallet.' + action
      btn.href = objectURL
      btn.click()
      URL.revokeObjectURL(objectURL)
      btn = null
      return res
  })
}

export function apidownloadCdp(startTime:string, endTime: string, action: string = 'csv') {
  return request({
      url: '/admin/dataStatistics/downloadCdp',
      method: 'get',
      responseType: 'arraybuffer',
      data: {startTime, endTime, action}
  }).then((res: any) => {
    const BOM = '\uFEFF';
    const decodedText = BOM + new TextDecoder('utf-8').decode(res);
    const blob = new Blob([decodedText], {
        type: 'text/csv;charset=utf-8'
    });
    const objectURL = URL.createObjectURL(blob)
    let btn: HTMLAnchorElement | null = document.createElement('a')
    btn.download = 'downloadCdp.' + action
    btn.href = objectURL
    btn.click()
    URL.revokeObjectURL(objectURL)
    btn = null
    return res
  })
}

export function apidownloadCaptain(startTime:string, endTime: string, action: string = 'csv') {
  return request({
      url: '/admin/dataStatistics/downloadCaptain',
      method: 'get',
      responseType: 'arraybuffer',
      data: {startTime, endTime, action}
  }).then((res: any) => {
    const BOM = '\uFEFF';
    const decodedText = BOM + new TextDecoder('utf-8').decode(res);
    const blob = new Blob([decodedText], {
        type: 'text/csv;charset=utf-8'
    });
    const objectURL = URL.createObjectURL(blob)
    let btn: HTMLAnchorElement | null = document.createElement('a')
    btn.download = 'downloadCaptain.' + action
    btn.href = objectURL
    btn.click()
    URL.revokeObjectURL(objectURL)
    btn = null
    return res
  })
}

export function apidownloadOpenBlindBoxRecord(startTime:string, endTime: string, action: string = 'csv') {
  return request({
      url: '/admin/dataStatistics/downloadOpenBlindBoxRecord',
      method: 'get',
      responseType: 'arraybuffer',
      data: {startTime, endTime, action}
  }).then((res: any) => {
    const BOM = '\uFEFF';
    const decodedText = BOM + new TextDecoder('utf-8').decode(res);
    const blob = new Blob([decodedText], {
        type: 'text/csv;charset=utf-8'
    });
    const objectURL = URL.createObjectURL(blob)
    let btn: HTMLAnchorElement | null = document.createElement('a')
    btn.download = 'downloadOpenBlindBoxRecord.' + action
    btn.href = objectURL
    btn.click()
    URL.revokeObjectURL(objectURL)
    btn = null
    return res
  })
}