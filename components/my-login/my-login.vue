<template>
	<view class="login-container">
		<!-- 提示登陆的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登陆按钮 -->
		<button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getuserinfo">一键登录</button>
		<!-- 登陆提示 -->
		<text class="tips-text">登陆之后尽享更多权益</text>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		name: "my-login",
		computed: {
			...mapState('m_user', ['redirectInfo'])
		}
		data() {
			return {

			};
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			//用户授权之后,获取用户的基本信息
			getuserinfo(e) {
				console.log(e);
				// 判断是否获取用户信息成功
				if (e.detail.errMsg === 'getUserInfo:fail auth deny') return uni.$showMsg('您取消了登录授权！')

				// 获取用户信息成功， e.detail.userInfo 就是用户的基本信息
				console.log(e.detail.userInfo)
				this.updateUserInfo(e.detail.userInfo)
				// 获取登录成功后的 Token 字符串
				this.getToken(e.detail)
			},
			async getToken(info) {
				const [err, res] = await uni.login().catch(err => err)
				console.log(res);
				// 判断是否 uni.login() 调用失败
				if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
				console.log(err);
				// 准备参数对象
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}

				// 换取 token
				const {
					data: loginResult
				} = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				console.log(loginResult);
				if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
				//直接把token保存到vuex中
				console.log(loginResult);
				this.updateToken(loginResult.message.token)
				this.navigateBack()
			},
			navigateBack() {
				if (this.redirectInfo && this.redirectInfo.openType === 'switchTab'){
					uni.switchTab({
						url:this.redirectInfo.from,
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		},

	}
</script>

<style lang="scss">
	.login-container {
		display: flex;
		position: relative;
		overflow: hidden;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 750rpx;
		background-color: #F8F8F8;

		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #C00000;
		}

		.tips-text {
			font-size: 12px;
			color: gray;
		}

		&::after {
			content: '';
			display: block;
			position: absolute;
			bottom: 0;
			left: 0;
			border-radius: 100%;
			transform: translateY(50%);
			width: 100%;
			height: 40px;
		}


	}
</style>
