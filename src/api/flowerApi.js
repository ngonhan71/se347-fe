import axiosClient from "./axiosClient"

const flowerApi = {

    getAll: ({occasion, page = 1, limit, sortByPrice, sortByDate, key}) => {
        const url = 'flowers/'
        return axiosClient.get(url, { params: {occasion, page, limit, sortByPrice, sortByDate, key}})
    },
    getById: (id) => {
        const url = `flowers/${id}`
        return axiosClient.get(url)
    },
    getBySlug: (slug) => {
        const url = `flowers/slug/${slug}`
        return axiosClient.get(url)
    },
    search: (key) => {
        const url = `flowers/search`
        return axiosClient.get(url, { params: {key}})
    },
    createFlower: (data) => {
        const url = `flowers/`
        return axiosClient.post(url, data)
    },
    updateFlower: (id, data) => {
        const url = `flowers/${id}`
        return axiosClient.put(url, data)
    },
    deleteFlower: (id) => {
        const url = `flowers/${id}`
        return axiosClient.delete(url)
    }

}

export default flowerApi