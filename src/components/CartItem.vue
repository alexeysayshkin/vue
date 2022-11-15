<template>
    <li class="cart__item product">
        <div class="product__pic">
            <img :src="item.product.product.preview.file.url" width="120" height="120" alt="item.product.title">
        </div>
        <h3 class="product__title">
            {{ item.product.title }}
        </h3>

        <span class="product__code">
            Артикул: {{ item.basketItemId }}
        </span>


        <ProductCounter v-model="productAmount" />

        <b class="product__price">
            {{ pricePretty }} P
        </b>

        <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины"
            @click.prevent="deleteCartProduct(item.productId)">
            <svg width="20" height="20" fill="currentColor">
                <use xlink:href="#icon-close"></use>
            </svg>
        </button>
    </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import ProductCounter from '@/components/ProductCounter.vue';


export default {
    data() {
        return { cartProductPrice: null }

    },
    components: { ProductCounter },
    filters: { numberFormat },
    props: ['item'],
    computed: {

        pricePretty() {
            return numberFormat(this.item.amount * this.item.product.price)

        },
        productAmount: {
            get() {
                return this.item.amount;
            },
            set(value) {
                this.$store.dispatch('updateCartProductAmount', { basketItemId: this.item.basketItemId, amount: value });
            }
        },


    },
    methods: {
        deleteCartProduct() {
            this.$store.dispatch('deleteCartProduct', { basketItemId: this.item.basketItemId })

        }

    }
}


</script>