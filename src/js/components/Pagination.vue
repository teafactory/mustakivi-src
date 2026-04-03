<template v-if="currentPage">
  <div class="pagination-section">
    <div class="container">
      <ol class="pagination">
        <li>
          <!-- 前へ -->
          <button
            class="pagination__prev"
            :disabled="currentPage === 1"
            @click="goTo(currentPage - 1, $event)"
          >
            <img :src="`${assetBase}icon_arrow_left_01.svg`" alt="Previous">
          </button>
        </li>
        <!-- ページ番号 -->
        <li
          v-for="page in visiblePages"
          :key="page"
          class="pagination__page"
          :class="{ active: page === currentPage, dots: page === '...' }"
        >
          <a href="#" @click="goTo(page, $event)">{{ page }}</a>
        </li>
        <!-- 次へ -->
        <li>
          <button
            class="pagination__next"
            :disabled="currentPage === totalPages"
            @click="goTo(currentPage + 1, $event)"
          >
            <img :src="`${assetBase}icon_arrow_right_01.svg`" alt="Next">
          </button>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    maxVisible: { type: Number, default: 5 },
    assetBase: { type: String, required: true }
  },
  computed: {
    visiblePages() {
      const pages = [];
      const half = Math.floor(this.maxVisible / 2);

      let start = Math.max(1, this.currentPage - half);
      let end = Math.min(this.totalPages, start + this.maxVisible - 1);

      if (end - start < this.maxVisible - 1) {
        start = Math.max(1, end - this.maxVisible + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < this.totalPages) {
        if (end < this.totalPages - 1) pages.push("...");
        pages.push(this.totalPages);
      }

      return pages;
    }
  },
  methods: {
    goTo(page, event) {
      event.preventDefault();
      if (page === "..." || page === this.currentPage) return;
      this.$emit("change-page", page);
    }
  }
};
</script>



