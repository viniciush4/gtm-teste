# LEIA-ME PRIMEIRO

## Implementação Completa de GTM E-commerce para Venda de Ingressos

### 🚀 COMECE AGORA

```bash
npm run dev
```

Acesse: `http://localhost:9000/event-tracking`

### 📚 O QUE FOI IMPLEMENTADO

- ✅ 5 Eventos GTM (view_item, add_to_cart, begin_checkout, add_payment_info, purchase)
- ✅ Serviço centralizado (src/services/gtmEvents.js)
- ✅ Componentes reutilizáveis
- ✅ Página de demo interativa
- ✅ 7 exemplos práticos
- ✅ Testes automatizados
- ✅ Documentação completa

### 📖 LEIA NESTA ORDEM

1. **QUICK_START.md** (5 minutos) - Comece aqui
2. **README_GTM.md** (15 minutos) - Referência rápida
3. **INTEGRATION_GUIDE.md** - Como integrar em seus componentes
4. **GTM_IMPLEMENTATION_GUIDE.md** - Documentação técnica completa
5. **FILE_INDEX.md** - Índice de todos os arquivos

### 💡 EXEMPLO RÁPIDO

```javascript
import { trackViewItem, trackAddToCart, trackPurchase } from '@/services/gtmEvents'

// Ver ingresso
trackViewItem({
  item_id: 'evt_001',
  item_name: 'Show Metallica',
  price: 350,
  event_date: '2026-06-15',
  venue: 'Morumbi Stadium',
  artist: 'Metallica'
})

// Verificar no console
console.log(window.dataLayer)
```

### ✨ PRÓXIMAS ETAPAS

1. Leia QUICK_START.md
2. Teste /event-tracking
3. Integre em seu componente
4. Configure no Google Tag Manager
5. Deploy em produção

---

**Tudo está pronto para uso!** 🎉
