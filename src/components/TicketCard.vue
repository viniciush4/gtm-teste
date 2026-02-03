<template>
  <!-- Este é um exemplo de como usar o serviço GTM em um componente -->
  <div class="ticket-card">
    <q-card class="ticket-container">
      <q-card-section>
        <div class="text-h6">{{ ticket.item_name }}</div>
        <div class="text-subtitle2">{{ ticket.artist }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="ticket-details">
        <div class="detail-row">
          <span class="label">Data:</span>
          <span class="value">{{ formatDate(ticket.event_date) }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Local:</span>
          <span class="value">{{ ticket.venue }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Tipo:</span>
          <span class="value">{{ formatVariant(ticket.item_variant) }}</span>
        </div>
        <div class="detail-row price">
          <span class="label">Preço:</span>
          <span class="value">R$ {{ ticket.price.toFixed(2) }}</span>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn
          flat
          color="primary"
          label="Ver Detalhes"
          @click="handleViewItem"
          icon="visibility"
        />
        <q-space />
        <q-btn
          color="positive"
          label="Adicionar"
          @click="handleAddToCart"
          icon="shopping_cart"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { trackViewItem, trackAddToCart } from '@/services/gtmEvents'

const props = defineProps({
  ticket: {
    type: Object,
    required: true,
    // Estrutura esperada:
    // {
    //   item_id: 'evt_001',
    //   item_name: 'Show Name',
    //   item_category: 'event_ticket',
    //   item_variant: 'inteira',
    //   price: 350.00,
    //   currency: 'BRL',
    //   event_date: '2026-06-15',
    //   venue: 'Stadium Name',
    //   artist: 'Artist Name'
    // }
  }
})

const emit = defineEmits(['add-to-cart', 'view-item'])

const handleViewItem = () => {
  // Disparar evento GTM
  trackViewItem(props.ticket)
  
  // Emitir evento para o componente pai se necessário
  emit('view-item', props.ticket)
}

const handleAddToCart = () => {
  // Disparar evento GTM com quantidade 1
  const items = [{
    ...props.ticket,
    quantity: 1
  }]
  trackAddToCart(items, props.ticket.price)
  
  // Emitir evento para o componente pai
  emit('add-to-cart', items)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const formatVariant = (variant) => {
  const variantMap = {
    inteira: 'Inteira',
    meia: 'Meia Entrada',
    cortesia: 'Cortesia',
    vip: 'VIP',
    camarote: 'Camarote',
    pista: 'Pista',
    arquibancada: 'Arquibancada'
  }
  return variantMap[variant] || variant
}
</script>

<style scoped>
.ticket-card {
  display: inline-block;
  width: 100%;
  max-width: 400px;
}

.ticket-container {
  cursor: pointer;
  transition: all 0.3s ease;
}

.ticket-container:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.ticket-details {
  padding: 12px 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.detail-row.price {
  font-weight: bold;
  color: #1976d2;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #333;
}
</style>
