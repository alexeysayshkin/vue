<template>

    <div class="product__counter form__counter">
        <button type="button" aria-label="Убрать один товар" v-on:click="changeAmount(amount-1)"
            v-bind:disabled="isInFirstPage">
            <svg width="10" height="10" fill="currentColor">
                <use xlink:href="#icon-minus"></use>
            </svg>
        </button>

        <input type="text" v-model.number="amount" name="count">

        <button type="button" aria-label="Добавить один товар" v-on:click="changeAmount(amount+1)">
            <svg width="10" height="10" fill="currentColor">
                <use xlink:href="#icon-plus"></use>
            </svg>
        </button>
    </div>
</template>

<script>
export default {
    props: ['modelValue'],
    computed: {
        amount() {
            return this.modelValue
        },

        isInFirstPage() {
            return this.amount === 1;
        },


    },
    methods: {
    changeAmount(amount) {
      this.$emit('update:modelValue', amount);
    }
  }

}
</script>
