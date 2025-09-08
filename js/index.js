// === Funções temporais relógio em tempo real ===
    function atualizaHora() {
      const agora = new Date();
      document.getElementById('hora-atual').textContent = agora.toLocaleString('pt-BR');
    }
    setInterval(atualizaHora, 1000);
    atualizaHora();

    // === Lógica de agendamento: habilita campos quando for tele‑entrega ===
    const entregaRetirada = document.getElementById('entrega-retirada');
    const entregaTele = document.getElementById('entrega-tele');
    const camposAgendamento = [
      document.getElementById('data-entrega'),
      document.getElementById('hora-entrega'),
      document.getElementById('obs-entrega')
    ];

    function aplicaEstadoAgendamento() {
      const habilitar = entregaTele.checked;
      camposAgendamento.forEach(el => {
        el.disabled = !habilitar;
        if (!habilitar) el.value = '';
      });
      if (habilitar) {
        const hoje = new Date();
        const yyyy = hoje.getFullYear();
        const mm = String(hoje.getMonth() + 1).padStart(2, '0');
        const dd = String(hoje.getDate()).padStart(2, '0');
        document.getElementById('data-entrega').min = `${yyyy}-${mm}-${dd}`;
        document.getElementById('hora-entrega').min = '09:00';
        document.getElementById('hora-entrega').max = '20:00';
      }
    }
    entregaRetirada.addEventListener('change', aplicaEstadoAgendamento);
    entregaTele.addEventListener('change', aplicaEstadoAgendamento);
    aplicaEstadoAgendamento();

    // === Carrinho de compras. Não é pedido no projeto, mas quis implementar um carrinho de compras pra fazer sentido os botões de "Adicionar e remover" do carrinho. ===
    const cart = new Map();
    const fmtBRL = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    function addItem(id, name, price) {
      if (cart.has(id)) cart.get(id).qty += 1; else cart.set(id, { name, price: Number(price), qty: 1 });
      renderCart();
    }
    function removeOne(id) {
      if (!cart.has(id)) return;
      const it = cart.get(id);
      it.qty -= 1;
      if (it.qty <= 0) cart.delete(id);
      renderCart();
    }

    function removeAll(id) { cart.delete(id); renderCart(); }

    function renderCart() {
      const tbody = document.getElementById('cart-items');
      tbody.innerHTML = '';
      let total = 0, count = 0;
      for (const [id, it] of cart.entries()) {
        const subtotal = it.price * it.qty;
        total += subtotal; count += it.qty;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <th scope="row">${it.name}</th>
          <td class="text-center">
            <div class="btn-group btn-group-sm" role="group" aria-label="Quantidade">
              <button class="btn btn-outline-secondary" data-act="dec" data-id="${id}" aria-label="Diminuir">−</button>
              <span class="btn btn-light disabled">${it.qty}</span>
              <button class="btn btn-outline-secondary" data-act="inc" data-id="${id}" aria-label="Aumentar">+</button>
            </div>
          </td>
          <td class="text-end">${fmtBRL(it.price)}</td>
          <td class="text-end">${fmtBRL(subtotal)}</td>
          <td class="text-center"><button class="btn btn-sm btn-outline-danger" data-act="rm" data-id="${id}">Remover</button></td>`;
        tbody.appendChild(tr);
      }
      if (cart.size === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-muted">Seu carrinho está vazio.</td></tr>';
      }
      document.getElementById('cart-total').textContent = fmtBRL(total);
      document.getElementById('cart-count').textContent = String(count);
      document.getElementById('btn-finalizar').disabled = count === 0;
    }

    document.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', e => {
        const { id, name, price } = e.currentTarget.dataset;
        addItem(id, name, price);
      });
    });
    document.querySelectorAll('.btn-rem').forEach(btn => {
      btn.addEventListener('click', e => {
        const { id } = e.currentTarget.dataset;
        removeOne(id);
      });
    });

    // Delegação: ações dentro da tabela do carrinho (+, −, Remover)
    document.getElementById('cart-items').addEventListener('click', e => {
      const btn = e.target.closest('button[data-act]');
      if (!btn) return;
      const { act, id } = btn.dataset;
      if (act === 'inc') {
        const it = cart.get(id); if (it) addItem(id, it.name, it.price);
      } else if (act === 'dec') {
        removeOne(id);
      } else if (act === 'rm') {
        removeAll(id);
      }
    });

    // Botões gerais
    document.getElementById('btn-limpar').addEventListener('click', () => { cart.clear(); renderCart(); });
    document.getElementById('btn-finalizar').addEventListener('click', () => {
      alert('Pedido finalizado! (simulação)');
    });

    renderCart();