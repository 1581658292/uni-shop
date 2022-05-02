<template>
	<!-- 搜索框 -->
	<view>
		<view class="search-box">
			<uni-search-bar @confirm="search" @input="input" :radius="100" placeholder="请输入搜索内容" cancelButton="none">
			</uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="suggest-list" v-if="searchResult.length !== 0">
			<view class="suggest-item" v-for="(item,index) in searchResult" :key="index" @click="gotoDatail(item)">
				<view class="goods-name">
					{{item.goods_name}}
				</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史区域 -->
		<view class="history-box" v-else>
			<!-- 标题区域-->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="20" @click="clean"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item,index) in histories" :key="index"
				@click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>

	</view>


</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				//关键字
				kw: '',
				//搜索的结果列表
				searchResult: [],
				//搜索历史数据
				historyList: []
			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		methods: {
			//input输入事件的处理函数
			input(e) {
				//console.log(e.value);
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.kw = e
					this.getSearchList()
				}, 500)

			},
			async getSearchList() {
				//
				if (this.kw === '') {
					this.searchResult = []
					return
				}
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.kw
				})
				console.log(res);
				if (res.meta.status !== 200) {
					return uni.$showMsg()
				}
				this.searchResult = res.message
				//保存搜索历史记录
				this.saveHistoryList()

			},
			gotoDatail(item) {
				//console.log(item.goods_id);
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			},
			saveHistoryList() {
				//this.historyList.push(this.kw)
				const set = new Set(this.historyList)
				set.delete(this.kw)
				set.add(this.kw)
				this.historyList = Array.from(set)
				//对搜索历史进行存储
				uni.setStorageSync('kw', JSON.stringify(this.historyList))

			},
			clean() {
				this.historyList = [];
				uni.setStorageSync('kw','[]')
				
			},
			gotoGoodsList(kw){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?query='+kw
				})
			}
		},
		computed: {
			histories() {
				return [...this.historyList].reverse()
			}

		}
	}
</script>

<style lang="scss">
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999
	}

	.suggest-list {
		padding: 0 5px;

		.suggest-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 12px;
			padding: 12px 0;
			border-bottom: 1px solid #efefef;

			.goods-name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			height: 40px;
			align-items: center;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>
