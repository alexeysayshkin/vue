<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <button class="pagination__link pagination__link--arrow " :class="{ 'pagination__link--disabled': page === 1 }"
        aria-label="Предыдущая страница" @click="paginate(page - 1)"  v-bind:disabled="isInFirstPage">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </button>
    </li>
    <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
      <a href="#" class="pagination__link" :class="{ 'pagination__link--current': pageNumber === page }"
        @click="$event.preventDefault(); paginate(pageNumber)">
        {{ pageNumber }}
      </a>
    </li>
    <li class="pagination__item">
      <button class="pagination__link pagination__link--arrow" href="#" aria-label="Следующая страница"
        :class="{ 'pagination__link--disabled': pages === page }" @click="paginate(page + 1)"  v-bind:disabled="isInLastPage"
        >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  
  props: ['modelValue', 'count', 'perPage'],
  computed: {
    page(){
      return this.modelValue;
    },
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
    isInFirstPage() {
      return this.page === 1;
    },
    isInLastPage() {
      return this.page === this.pages;
    },
  },
  methods: {
    paginate(page) {
      this.$emit('update:modelValue', page);
    }
  }

}
</script>