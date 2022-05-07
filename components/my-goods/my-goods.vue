<template>
	<view>
		<view class="goods-item">

			<view class="goods-item-left">
				<radio :checked="item.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
				<image :src="item.goods_small_logo || defaultPic" class="goods_pic"></image>
			</view>
			<view class="goods-item-right">
				<view class="goods-name">
					{{item.goods_name}}
				</view>
				<view class="goods-info-box">
					<!-- 价格 -->
					<view class="goods-prcie">
						￥{{item.goods_price | toFixed}}
					</view>
					<!-- 数字选择框 -->
					<uni-number-box :min="1" :value="item.goods_count" v-if="showNum" @change="numChageHandler">
					</uni-number-box>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-goods",
		props: {
			item: {
				type: Object,
				default: {}
			},
			showRadio: {
				type: Boolean,
				//默认不展示radio组件
				default: false
			},
			showNum: {
				type: Boolean,
				//默认不显示数字框组件
				default: false
			}

		},

		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'

			};
		},
		filters: {
			toFixed(num) {
				return Number(num).toFixed(2)
			}
		},
		methods: {
			//这是radio组件的点击事件处理函数
			radioClickHandler() {
				this.$emit('radio-change', {
					goods_id: this.item.goods_id,
					goods_state: !this.item.goods_state
				})
			},
			//数字输入框点击事件的处理函数
			numChageHandler(val) {
				//console.log(val);
				this.$emit('num-change', {
					goods_id: this.item.goods_id,
					goods_count: +val 
				})
			}
		},

	}
</script>

<style lang="scss">
	.goods-item {
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;
		display: flex;

		.goods-item-left {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-right: 5px;

			.goods_pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.goods-info-box {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.goods-prcie {
					font-size: 16px;
					color: #C00000;
				}
			}
		}
	}
</style>
