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
import {
  trackViewItem,
  trackAddToCart,
  trackBeginCheckout,
  trackAddPaymentInfo,
  trackPurchase,
  setUserInfo
} from '@/services/gtmEvents'

// Dados de exemplo do usuário
const currentUser = {
  user_id: '123',
  email: 'user@example.com'
}

// Dados de exemplo do evento/ingresso
const metallicaTicket = {
  item_id: 'evt_metallica_sp_2026',
  item_name: 'Show Metallica - São Paulo',
  item_category: 'event_ticket',
  item_variant: 'inteira',
  price: 350.00,
  currency: 'BRL',
  event_date: '2026-06-15',
  venue: 'Morumbi Stadium',
  artist: 'Metallica'
}

// Definir informações do usuário no GTM
setUserInfo(currentUser)

const trackInitAccount = () => {
  // Visualizar o ingresso
  trackViewItem(metallicaTicket)
  console.log('[GTM] Visualização de ingresso rastreada')
}

const trackAddToCart = () => {
  // Adicionar 2 ingressos ao carrinho
  const cartItems = [
    {
      ...metallicaTicket,
      quantity: 2
    }
  ]
  const cartValue = metallicaTicket.price * 2
  
  trackAddToCart(cartItems, cartValue)
  console.log('[GTM] Ingressos adicionados ao carrinho')
}

const trackPurchase = () => {
  // Simular compra completa
  const cartItems = [
    {
      ...metallicaTicket,
      quantity: 2
    }
  ]
  const totalValue = metallicaTicket.price * 2
  
  // Registrar pagamento
  trackAddPaymentInfo(cartItems, totalValue, {
    coupon: 'SAVE10',
    payment_method: 'credit_card',
    payment_type: 'online',
    installments: 3
  })
  
  // Finalizar compra
  trackPurchase({
    transaction_id: 'txn_' + Math.random().toString(36).substr(2, 9),
    affiliation: 'Ticket Marketplace',
    items: cartItems,
    value: totalValue,
    tax: 105.00,
    shipping: 0,
    currency: 'BRL',
    coupon: 'SAVE10',
    user_id: currentUser.user_id,
    email: currentUser.email,
    customer_lifetime_value: 2450.00,
    payment_method: 'credit_card'
  })
  
  console.log('[GTM] Compra finalizada com sucesso')
}
</script>

<style scoped>
.gap-md {
  gap: 1rem;
}
</style>
