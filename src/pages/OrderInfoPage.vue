<template>

  <main class="content container" v-if="orderInfoLoaading">
    <LoadingPreloader />
  </main>
  <main v-else-if="orderInfoError">
    <div class="error">
      <h1 class="error__header">Произошла ошибка при загрузке товара</h1>

    </div>
  </main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html">
            Каталог
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="cart.html">
            Корзина
          </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title" v-if=" $store.state.orderInfo">
        Заказ оформлен <span>№ {{ $store.state.orderInfo.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item" v-if=" $store.state.orderInfo">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ $store.state.orderInfo.name }}
              </span>
            </li>
            <li class="dictionary__item" v-if=" $store.state.orderInfo">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ $store.state.orderInfo.address }}
              </span>
            </li>
            <li class="dictionary__item" v-if=" $store.state.orderInfo">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ $store.state.orderInfo.phone }}
              </span>
            </li>
            <li class="dictionary__item" v-if=" $store.state.orderInfo">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ $store.state.orderInfo.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{$store.state.orderInfo.paymentType}}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="item in $store.state.orderInfo.basket.items" :key="item.productId"
              :item="item">
              <h3>{{ item.productOffer.title }}</h3>
              <b>{{ item.price*item.quantity }} ₽</b>
              <span>Артикул:{{ item.productOffer.id }}</span>
            </li>

          </ul>

          <div class="cart__total">
            <p>{{$store.state.orderInfo.deliveryType.title}}: <b>{{ diliveryPretty}} ₽</b></p>
            <p>Итого: <b>{{ $store.state.orderInfo.basket.items.length }}</b> товара на сумму <b>{{
            pricePretty
            }} ₽</b></p>
          </div>
        </div>
      </form>
    </section>
  </main>

</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import LoadingPreloader from '@/components/LoadingPreloader.vue';

export default {
  data() {
    return {
      orderInfoLoaading: false,
      orderInfoError: false,
    }
  },
  components: { LoadingPreloader },
  created() {
    this.orderInfoLoaading = false
    if (this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id) {

      return;
    }
    this.$store.dispatch('loadOrderInfo', this.$route.params.id)
      .catch(() => this.orderInfoError = true)
      .then(() => this.orderInfoLoaading = false)
  },
  filters: { numberFormat },
  computed:{
    pricePretty() {
            return numberFormat(this.$store.state.orderInfo.totalPrice + Number(this.$store.state.orderInfo.deliveryType.price))

        },
       diliveryPretty() {
            return numberFormat(this.$store.state.orderInfo.deliveryType.price)

        },
    
  }


}
</script>