<template>
	<view class="my-container">
		<!-- <my-login v-if="!token"></my-login> -->
		<my-userinfo ></my-userinfo>
	</view>
</template>

<script>
	import {
		mapState
	}
	from 'vuex'
	import badge from '@/mixins/tabbar-badge.js'
	export default {
		mixins: [badge],
		computed:{
			...mapState('m_user',['token'])
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
page,
.my-container{
	height: 100%;
}
</style>
