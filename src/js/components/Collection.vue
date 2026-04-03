<template>
  <div class="">
    <!-- 検索ページのみ表示 -->
    <div v-if="isSearchPage" class="search-box">
      <h1 class="page__title">検索結果</h1>
      <input
        type="text"
        name="q"
        v-model="searchQuery"
        @keyup.enter="applySearch"
        placeholder="商品を検索"
      >
      <input type="hidden" name="type" value="product">
       <p class="search-box__result-text">{{ result_count }} 件の商品が見つかりました。</p>
    </div>
    <div class="row">
      <div class="col col-2 col-md-12">
        <filter-nav
          :facets="facets"
          :selected-values="selectedValues"
          :price-range="priceRange"
          :current-sort="currentSort"
          :search-query="searchQuery"
          @update:selected-values="selectedValues = $event"
          @apply-filter="applyFilter"
        />
      </div>
      <div class="col col-10 col-md-12">
        <div class="collection-items">
          <div v-if="loading">読み込み中...</div>
          <div v-else>
            <div v-if="products.length === 0 && isSearchPage === false" class="no-results">
              条件に該当する商品がありません。
            </div>
            <div v-else class="row products">
              <product-card
                v-for="product in products"
                :key="product.id"
                :product="product"
              />
            </div>
          </div>
          <Pagination
            v-if="pagination.pages > 1 && !loading"
            :current-page="pagination.page || 1"
            :total-pages="pagination.pages || 1"
            :asset-base="assetBase"
            @change-page="changePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue'
import Pagination from './Pagination.vue'
import FilterNav from './FilterNav.vue'

export default {
  name: 'CollectionApp',
  components: { ProductCard, Pagination, FilterNav },

  data() {
    return {
      products: [],
      pagination: {},
      facets: [],
      loading: false,
      result_count: 0,
      selectedValues: {},

      priceRange: {
        min: 0,
        max: 0,
        range_min: 0,
        range_max: 0
      },

      assetBase: window.theme?.assetBase || '',
      currentSort: 'manual',

      // search 用
      searchQuery: ''
    }
  },

  computed: {
    isSearchPage() {
      return window.location.pathname === '/search'
    }
  },

  created() {
    this.initSortFromURL()
    this.initSearchFromURL()
    this.fetchProducts()

    window.addEventListener('popstate', this.fetchProducts)

    const originalPushState = history.pushState
    history.pushState = (...args) => {
      originalPushState.apply(history, args)
      window.dispatchEvent(new Event('pushstate'))
    }

    window.addEventListener('pushstate', this.fetchProducts)
  },

  methods: {
    /* --------------------
     初期化
    -------------------- */
    initSortFromURL() {
      const params = new URLSearchParams(window.location.search)
      const sortBy = params.get('sort_by')
      if (sortBy) this.currentSort = sortBy
    },

    initSearchFromURL() {
      if (!this.isSearchPage) return
      const params = new URLSearchParams(window.location.search)
      this.searchQuery = params.get('q') || ''
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // 不要なら削除OK
      })
    },    

    /* --------------------
     URL 操作
    -------------------- */
    getQueryParams() {
      const params = {}
      const search = window.location.search
      if (!search) return params

      const query = new URLSearchParams(search)
      for (let [key, value] of query.entries()) {
        if (!params[key]) params[key] = []
        params[key].push(value)
      }
      return params
    },

    buildUrl(params, format) {
      const baseUrl = window.location.pathname
      let queryString = ''

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => {
            queryString += `${encodeURIComponent(key)}=${encodeURIComponent(v)}&`
          })
        } else {
          queryString += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`
        }
      })

      let url = queryString ? `${baseUrl}?${queryString}` : baseUrl

      if (format === 'json') {
        url += queryString ? '&view=json' : '?view=json'
      }

      return url.replace(/[?&]$/, '')
    },

    /* --------------------
     データ取得
    -------------------- */
    fetchProducts() {
      this.loading = true

      this.scrollToTop()

      const params = this.getQueryParams()
      const apiURL = this.buildUrl(params, 'json')

      fetch(apiURL)
        .then(res => res.json())
        .then(data => {
          this.products = data.products || []
          this.pagination = data.pagination || {}
          this.facets = data.facets || []
          this.updateSelectedValues()
          this.loading = false
          this.result_count = data.total_results || 0

          this.facets.forEach(facet => {
            if (facet.type === 'price_range') {
              
              this.priceRange = {
                min: facet.price_min,
                max: facet.price_max,
                range_min: facet.range_min,
                range_max: facet.range_max
              }
     
            }
          })
          // console.log('価格レンジ更新')
          // console.log(this.priceRange)

          

        })
        .catch(err => {
          console.error('商品取得エラー:', err)
          this.loading = false
        })
    },

    updateSelectedValues() {
      this.selectedValues = {}

      this.facets.forEach(facet => {
        if (facet.type === 'price_range') {
          this.priceRange = {
            min: facet.price_min,
            max: facet.price_max,
            range_min: facet.range_min,
            range_max: facet.range_max
          }
          return
        }

        facet.values.forEach(value => {
          if (!value.active) return
          if (!this.selectedValues[value.param_name]) {
            this.selectedValues[value.param_name] = []
          }
          this.selectedValues[value.param_name].push(value.param_value)
        })
      })
    },

    /* --------------------
     操作系
    -------------------- */
    applySearch() {
      if (!this.isSearchPage) return

      const params = this.getQueryParams()

      if (this.searchQuery) {
        params.q = [this.searchQuery]
        params.type = ['product']
      } else {
        delete params.q
        delete params.type
      }

      delete params.page

      history.pushState({}, '', this.buildUrl(params))
    },

    applyFilter(newParams) {
      history.pushState({}, '', this.buildUrl(newParams))
    },

    changePage(page) {
      const params = this.getQueryParams()

      if (page > 1) {
        params.page = page
      } else {
        delete params.page
      }

      history.pushState({}, '', this.buildUrl(params))
    }
  },

  filters: {
    currency(value) {
      if (!value) return ''
      return `¥${Number(value).toLocaleString()}`
    }
  }
}
</script>
