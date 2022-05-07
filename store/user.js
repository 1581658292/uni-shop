export default {
	namespaced: true,
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}')
	}),
	mutations: {
		//更新收货地址
		updateAddress(state, address) {
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		}
	},
	getters: {
		//拼接的收货地址
		addStr(state) {
			if (!state.address.provinceName) return ''
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address
				.detailInfo
		},
	}

}
