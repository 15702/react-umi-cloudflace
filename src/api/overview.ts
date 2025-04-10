import request from '@/utils/request'

export function apiDataPage(startTime:string, endTime: string, skip: number, limit: number, sort: object) {
    return request({
        url: '/admin/dashboardInfo/page',
        method: 'get',
        data: {startTime, endTime, skip, limit, sort}
    })
}

export function apiDatadownload(startTime:string, endTime: string, sort: object, action: string = 'csv') {
    return request({
        url: '/admin/dashboardInfo/download',
        method: 'get',
        responseType: 'arraybuffer',
        data: {startTime, endTime, sort, action}
    }).then((res: any) => {
      const BOM = '\uFEFF';
      const decodedText = BOM + new TextDecoder('utf-8').decode(res);
      const blob = new Blob([decodedText], {
          type: 'text/csv;charset=utf-8'
      });
      const objectURL = URL.createObjectURL(blob)
      let btn: HTMLAnchorElement | null = document.createElement('a')
      btn.download = 'overview.' + action
      btn.href = objectURL
      btn.click()
      URL.revokeObjectURL(objectURL)
      btn = null
      return res
    })
}