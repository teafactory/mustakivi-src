<template>
  <div class="product-card product col col-3 col-sm-6" :class="{ 'product--sold-out': !isAvailable, 'product--single': product.has_only_default_variant }">
    <a :href="`/products/${product.handle}`">
      <div class="product__tn">

        <!-- メイン画像 -->
        <div 
          class="product__image product__image--main"
          :class="{ 'no-sub-image': !hoverImage }"
        >
          <picture>
            <img
              class="lazyload"
              :src="mainImage"
            >
          </picture>
        </div>

        <!-- ホバー画像 -->
        <div v-if="hoverImage" class="product__image product__image--hover">
          <picture>
            <img
              class="lazyload"
              :src="hoverImage"
            >
          </picture>
        </div>

        <!-- SOLD OUTタグ -->
        <span v-if="!isAvailable" class="tag--sold-out">OUT OF STOCK</span>
      </div>

      <p class="product__title">{{ product.title }}</p>

      <!-- 価格 -->
      <p class="product__price">
        <template v-if="compareAtPriceMax > minPrice">
          <!-- セール価格 -->
          <span class="price price--sale">
            {{ formatPrice(minPrice) }}<span v-if="minPrice !== maxPrice">〜</span>
          </span>
          <!-- 比較価格 -->
          <span class="price price--compare">
            {{ formatPrice(compareAtPriceMax) }}<span v-if="compareAtPriceMin !== compareAtPriceMax">〜</span>
          </span>
        </template>
        <template v-else>
          <!-- 通常価格 -->
          <span class="price">
            {{ formatPrice(minPrice) }}<span v-if="minPrice !== maxPrice">〜</span>
          </span>
        </template>
      </p>


    </a>
  </div>
</template>

<script>

import { formatMoney } from '../utils/functions';

export default {
  name: "ProductCard",
  props: {
    product: { type: Object, required: true }
  },
  computed: {
    // メイン画像（必ず1枚目を使う）
    mainImage() {
      return this.product.image || this.product.images?.[0] || {};
    },
    // ホバー画像（サブ画像があれば使う）
    hoverImage() {
      return this.product.sub_image || this.product.images?.[1] || null;
    },
    // 在庫判定
    isAvailable() {
      return this.product.variants?.some(v => v.available) ?? false;
    },

    // 最安値と最高値
    minPrice() {
      return Math.min(...this.product.variants.map(v => Number(v.price)));
    },
    maxPrice() {
      return Math.max(...this.product.variants.map(v => Number(v.price)));
    },

    // compare_at_price の最小・最大
    compareAtPriceMin() {
      const list = this.product.variants
        .filter(v => v.compare_at_price)
        .map(v => Number(v.compare_at_price));
      return list.length ? Math.min(...list) : this.minPrice;
    },
    compareAtPriceMax() {
      const list = this.product.variants
        .filter(v => v.compare_at_price)
        .map(v => Number(v.compare_at_price));
      return list.length ? Math.max(...list) : this.maxPrice;
    },

    // セール判定
    isSale() {
      return this.compareAtPriceMax > this.minPrice;
    }
  },
  mounted() {
    //console.log(this.minPrice);
  },
  methods: {
    formatPrice(value) {
      return formatMoney(value);
    }
  }
};
</script>



