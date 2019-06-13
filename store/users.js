import constants from './../constants';

export const state = () => ({
    fetch: false,
    page: 1,
    count: 0,
    data: [],
    perPage: 10,
    error: null
})

export const mutations = {
    request(state) {
        state.fetch = true
    },
    success(state, { data, page, count }) {
        state.fetch = false
        state.data = data
        state.page = page
        state.count = count
        return state
    },
    failure(state, error) {
        state.fetch = false
        state.error = error
        return state
    }
}

export const actions = {
    async get({ commit, dispatch }, { page, keyword = '', refColumn = 'all' }) {
        await commit('request');
        try {
            const response = await fetch(constants.API_URL + '/user?page=' + page + '&keyword=' + keyword + '&ref_column=' + refColumn)
            const dataToJson = await response.json()
            if (dataToJson.status === 'success') {
                await commit('success', { data: dataToJson.data.rows, page: parseInt(dataToJson.data.page), count: dataToJson.data.count })
            } else {
                throw 'Error Response API'
            }
        } catch (e) {
            alert(e.message)
            await commit('failure', e.message)
        }
    },
    async create({ state, commit, dispatch }, { user, callback }) {
        await commit('request');
        try {
            const response = await fetch(constants.API_URL + '/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            const dataToJson = await response.json()
            if (dataToJson.status === 'success') {
                alert('User has been created')
                await dispatch('get', { page: state.page })
                callback();
            } else {
                throw 'Error Response API'
            }
        } catch (e) {
            alert('Failed for create user')
            await commit('failure', e.message)
            callback();
        }
    },
    async update({ state, commit, dispatch }, { user, callback }) {
        await commit('request');
        try {
            const response = await fetch(constants.API_URL + '/user/' + user.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            const dataToJson = await response.json()
            if (dataToJson.status === 'success') {
                alert('User has been updated')
                await dispatch('get', { page: state.page })
                callback();
            } else {
                throw 'Error Response API'
            }
        } catch (e) {
            alert('Failed for update user')
            await commit('failure', e.message)
        }
    },
    async destroy({ state, commit, dispatch }, { id }) {
        await commit('request');
        try {
            const response = await fetch(constants.API_URL + '/user/' + id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const dataToJson = await response.json()
            if (dataToJson.status === 'success') {
                alert('User has been deleted')
                await dispatch('get', { page: state.page })
            } else {
                throw 'Error Response API'
            }
        } catch (e) {
            alert('Failed for delete user')
            await commit('failure', e.message)
        }
    }
}