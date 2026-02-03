<template>
  <q-page class="flex flex-center column">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
    
    <div class="q-mt-lg flex column gap-md">
      <q-btn
        color="primary"
        label="Inicializar Conta"
        @click="trackInitAccount"
        size="lg"
      />
      
      <q-btn
        color="positive"
        label="Adicionar ao Carrinho"
        @click="trackAddToCart"
        size="lg"
      />
      
      <q-btn
        color="info"
        label="Realizar Compra"
        @click="trackPurchase"
        size="lg"
      />
    </div>
  </q-page>
</template>

<script setup>
const trackInitAccount = () => {
  // Dados para o evento de inicialização de conta
  const accountData = {
    event: 'initAccount',
    user_id: 123,
    account_type: 'premium',
    registration_date: new Date().toISOString(),
    country: 'BR',
    email: 'user@example.com'
  }
  
  // Push para o dataLayer do GTM
  if (window.dataLayer) {
    window.dataLayer.push(accountData)
    console.log('Evento initAccount enviado:', accountData)
  }
}

const trackAddToCart = () => {
  // Dados para o evento de adicionar ao carrinho
  const cartData = {
    event: 'addToCart',
    user_id: 123,
    ecommerce: {
      items: [
        {
          item_id: 'evt_' + Math.random().toString(36).substr(2, 6),
          item_name: 'Show Metallica - São Paulo',
          item_category: 'concerts',
          item_variant: 'inteira',
          price: 350.00,
          quantity: 2,
          currency: 'BRL',
          event_date: '2026-06-15',
          venue: 'Morumbi Stadium'
        }
      ]
    },
    value: 700.00,
    currency: 'BRL'
  }
  
  // Push para o dataLayer do GTM
  if (window.dataLayer) {
    window.dataLayer.push(cartData)
    console.log('Evento addToCart enviado:', cartData)
  }
}

const trackPurchase = () => {
  // Dados para o evento de compra
  const purchaseData = {
    event: 'purchase',
    user_id: 123,
    transaction_id: 'txn_' + Math.random().toString(36).substr(2, 9),
    affiliation: 'Ticket Marketplace',
    value: 700.00,
    tax: 105.00,
    shipping: 0,
    currency: 'BRL',
    coupon: 'SAVE10',
    ecommerce: {
      transaction_id: 'txn_' + Math.random().toString(36).substr(2, 9),
      affiliation: 'Ticket Marketplace',
      value: 700.00,
      tax: 105.00,
      shipping: 0,
      currency: 'BRL',
      items: [
        {
          item_id: 'evt_' + Math.random().toString(36).substr(2, 6),
          item_name: 'Show Metallica - São Paulo',
          item_category: 'concerts',
          item_variant: 'inteira',
          price: 350.00,
          quantity: 2,
          currency: 'BRL',
          event_date: '2026-06-15',
          venue: 'Morumbi Stadium'
        }
      ]
    },
    customer_lifetime_value: 2450.00
  }
  
  // Push para o dataLayer do GTM
  if (window.dataLayer) {
    window.dataLayer.push(purchaseData)
    console.log('Evento purchase enviado:', purchaseData)
  }
}
</script>

<style scoped>
.gap-md {
  gap: 1rem;
}
</style>
