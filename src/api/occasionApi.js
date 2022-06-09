import axiosClient from "./axiosClient"

const occasionApi = {

    getAll: ({page, limit, sortByDate}) => {
        const url = 'occasions/'
        return axiosClient.get(url, { params: {page, limit, sortByDate}})
    },
    getBySlug: (slug) => {
        const url = `occasions/slug/${slug}`
        return axiosClient.get(url)
    },
    getById: (id) => {
        const url = `occasions/${id}`
        return axiosClient.get(url)
    },
    updateOccasion: (id, data) => {
        const url = `occasions/${id}`
        return axiosClient.put(url, data)
    },
    createOccasion: (data) => {
        const url = `occasions/`
        return axiosClient.post(url, data)
    },
    deleteOccasion: (id) => {
        const url = `occasions/${id}`
        return axiosClient.delete(url)
    }
    

}

export default occasionApi