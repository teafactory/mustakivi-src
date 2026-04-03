<template>
  <div class="template">
    <button class="filtering-nav__toggle-button" @click="toggleFilteringMenus">
      <span class="filtering-nav__toggle-icon">
        
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7 2.5C7 3.32843 6.32843 4 5.5 4C4.67157 4 4 3.32843 4 2.5C4 1.67157 4.67157 1 5.5 1C6.32843 1 7 1.67157 7 2.5ZM7.94999 3H18V2H7.94999C7.71836 0.85888 6.70948 0 5.5 0C4.29052 0 3.28164 0.85888 3.05001 2H0V3H3.05001C3.28164 4.14112 4.29052 5 5.5 5C6.70948 5 7.71836 4.14112 7.94999 3Z" fill="black"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14 9.5C14 10.3284 13.3284 11 12.5 11C11.6716 11 11 10.3284 11 9.5C11 8.67157 11.6716 8 12.5 8C13.3284 8 14 8.67157 14 9.5ZM14.95 10H18V9H14.95C14.7184 7.85888 13.7095 7 12.5 7C11.2905 7 10.2816 7.85888 10.05 9H0V10H10.05C10.2816 11.1411 11.2905 12 12.5 12C13.7095 12 14.7184 11.1411 14.95 10Z" fill="black"/>
          </svg>

      </span>
      <span class="filtering-nav__toggle-text">絞り込み</span>
    </button>
    <nav
      v-if="facets && facets.length"
      class="filtering-nav"
      :class="{ 'filtering-nav--opened': filteringNavOpen }"
    >
      <button class="filtering-nav__close-button" @click="toggleFilteringMenus">
        <span class="filtering-nav__close-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.2255 19.9307L0.840745 1.54597L1.54785 0.838867L19.9326 19.2236L19.2255 19.9307Z" fill="black"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M0.840731 19.2236L19.2255 0.838792L19.9326 1.5459L1.54784 19.9307L0.840731 19.2236Z" fill="black"></path></svg>
        </span>
      </button>
      <div class="filtering-nav__container">
        <!-- メニュー -->
        <div
          class="filtering-nav__menus"
          :class="{ 'filtering-nav__menus--opened': filteringNavOpen }"
        >
          <div class="filtering-nav__menus-content">
            <!-- フィルターメニュー -->
            <form class="filtering-nav__form" @submit.prevent="applyFilters">
              <div class="filtering-nav__scroll-container scroll-container">
                <div class="filtering-nav__menu-items">
                  <div
                    v-for="filter in facets"
                    :key="filter.label"
                    class="filtering-nav__menu-item"
                    :class="{ opened: currentOption === filter.label }"
                  >
                    <template v-if="filter.label =='カラー'">
    
    
                          <p class="filtering-nav__menu-title">
                            カラー
                          </p>
                          <div
                            class="filtering-nav__menu-content"
                          >
                            <div class="filter-nav__options-container">
                              <ul class="filtering-nav__options filtering-nav__options--colors">
                                <li
                                  v-for="value in filter.values"
                                  :key="value.value"
                                  class="filtering-nav__option"
                                >
                                  <label
                                    class="filtering-nav__option-button"
                                    :class="{
                                      selected: value.active,
                                      disabled: value.count === 0 && !value.active
                                    }"
                                  >
                                    <input
                                      type="checkbox"
                                      :name="value.param_name"
                                      :value="value.param_value"
                                      :checked="value.active"
                                      @change="updateURL(filter, value, $event)"
                                    />
                                    <span class="filtering-nav__color-swatch">
                                      <img
                                        :src="`https://cdn.shopify.com/s/files/1/0604/9670/7774/files/color-swatch-${value.param_value}.png`"
                                        alt=""
                                      />
                                    </span>
                                  </label>
                                </li>
                              </ul>
                            </div>
                          </div>
    
    
                    </template>
                    <template v-else-if="filter.label =='タグ'">
                      <div v-for="type in filterTypes" :key="type.label">
    
                          <p class="filtering-nav__menu-title">
                            {{ type.label }}
                          </p>
                          <div
                            class="filtering-nav__menu-content"
                          >
                            <div class="filter-nav__options-container">
                              <ul class="filtering-nav__options filtering-nav__options--checkbox">
                                <li
                                  v-for="value in filter.values"
                                  v-if="value.label.includes(type.prefix)"
                                  :key="value.value"
                                  class="filtering-nav__option"
                                >
                                  <label
                                    class="filtering-nav__option-button"
                                    :class="{
                                      selected: value.active,
                                      disabled: value.count === 0 && !value.active
                                    }"
                                  >
                                    <input
                                      type="checkbox"
                                      :name="value.param_name"
                                      :value="value.param_value"
                                      :checked="value.active"
                                      @change="updateURL(filter, value, $event)"
                                    />
                                    <span class="backdrop"></span>
                                    {{ value.label.replace(type.prefix, '').replace(/^\d{2}_/, '') }} ({{ value.count }})
                                  </label>
                                </li>
                              </ul>
                            </div>
                          </div>
    
                        </div>
                    </template>
    
                    <template v-else-if="filter.type =='price_range'">
                      <p class="filtering-nav__menu-title">
                        {{ filter.label }}
                      </p>
                      <vue-slider
                        v-model="currentPriceRange"
                        :min="sliderPriceRange[0]"
                        :max="sliderPriceRange[1]"
                        :interval="interval"
                        :dot-size="16"
                        :tooltip="'hover'"
                        :lazy="true"
                        @change="applyPriceFilter"
                      />
                      <!-- 入力欄と連動 -->
                      <div class="price-inputs">
                        <input
                          type="number"
                          name="filter.v.price.gte"
                          :value="minValue"
                          @blur="updatePriceRange"
                        />
                        <span class="connector">〜</span>
                        <input
                          type="number"
                          name="filter.v.price.lte"
                          :value="maxValue"
                          @blur="updatePriceRange"
                        />
                      </div>
                    </template>
    
                  </div>

                  <div class="filtering-nav__menu-item">
                    <p class="filtering-nav__menu-title">
                      並び順
                    </p>                    
                    <div class="filtering-nav__menu-content">
                      <ul class="filtering-nav__options filtering-nav__options--radio">
                        <li
                          v-for="option in sortOptions"
                          :key="option.value"
                          class="filtering-nav__option"
                        >
                          <label
                            class="filtering-nav__option-button"
                            :class="{ selected: currentSort === option.value }"
                          >
                          <input type="radio"
                            :id="`sort-${option.value}`"
                            name="sort-options"
                            :value="option.value"
                            :class="{ selected: currentSort === option.value }"
                            :checked="currentSort === option.value"
                            @change="applySort(option.value)"
                          />
                          <span class="backdrop"></span>
                          {{ option.label }}
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
              <div class="filtering-nav__footer">
                <div class="filtering-nav__actions">
                  <button
                    type="button"
                    class="button button--primary show-result-button"
                    @click="toggleFilteringMenus"
                  >
                    検索結果を表示
                  </button>                  
                  <button
                    type="button"
                    class="button button--secondary"
                    @click="clearAll"
                  >
                    クリア
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { formatMoney, formatMoneyRaw } from '../utils/functions';
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  name: "FilterNav",
  components: { VueSlider },
  props: {
    facets: { 
      type: Array, 
      required: true 
    },
    selectedValues: { 
      type: Object, 
      default: () => ({})   // ← 空オブジェクトを返す
    },
    priceRange: { 
      type: Object, 
      default: () => ({     // ← () で囲んで return する
        min: 0,
        max: 0,
        range_min: 0,
        range_max: 0
      }) 
    },
    searchQuery: {
      type: String,
      default: ''
    },
    currentSort: {
      type: String,
      default: 'manual'
    }
  },
  data() {
    return {
      filteringNavOpen: false,
      sortNavOpen: false,
      currentOption: null,
      //selectedValues: [],
      interval: 100,
      filterTypes: [      
        {
          label: 'シリーズ',
          prefix: 'series:'
        },
        {
          label: '種類',
          prefix: 'type:'
        },      
      ],
      sortOptions: [
        { label: 'おすすめ順', value: 'manual' },
        { label: 'ベストセラー', value: 'best-selling' },
        { label: '新着順', value: 'created-descending' },
        { label: '価格が低い順', value: 'price-ascending' },
        { label: '価格が高い順', value: 'price-descending' },
        // { label: 'アルファベット順 (A-Z)', value: 'title-ascending' },
        // { label: 'アルファベット順 (Z-A)', value: 'title-descending' },
      ]
    };
  },
  watch: {
    inputMin(val) {
      this.priceRange.min = Number(val);
    },
    inputMax(val) {
      this.priceRange.max = Number(val);
    }
  },  
  computed: {
    currentSortLabel() {
      const option = this.sortOptions.find(opt => opt.value === this.currentSort);
      return option ? option.label : '並び順';
    },
    currentPriceRange: {
      get() {

        return [
          this.formatMoneyRaw(this.priceRange.min),
          this.formatMoneyRaw(this.priceRange.max || this.priceRange.range_max)
        ];
      },
      set([min, max]) {
        this.priceRange.min = Number(min + '00');
        this.priceRange.max = Number(max + '00');
      }
    },
    sliderPriceRange() {
      
      const min = this.priceRange.min < this.priceRange.range_min 
        ? this.priceRange.min 
        : this.priceRange.range_min;
      const max = this.priceRange.max > this.priceRange.range_max 
        ? this.priceRange.max 
        : this.priceRange.range_max;

//console.log(this.max(max))

      return [this.formatMoneyRaw(this.min(min)), this.formatMoneyRaw(this.max(max))];
    },
    minValue: {
      get() {
        return this.formatMoneyRaw(this.priceRange.min);   // フォーマットしない
      },
      set(val) {
        this.priceRange.min = Number(val);
      }
    },
    maxValue: {
      get() {
        // 最大値が「フィルターなし」状態なら空表示する
        if (
          this.priceRange.max == null || this.priceRange.max == 0
        ) {
          return this.formatMoneyRaw(this.max(this.priceRange.range_max));
        }
        return this.formatMoneyRaw(this.max(this.priceRange.max));
      },
      set(val) {
        if (val === "" || val == null) {
          // 空なら「フィルターなし」状態へ（内部値は range_max）
          this.priceRange.max = this.max(this.priceRange.range_max);
        } else {
          this.priceRange.max = Number(val + "00");
        }
      }
    }




  },
  methods: {
    toggleSortNav() {
      this.sortNavOpen = !this.sortNavOpen;
      if (this.sortNavOpen) {
        this.filteringNavOpen = false;
      }
    },
    applySort(sortValue) {
      let newValues = { ...this.selectedValues };

      // 価格フィルターの値を保持
      if (this.priceRange.min > this.priceRange.range_min) {
        newValues["filter.v.price.gte"] = this.formatMoneyRaw(this.priceRange.min);
      }
      if (this.priceRange.max < this.priceRange.range_max) {
        newValues["filter.v.price.lte"] = this.formatMoneyRaw(this.priceRange.max || this.priceRange.range_max);
      }

      if (this.searchQuery) {
        newValues["q"] = this.searchQuery;
        newValues["type"] = "product";
      }

      // ソート値を追加
      newValues["sort_by"] = sortValue;

      this.$emit("update:selected-values", newValues);
      
      this.$emit("apply-filter", newValues);
      this.sortNavOpen = false;
    },
    updatePriceRange(e) {
      if (!e || !e.target) return;

      const name = e.target.getAttribute("name");
      const value = e.target.value;

      // ---- 空のとき：フィルターなしとして扱う ----
      if (value === "" || value == null) {
        if (name === "filter.v.price.lte") {
          // 最大値は range_max に戻す → URL に出ない状態
          this.priceRange.max = null;
        }
        if (name === "filter.v.price.gte") {
          this.priceRange.min = this.priceRange.range_min;
        }
        this.applyPriceFilter();
        return;
      }

      // ---- 通常の値入力時 ----
      if (name === "filter.v.price.gte") {
        this.priceRange.min = Number(value + "00");
      } else if (name === "filter.v.price.lte") {
        this.priceRange.max = Number(value + "00");
      }

      this.applyPriceFilter();
    },
    applyPriceFilter() {
      const newValues = { ...this.selectedValues };

      newValues["filter.v.price.gte"] = this.formatMoneyRaw(this.priceRange.min);
      newValues["filter.v.price.lte"] = this.formatMoneyRaw(this.priceRange.max);

      // ---- gte（最小値） ----
      // 範囲最小と同じ、または 0 の場合は削除
      if (
        newValues["filter.v.price.gte"] <= this.priceRange.range_min ||
        newValues["filter.v.price.gte"] == 0
      ) {
        delete newValues["filter.v.price.gte"];
      }

      // ---- lte（最大値） ----
      // 範囲最大と同じ、または 0 の場合は削除
      if (
        newValues["filter.v.price.lte"] >= this.priceRange.range_max ||
        newValues["filter.v.price.lte"] == 0
      ) {
        delete newValues["filter.v.price.lte"];
      }

      if(this.searchQuery){
        newValues["q"] = this.searchQuery;
        newValues["type"] = "product";
      }

      this.$emit("update:selected-values", newValues);
      this.$emit("apply-filter", newValues);
    },
    formatMoneyRaw(value) {
      return formatMoneyRaw(value);
    },
    toggleFilteringMenus() {
      this.filteringNavOpen = !this.filteringNavOpen;
      if (this.filteringNavOpen) {
        this.sortNavOpen = false;
      }
    },
    updateURL(filter, value, event) {
      let newValues = { ...this.selectedValues };
      const checked = event.target.checked;

      // ---- チェック外す ----
      if (!checked) {
        if (newValues[value.param_name]) {
          const index = newValues[value.param_name].indexOf(value.param_value);
          if (index > -1) {
            newValues[value.param_name].splice(index, 1);
            if (newValues[value.param_name].length === 0) {
              delete newValues[value.param_name];
            }
          }
        }
      } 
      // ---- チェック入れる ----
      else {
        if (!newValues[value.param_name]) {
          newValues[value.param_name] = [];
        }
        if (!newValues[value.param_name].includes(value.param_value)) {
          newValues[value.param_name].push(value.param_value);
        }
      }

      // ---- price gte ----
      if (this.priceRange.min > this.priceRange.range_min && this.priceRange.min != 0) {
        newValues["filter.v.price.gte"] = this.formatMoneyRaw(this.priceRange.min);
      } else {
        delete newValues["filter.v.price.gte"];
      }

      // ---- price lte ----
      if (this.priceRange.max < this.priceRange.range_max && this.priceRange.max != 0) {
        newValues["filter.v.price.lte"] = this.formatMoneyRaw(this.priceRange.max);
      } else {
        delete newValues["filter.v.price.lte"];
      }

      // ---- 検索クエリを保持 ----
      if (this.searchQuery) {
        newValues["q"] = this.searchQuery;
        newValues["type"] = "product";
      }

      this.$emit("update:selected-values", newValues);
      this.$emit("apply-filter", newValues);
    },
    clearAll() {
      //this.selectedValues = {};
      let newValues = {};
      
      // ---- 検索クエリを保持 ----
      if (this.searchQuery) {
        newValues["q"] = this.searchQuery;
        newValues["type"] = "product";
      }
      
      this.$emit("apply-filter", newValues); // 親に空パラメータを渡して商品リストを更新
    },
    applyFilters() {
      // alert('フィルターを適用しました');
      // const params = {};
      // console.log(this.selectedValues)
      // this.selectedValues.forEach(v => {
      //   console.log(v);
      //   const [name, val] = v.split("=");
      //   params[name] = val;
      // });



      // this.$emit("apply-filter", params);
      // this.toggleFilteringMenus();
    },
    min(n){
      const interval = this.interval * 100;
      return Math.floor(n / interval) * interval;
    },
    max(n){
      const interval = this.interval * 100;
      return Math.ceil(n / interval) * interval;
    }
  }
};
</script>