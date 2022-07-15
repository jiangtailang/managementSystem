import mockReq from '@/utils/mockRequest'
const state = {
    mockData: {}
}
const actions = {
    async getMockData({ commit }) {
        let result = await mockReq.get('/home/list')
        if (result.code == 20000) {
            commit('GETMOCKDATA', result.data)
        }
    }
}
const mutations = {
    GETMOCKDATA(state, value) {
        state.mockData = value
    }
}
export default {
    state,
    actions,
    mutations
}