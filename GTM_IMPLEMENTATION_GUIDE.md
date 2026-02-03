# Guia de Implementação - Eventos GTM para E-commerce de Ingressos

## Visão Geral

Este projeto implementa o rastreamento de eventos do Google Tag Manager (GTM) seguindo a estrutura recomendada pelo Google para e-commerce, especificamente adaptado para a venda de ingressos.

## Serviço de Eventos GTM

O serviço centralizado está localizado em: [src/services/gtmEvents.js](src/services/gtmEvents.js)

### Eventos Implementados

#### 1. **view_item** - Visualizar Ingresso
Disparado quando um usuário visualiza detalhes de um ingresso.

```javascript
import { trackViewItem } from '@/services/gtmEvents'

trackViewItem({
  item_id: 'evt_metallica_sp_2026',
  item_name: 'Show Metallica - São Paulo',
  item_category: 'event_ticket',
  item_variant: 'inteira',
  price: 350.00,
  currency: 'BRL',
  event_date: '2026-06-15',
  venue: 'Morumbi Stadium',
  artist: 'Metallica'
})
```

**Estrutura de Dados:**
- `item_id` (string): ID único do ingresso
- `item_name` (string): Nome do evento
- `item_category` (string): Categoria (ex: event_ticket)
- `item_variant` (string): Tipo de ingresso (inteira, meia, cortesia)
- `price` (number): Preço unitário
- `currency` (string): Moeda (BRL)
- `event_date` (string): Data do evento (YYYY-MM-DD)
- `venue` (string): Local do evento
- `artist` (string): Artista/Banda

---

#### 2. **add_to_cart** - Adicionar ao Carrinho
Disparado quando um ou mais ingressos são adicionados ao carrinho.

```javascript
import { trackAddToCart } from '@/services/gtmEvents'

const items = [
  {
    item_id: 'evt_metallica_sp_2026',
    item_name: 'Show Metallica - São Paulo',
    item_category: 'event_ticket',
    item_variant: 'inteira',
    price: 350.00,
    quantity: 2,
    currency: 'BRL',
    event_date: '2026-06-15',
    venue: 'Morumbi Stadium',
    artist: 'Metallica'
  }
]

trackAddToCart(items, 700.00) // items, cartValue
```

**Estrutura de Dados:**
- Mesmos campos de `view_item`, mais:
- `quantity` (number): Quantidade de ingressos

---

#### 3. **begin_checkout** - Iniciar Checkout
Disparado quando o usuário inicia o processo de checkout.

```javascript
import { trackBeginCheckout } from '@/services/gtmEvents'

trackBeginCheckout(
  items,  // array de ingressos
  700.00, // valor total
  {
    user_id: '123',
    email: 'customer@example.com'
  }
)
```

**Estrutura de Dados:**
- Informações de ingressos (array)
- `value` (number): Valor total do carrinho
- `user_id` (string): ID do usuário
- `email` (string): Email do usuário

---

#### 4. **add_payment_info** - Informações de Pagamento
Disparado quando o usuário seleciona/confirma método de pagamento.

```javascript
import { trackAddPaymentInfo } from '@/services/gtmEvents'

trackAddPaymentInfo(
  items,
  700.00,
  {
    coupon: 'SAVE10',
    payment_method: 'credit_card',
    payment_type: 'online',
    installments: 3
  }
)
```

**Estrutura de Dados:**
- Informações de ingressos (array)
- `value` (number): Valor total
- `coupon` (string): Código de cupom (opcional)
- `payment_method` (string): Método de pagamento
  - `credit_card`: Cartão de crédito
  - `debit_card`: Cartão de débito
  - `pix`: PIX
  - `boleto`: Boleto bancário
- `payment_type` (string): Tipo de pagamento (online, offline)
- `installments` (number): Número de parcelas

---

#### 5. **purchase** - Finalizar Compra
Disparado quando a compra é concluída com sucesso.

```javascript
import { trackPurchase } from '@/services/gtmEvents'

trackPurchase({
  transaction_id: 'txn_abc123def456',
  affiliation: 'Ticket Marketplace',
  items: [
    {
      item_id: 'evt_metallica_sp_2026',
      item_name: 'Show Metallica - São Paulo',
      item_category: 'event_ticket',
      item_variant: 'inteira',
      price: 350.00,
      quantity: 2,
      currency: 'BRL',
      event_date: '2026-06-15',
      venue: 'Morumbi Stadium',
      artist: 'Metallica'
    }
  ],
  value: 700.00,
  tax: 105.00,
  shipping: 0,
  currency: 'BRL',
  coupon: 'SAVE10',
  user_id: '123',
  email: 'customer@example.com',
  customer_lifetime_value: 2450.00,
  payment_method: 'credit_card'
})
```

**Estrutura de Dados:**
- `transaction_id` (string): ID único da transação
- `affiliation` (string): Nome da loja/marketplace
- `items` (array): Array de ingressos comprados
- `value` (number): Valor total da compra
- `tax` (number): Valor de impostos
- `shipping` (number): Valor de frete (geralmente 0 para ingressos)
- `currency` (string): Moeda
- `coupon` (string): Código de cupom utilizado
- `user_id` (string): ID do usuário
- `email` (string): Email do usuário
- `customer_lifetime_value` (number): Valor do cliente ao longo do tempo
- `payment_method` (string): Método de pagamento utilizado

---

## Funções Auxiliares

### setUserInfo
Define informações do usuário no dataLayer para contexto em todos os eventos.

```javascript
import { setUserInfo } from '@/services/gtmEvents'

setUserInfo({
  user_id: '123',
  email: 'user@example.com',
  user_type: 'premium',
  country: 'BR'
})
```

### clearEcommerce
Limpa dados de e-commerce do dataLayer para evitar conflitos entre eventos.

```javascript
import { clearEcommerce } from '@/services/gtmEvents'

clearEcommerce()
```

---

## Estrutura do DataLayer

O GTM organiza os dados no seguinte padrão:

```javascript
{
  event: 'view_item',
  ecommerce: {
    items: [
      {
        item_id: 'evt_metallica_sp_2026',
        item_name: 'Show Metallica - São Paulo',
        item_category: 'event_ticket',
        item_variant: 'inteira',
        price: 350.00,
        quantity: 1,
        currency: 'BRL',
        event_date: '2026-06-15',
        venue: 'Morumbi Stadium',
        artist: 'Metallica'
      }
    ]
  },
  value: 350.00,
  currency: 'BRL'
}
```

---

## Exemplo de Implementação Completa

Veja a página de demonstração em: [src/pages/EventTrackingPage.vue](src/pages/EventTrackingPage.vue)

Acesse a página em: `http://localhost:xxxx/event-tracking`

---

## Campos Específicos para Ingressos

### item_variant (Tipo de Ingresso)
- `inteira`: Ingresso inteiro
- `meia`: Meia entrada
- `cortesia`: Cortesia/Brinde
- `vip`: Ingresso VIP
- `camarote`: Camarote
- `pista`: Pista
- `arquibancada`: Arquibancada

### Campos Personalizados
Os seguintes campos foram adicionados para contexto de ingressos:

- `event_date`: Data do evento (YYYY-MM-DD)
- `venue`: Local do evento (estádio, casa de show, etc)
- `artist`: Nome do artista ou banda

---

## Integração com o GTM

A tag do GTM está configurada no `index.html`:

```html
<!-- Google Tag Manager -->
<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-MPF5B7TZ');
</script>
<!-- End Google Tag Manager -->
```

---

## Boas Práticas

1. **Sempre limpar ecommerce entre eventos diferentes:**
   ```javascript
   clearEcommerce()
   trackViewItem(item)
   ```

2. **Usar IDs únicos para transações:**
   ```javascript
   const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
   ```

3. **Definir informações do usuário uma única vez:**
   ```javascript
   setUserInfo(userInfo)
   ```

4. **Validar dados antes de enviar:**
   ```javascript
   if (item.price && item.item_id) {
     trackViewItem(item)
   }
   ```

5. **Manter consistência de moeda:**
   Sempre usar 'BRL' para o mercado brasileiro

---

## Verificação no Console

Para verificar os eventos no console do browser:

1. Abra Developer Tools (F12)
2. Vá para a aba Console
3. Execute:
   ```javascript
   console.log(window.dataLayer)
   ```

4. Ou visualize os últimos eventos em tempo real:
   ```javascript
   window.dataLayer.slice(-5)
   ```

---

## Próximos Passos

1. Criar tags no Google Tag Manager para cada evento
2. Configurar conversões e objetivos
3. Integrar com Google Analytics 4
4. Configurar relatórios customizados
5. Testar com o GTM Preview Mode

---

## Suporte

Para dúvidas sobre a implementação do GTM, consulte:
- [Google Merchandising Recommended Events](https://developers.google.com/tag-platform/gtagjs/reference/events)
- [Google Analytics 4 Events](https://support.google.com/analytics/answer/13316687)
