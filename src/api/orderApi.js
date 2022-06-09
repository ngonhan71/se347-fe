import axiosClient from "./axiosClient"

const orderApi = {
    getAll: ({page = 1, limit, sortByDate}) => {
        const url = 'orders/'
        return axiosClient.get(url, { params: {page, limit, sortByDate}})
    },
    getAllByUser: ({page = 1, limit, sortByDate, userId}) => {
        const url = `orders/user/${userId}`
        return axiosClient.get(url, { params: {page, limit, sortByDate}})
    },
    getById: (id) => {
        const url = `orders/${id}`
        return axiosClient.get(url)
    },
    getByIdAndUser: (id, userId) => {
        const url = `orders/${id}/user/${userId}`
        return axiosClient.get(url)
    },
    createOrder: (data) => {
        const url = `orders/`
        return axiosClient.post(url, data)
    },
    updateStatusById: (id, data) => {
        const url = `orders/${id}/status`
        return axiosClient.put(url, data)
    },
    getRevenueLifeTime: () => {
        const url = `orders/chart/revenue/lifetime`
        return axiosClient.get(url)
    },
    getCountOrderLifeTime: () => {
        const url = `orders/chart/countorder/lifetime`
        return axiosClient.get(url)
    },
    getBestSeller: () => {
        const url = `orders/chart/product/bestseller`
        return axiosClient.get(url)
    },

}

export default orderApi