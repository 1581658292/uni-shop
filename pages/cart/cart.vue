<template>
	<!-- 购物车区域 -->
	<view class="cart-container" v-if="cart.length !== 0">
		<!-- 收货地址组件 -->
		<my-address></my-address>
		<!-- 商品列表的标题区 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="30"></uni-icons>
			<!-- 右侧的文本 -->
			<text class="cart-title-text">购物车</text>
		</view>
		<!-- 滑动操作 -->
		<uni-swipe-action>
			<!-- 循环渲染购物车的当中的商品信息 -->
			<block v-for="(item,index) in cart" :key="index">
				<uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(item)">
					<my-goods :item="item" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler"
						@num-change="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		<!-- 使用自定义的结算组件 -->
		<my-settle></my-settle>
	</view>
	<!-- 空白购物车区域 -->
	<view class="empty-cart" v-else>
		<image src="/static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也~~</text>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#C00000'
					}
				}]

			};
		},
		mixins: [badgeMix],
		computed: {
			...mapState('m_cart', ['cart'])
		},
		methods: {
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			radioChangeHandler(e) {
				//console.log(e);
				this.updateGoodsState(e)
			},
			numberChangeHandler(e) {
				//console.log(e);
				this.updateGoodsCount(e)
			},
			swipeItemClickHandler(item) {
				console.log(item);
				this.removeGoodsById(item.goods_id)
			}
		},


	}
</script>

<style lang="scss">
	.cart-container {
		padding-bottom: 50px;
	}

	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		padding-left: 5px;
		border-bottom: 1px solid #EFEFEF;

		.cart-title-text {
			font-size: 14px;
			margin-left: 10px;
		}
	}
	.empty-cart{
		display: flex;
		flex-direction:column;
		align-items: center;
		padding-top: 150px;
		.empty-img{
			width: 90px;
			height: 90px;
		}
		.tip-text{
			margin-top: 15px;
			font-size: 15px;
			color: gray;
		}
	}
</style>
