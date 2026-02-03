# 🚀 QUICK START - Comece em 5 minutos!

## 1️⃣ Veja a Demo Interativa (2 min)

```bash
npm run dev
```

Acesse: **http://localhost:9000/event-tracking**

Interface completa com:
- ✅ Todos os 5 eventos
- ✅ Gerenciamento de carrinho
- ✅ Console ao vivo
- ✅ Teste de cupons

---

## 2️⃣ Use em Seu Componente (2 min)

```javascript
import { trackViewItem, trackAddToCart } from '@/services/gtmEvents'

// Ver ingresso
trackViewItem({
  item_id: 'evt_001',
  item_name: 'Show Name',
  price: 350,
  event_date: '2026-06-15',
  venue: 'Stadium',
  artist: 'Artist'
})

// Adicionar ao carrinho
trackAddToCart([{ ...ticket, quantity: 1 }], 350)
```

---

## 3️⃣ Verifique no Console (1 min)

Abra **F12** → **Console**

```javascript
// Ver todos os eventos
console.log(window.dataLayer)

// Ver últimos 5
console.log(window.dataLayer.slice(-5))

// Ver transações
window.dataLayer.filter(e => e.event === 'purchase')
```

---

## 📚 Documentação por Nível

### Iniciante
- [README_GTM.md](README_GTM.md) - Exemplos básicos

### Intermediário
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Guia passo a passo

### Avançado
- [GTM_IMPLEMENTATION_GUIDE.md](GTM_IMPLEMENTATION_GUIDE.md) - Referência completa

---

## 🎯 Eventos em 30 segundos

| Evento | Quando usar |
|--------|------------|
| **view_item** | Usuário vê detalhes do ingresso |
| **add_to_cart** | Clica "Adicionar ao Carrinho" |
| **begin_checkout** | Clica "Checkout" |
| **add_payment_info** | Seleciona forma de pagamento |
| **purchase** | Compra confirmada |

---

## 🧪 Testar Rápido

Copie no console do browser (F12):

```javascript
import { runExample } from '@/services/gtmEvents.examples'
runExample(1)  // Fluxo completo
```

Ou execute testes:

```javascript
import { runAllTests } from '@/services/gtmEvents.tests'
runAllTests()
```

---

## 📁 Arquivos Principais

```
✅ src/services/gtmEvents.js         → Serviço principal
✅ src/pages/EventTrackingPage.vue   → Demo interativa
✅ src/components/TicketCard.vue      → Componente reutilizável
✅ README_GTM.md                      → Documentação rápida
```

---

## ❓ Estou preso!

1. **Evento não aparece?**
   - Verifique: `console.log(window.dataLayer)`

2. **Erro no console?**
   - Verifique importação: `import { trackViewItem } from '@/services/gtmEvents'`

3. **Precisa de exemplo?**
   - Veja: `INTEGRATION_GUIDE.md`

4. **Quer testar?**
   - Acesse: `/event-tracking`

---

## ✨ Próximas Etapas

1. ✅ Entender os eventos
2. ✅ Integrar em seus componentes
3. ⏭️ Configurar no Google Tag Manager
4. ⏭️ Testar em Preview Mode
5. ⏭️ Monitorar em Google Analytics 4

---

## 📞 Links Rápidos

- 📖 [Documentação Completa](GTM_IMPLEMENTATION_GUIDE.md)
- 🔧 [Guia de Integração](INTEGRATION_GUIDE.md)
- ✅ [Checklist](IMPLEMENTATION_CHECKLIST.md)
- 🎬 [Demo Interativa](/event-tracking)

---

**Pronto? Comece agora! 🚀**
