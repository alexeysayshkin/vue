<template>
    <span v-if="error" class="form__error form__validate  form__validate-new">{{ error }}</span>
</template>

<script>
export default {
    props: ['error']
}

</script>
<style>
.form__validate-new {
    top: -15px;
    left: 20px;
}
</style>