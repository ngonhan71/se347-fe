import axiosClient from "./axiosClient"

const flowertypeApi = {

    getAll: ({page, limit}) => {
        const url = 'flowertypes/'
        return axiosClient.get(url, { params: {page, limit}})
    },

}

export default flowertypeApi