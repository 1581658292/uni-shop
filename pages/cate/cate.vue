<template>
	<view>
		<!-- 使用定义的搜索组件 -->
		<my-search @click="gotoSearch"></my-search>
		<view class="scroll-view-container">
			<!-- 左侧滑动区域 -->
			<scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
				<block v-for="(item,index) in cateList" :key="index">
					<view :class="['left-scroll-item',index===active?'active':'']" @click="activeChange(index)">
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<!-- 右侧滑动区域 -->
			<scroll-view scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-level2" v-for="(item2,index2) in cateLevel2">
					<!-- 二级分类 -->
					<view class="cate-lv2-title">
						/{{item2.cat_name}}/
					</view>
					<!-- 当前二级分类的三级分类 -->
					<view class="cate-lv3-list">
						<!--三级分类的item -->
						<view class="cate-lv3-item" v-for="(item3,index3) in item2.children" :key="index3"
							@click="getGoodsList(item3)">
							<!-- 三级分类的图片 -->
							<image :src="item3.cat_icon"></image>
							<text>{{item3.cat_name}}</text>
						</view>

					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import badge from '@/mixins/tabbar-badge.js'
	export default {
		mixins: [badge],
		data() {
			return {
				//当前设备可用的高度
				wh: 0,
				// 分类数据列表
				cateList: [],
				active: 0,
				//2级分类列表
				cateLevel2: [],
				//滚动条距离顶部的距离
				scrollTop: 0
			}
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync()
			//console.log(sysInfo);
			this.wh = sysInfo.windowHeight - 50
			this.getCateList()
		},
		methods: {
			async getCateList() {
				// 发起请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				// 判断是否获取失败
				if (res.meta.status !== 200) return uni.$showMsg()
				// 转存数据
				this.cateList = res.message
				//为2级分类赋值
				this.cateLevel2 = res.message[0].children
			},
			activeChange(index) {
				this.active = index
				//重新为2级分类赋值
				this.cateLevel2 = this.cateList[index].children
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			//跳转到商品列表页面
			getGoodsList(item3) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				})
			},
			//跳转到搜索页面
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.left-scroll-view {
			width: 120px;
		}
	}



	.left-scroll-item {
		background-color: #F7F7F7;

		line-height: 60px;
		text-align: center;
		font-size: 12px;

		&.active {
			background-color: #fff;
			position: relative;

			&::before {
				content: "";
				display: block;
				width: 3px;
				height: 30px;
				background-color: #C00000;
				position: absolute;
				top: 50%;
				transform: translateY(-50%);

			}
		}
	}

	.cate-lv2-title {
		background-color: #fff;
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}

	.cate-lv3-list {
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;

		.cate-lv3-item {
			width: 33.33%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			image {
				width: 60px;
				height: 60px;
			}

			text {
				font-size: 12px
			}
		}
	}
</style>
