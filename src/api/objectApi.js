import axiosClient from "./axiosClient"

const objectApi = {

    getAll: ({page, limit, sortByDate}) => {
        const url = 'objects/'
        return axiosClient.get(url, { params: {page, limit, sortByDate}})
    },
    getById: (id) => {
        const url = `objects/${id}`
        return axiosClient.get(url)
    },
    updateObject: (id, data) => {
        const url = `objects/${id}`
        return axiosClient.put(url, data)
    },
    createObject: (data) => {
        const url = `objects/`
        return axiosClient.post(url, data)
    },
    deleteObject: (id) => {
        const url = `objects/${id}`
        return axiosClient.delete(url)
    }
   
}

export default objectApi