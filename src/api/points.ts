import request from '@/utils/request'

export function apiPointsManualRewardPoints(form: FormData){
    return request({
        url: '/admin/points/manualRewardPoints',
        headers: {'Content-Type': 'multipart/form-data'},
        method: "post",
        data: form,
    })
}