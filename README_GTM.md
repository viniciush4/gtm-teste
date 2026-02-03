# GTM E-commerce para Venda de Ingressos

## 📋 Resumo da Implementação

Este projeto implementa o rastreamento de eventos Google Tag Manager (GTM) para um marketplace de venda de ingressos, seguindo a estrutura recomendada do Google para e-commerce.

## 🎯 Eventos Implementados

| Evento | Descrição | Quando usar |
|--------|-----------|------------|
| **view_item** | Visualizar detalhes de um ingresso | Quando usuário acessa página de evento |
| **add_to_cart** | Adicionar ingressos ao carrinho | Quando clica "Adicionar ao Carrinho" |
| **begin_checkout** | Iniciar processo de compra | Quando clica "Ir para Checkout" |
| **add_payment_info** | Selecionar forma de pagamento | Quando confirma método de pagamento |
| **purchase** | Finalizar compra com sucesso | Quando transação é confirmada |

## 📁 Estrutura de Arquivos

```
src/
├── services/
│   ├── gtmEvents.js              # Serviço principal com todas as funções
│   └── gtmEvents.examples.js      # Exemplos de uso para cada cenário
├── pages/
│   ├── IndexPage.vue             # Página inicial (atualizada)
│   └── EventTrackingPage.vue      # Demo interativa de eventos
├── router/
│   └── routes.js                 # Rotas (atualizado)
└── App.vue
```

## 🚀 Quick Start

### 1. Importar e usar o serviço

```javascript
import { 
  trackViewItem, 
  trackAddToCart, 
  trackPurchase 
} from '@/services/gtmEvents'

// Visualizar ingresso
trackViewItem({
  item_id: 'evt_001',
  item_name: 'Show Metallica - São Paulo',
  price: 350.00,
  event_date: '2026-06-15',
  venue: 'Morumbi Stadium',
  artist: 'Metallica'
})
```

### 2. Página de Demonstração

Acesse `http://localhost:xxxx/event-tracking` para uma interface interativa que permite:
- Simular cada evento do fluxo de compra
- Ver console em tempo real com logs dos eventos
- Testar diferentes cenários de venda

### 3. Ver eventos no console

```javascript
// No console do browser (F12)
console.log(window.dataLayer)
```

## 📊 Estrutura de Dados para Ingressos

Cada ingresso deve conter:

```javascript
{
  item_id: 'evt_001',              // ID único do ingresso
  item_name: 'Show Name',          // Nome do evento
  item_category: 'event_ticket',   // Categoria (fixo)
  item_variant: 'inteira',         // Tipo: inteira, meia, cortesia, vip, etc
  price: 350.00,                   // Preço unitário
  quantity: 1,                     // Quantidade (apenas em add_to_cart e purchase)
  currency: 'BRL',                 // Moeda
  event_date: '2026-06-15',        // Data do evento (YYYY-MM-DD)
  venue: 'Morumbi Stadium',        // Local do evento
  artist: 'Metallica'              // Artista/Banda
}
```

## 💰 Exemplo: Fluxo Completo de Compra

```javascript
import { 
  trackViewItem, 
  trackAddToCart, 
  trackBeginCheckout, 
  trackAddPaymentInfo, 
  trackPurchase, 
  setUserInfo 
} from '@/services/gtmEvents'

// 1. Definir usuário
setUserInfo({
  user_id: '123',
  email: 'customer@example.com'
})

// 2. Ver ingresso
trackViewItem({
  item_id: 'evt_001',
  item_name: 'Show X',
  price: 350,
  event_date: '2026-06-15',
  venue: 'Stadium',
  artist: 'Artist Name'
})

// 3. Adicionar ao carrinho
const items = [{
  item_id: 'evt_001',
  item_name: 'Show X',
  price: 350,
  quantity: 2,
  event_date: '2026-06-15',
  venue: 'Stadium',
  artist: 'Artist Name'
}]
trackAddToCart(items, 700)

// 4. Começar checkout
trackBeginCheckout(items, 700, {
  user_id: '123',
  email: 'customer@example.com'
})

// 5. Adicionar pagamento
trackAddPaymentInfo(items, 700, {
  coupon: 'SAVE10',
  payment_method: 'credit_card',
  installments: 3
})

// 6. Finalizar compra
trackPurchase({
  transaction_id: 'txn_abc123',
  affiliation: 'Ticket Marketplace',
  items: items,
  value: 700,
  tax: 105,
  shipping: 0,
  currency: 'BRL',
  coupon: 'SAVE10',
  user_id: '123',
  email: 'customer@example.com',
  payment_method: 'credit_card'
})
```

## 🎫 Variantes de Ingresso

Use a propriedade `item_variant` para diferenciar tipos:

- `inteira` - Ingresso inteiro
- `meia` - Meia entrada
- `cortesia` - Cortesia
- `vip` - VIP
- `camarote` - Camarote
- `pista` - Pista
- `arquibancada` - Arquibancada

## 💳 Métodos de Pagamento

Usar em `add_payment_info`:

- `credit_card` - Cartão de crédito
- `debit_card` - Cartão de débito
- `pix` - PIX
- `boleto` - Boleto bancário

## 🔍 Validação no GTM

1. Abra o Google Tag Manager: https://tagmanager.google.com
2. Selecione seu container (GTM-MPF5B7TZ)
3. Clique em "Preview"
4. Navegue no seu site
5. Veja os eventos aparecendo em tempo real

## 📚 Exemplos Completos

Veja 7 exemplos práticos em [src/services/gtmEvents.examples.js](src/services/gtmEvents.examples.js):

1. Fluxo completo de compra
2. Múltiplos eventos no carrinho
3. Compra com desconto de cupom
4. Compra com parcelamento
5. Apenas visualização (sem compra)
6. Compra com meia entrada
7. Rastreamento de múltiplos ingressos

## 📖 Documentação Completa

Veja [GTM_IMPLEMENTATION_GUIDE.md](GTM_IMPLEMENTATION_GUIDE.md) para documentação detalhada de cada evento e campo.

## 🛠️ Funcionalidades Auxiliares

### setUserInfo
Define informações do usuário para contexto:
```javascript
setUserInfo({
  user_id: '123',
  email: 'user@example.com',
  user_type: 'premium',
  country: 'BR'
})
```

### clearEcommerce
Limpa dados de e-commerce entre eventos:
```javascript
clearEcommerce()
```

## 📱 Página de Demo

Acesse `/event-tracking` para uma interface completa que permite:
- ✅ Simular cada passo do fluxo de compra
- ✅ Ver console em tempo real
- ✅ Gerenciar carrinho visualmente
- ✅ Testar diferentes combinações de eventos

## ⚠️ Boas Práticas

1. **Sempre definir usuário uma vez:**
   ```javascript
   setUserInfo(userInfo) // Uma única vez por sessão
   ```

2. **Limpar entre eventos diferentes:**
   ```javascript
   clearEcommerce()
   trackViewItem(item)
   ```

3. **Usar IDs únicos para transações:**
   ```javascript
   const txnId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
   ```

4. **Validar dados antes de enviar:**
   ```javascript
   if (item.price && item.item_id) {
     trackViewItem(item)
   }
   ```

## 🔗 Recursos Úteis

- [Google Tag Manager Docs](https://support.google.com/tagmanager)
- [GA4 E-commerce Events](https://support.google.com/analytics/answer/13316687)
- [Recommended Events API](https://developers.google.com/tag-platform/gtagjs/reference/events)

## 📞 Suporte

Para dúvidas ou problemas, verifique:
- Console do browser (F12) para mensagens de erro
- `window.dataLayer` para ver todos os eventos
- Página de demo em `/event-tracking` para teste interativo
