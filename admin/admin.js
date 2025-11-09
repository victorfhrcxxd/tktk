/**
 * Painel Admin - TikTok Shop
 * Gerenciamento de Produtos
 */

console.log('✅ admin.js carregado com sucesso!');

// Storage keys
const STORAGE_KEY = 'tiktok_shop_products';
const ANALYTICS_KEY = 'tiktok_shop_analytics';
const EVENTS_KEY = 'tiktok_shop_events';

// Estado global
let products = [];
let editingId = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    renderProducts();
    updateStats();
});

// Carregar produtos do localStorage
function loadProducts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    products = stored ? JSON.parse(stored) : [];
}

// Salvar produtos no localStorage
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Abrir página do produto
function viewProduct(slug) {
    const url = `/#/${slug}`;
    window.open(url, '_blank');
}

// Renderizar lista de produtos
function renderProducts() {
    const container = document.getElementById('products-container');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>Nenhum produto cadastrado</h3>
                <p>Comece criando seu primeiro produto</p>
                <button class="btn btn-primary" onclick="openModal()">
                    ➕ Criar Primeiro Produto
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="products-grid">
            ${products.map(product => `
                <div class="product-card">
                    <img src="../${product.image}" alt="${product.name}" class="product-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23e0e0e0%22/><text x=%2250%25%22 y=%2250%25%22 font-family=%22Arial%22 font-size=%2220%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22>Sem Imagem</text></svg>'">
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">R$ ${parseFloat(product.price).toFixed(2)}</div>
                        <span class="product-status status-${product.status}">
                            ${product.status === 'active' ? '✓ Ativo' : '✗ Inativo'}
                        </span>
                        <div class="product-slug">Slug: ${product.slug}</div>
                        <div class="product-actions">
                            <button class="btn btn-primary btn-small" onclick="viewProduct('${product.slug}')" title="Ver página do produto">
                                👁️ Ver Página
                            </button>
                            <button class="btn btn-secondary btn-small" onclick="editProduct('${product.id}')">
                                ✏️ Editar
                            </button>
                            <button class="btn btn-secondary btn-small" onclick="deleteProduct('${product.id}')">
                                🗑️ Excluir
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Carregar analytics
function loadAnalytics() {
    try {
        const stored = localStorage.getItem('tiktok_shop_analytics');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Erro ao carregar analytics:', e);
    }
    return {
        checkoutViews: 0,
        pixGenerated: 0,
        productViews: {},
        conversionRate: 0
    };
}

// Atualizar estatísticas
function updateStats() {
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('active-products').textContent = 
        products.filter(p => p.status === 'active').length;
    document.getElementById('total-pages').textContent = products.length;
    
    // Atualizar analytics
    const analytics = loadAnalytics();
    document.getElementById('checkout-views').textContent = analytics.checkoutViews || 0;
    document.getElementById('pix-generated').textContent = analytics.pixGenerated || 0;
    document.getElementById('conversion-rate').textContent = 
        (analytics.conversionRate || 0) + '%';
}

// Abrir modal
function openModal(id = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const title = document.getElementById('modal-title');
    
    form.reset();
    editingId = id;
    
    if (id) {
        const product = products.find(p => p.id === id);
        if (product) {
            title.textContent = 'Editar Produto';
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-original-price').value = product.originalPrice || '';
            document.getElementById('product-discount').value = product.discount || '';
            document.getElementById('product-image').value = product.image;
            document.getElementById('product-gallery').value = product.gallery ? product.gallery.join(', ') : '';
            document.getElementById('product-description').value = product.description || '';
            document.getElementById('product-full-description').value = product.fullDescription || '';
            document.getElementById('product-slug').value = product.slug;
            document.getElementById('product-status').value = product.status;
            document.getElementById('product-stock').value = product.stock || '';
        }
    } else {
        title.textContent = 'Novo Produto';
    }
    
    modal.classList.add('active');
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    editingId = null;
}

// Salvar produto
function saveProduct(event) {
    event.preventDefault();
    
    const productData = {
        id: editingId || generateId(),
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        originalPrice: parseFloat(document.getElementById('product-original-price').value) || null,
        discount: parseInt(document.getElementById('product-discount').value) || null,
        image: document.getElementById('product-image').value,
        gallery: document.getElementById('product-gallery').value
            .split(',')
            .map(s => s.trim())
            .filter(s => s),
        description: document.getElementById('product-description').value,
        fullDescription: document.getElementById('product-full-description').value,
        slug: document.getElementById('product-slug').value,
        status: document.getElementById('product-status').value,
        stock: parseInt(document.getElementById('product-stock').value) || null,
        createdAt: editingId ? products.find(p => p.id === editingId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (editingId) {
        // Atualizar produto existente
        const index = products.findIndex(p => p.id === editingId);
        products[index] = productData;
        showAlert('success', `Produto "${productData.name}" atualizado com sucesso!`);
    } else {
        // Adicionar novo produto
        products.push(productData);
        showAlert('success', `Produto "${productData.name}" criado com sucesso!`);
    }
    
    saveToStorage();
    renderProducts();
    updateStats();
    closeModal();
    
    // Gerar arquivo de configuração dos produtos
    generateProductsConfig();
}

// Editar produto
function editProduct(id) {
    openModal(id);
}

// Excluir produto
function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
        products = products.filter(p => p.id !== id);
        saveToStorage();
        renderProducts();
        updateStats();
        showAlert('success', 'Produto excluído com sucesso!');
        generateProductsConfig();
    }
}

// Gerar ID único
function generateId() {
    return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Mostrar alerta
function showAlert(type, message) {
    const container = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <strong>${type === 'success' ? '✓' : '✗'}</strong>
        <span>${message}</span>
    `;
    container.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Exportar dados
function exportData() {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `produtos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showAlert('success', 'Dados exportados com sucesso!');
}

// Importar dados
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (Array.isArray(imported)) {
                    products = imported;
                    saveToStorage();
                    renderProducts();
                    updateStats();
                    generateProductsConfig();
                    showAlert('success', `${imported.length} produtos importados com sucesso!`);
                } else {
                    showAlert('error', 'Formato de arquivo inválido!');
                }
            } catch (error) {
                showAlert('error', 'Erro ao importar arquivo: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Gerar arquivo de configuração para o site
function generateProductsConfig() {
    const config = {
        products: products.filter(p => p.status === 'active').map(p => ({
            id: p.slug,
            name: p.name,
            price: p.price,
            originalPrice: p.originalPrice,
            discount: p.discount,
            image: p.image,
            gallery: p.gallery,
            description: p.description,
            fullDescription: p.fullDescription,
            stock: p.stock
        }))
    };
    
    // Salva no localStorage para o site principal acessar
    localStorage.setItem('tiktok_shop_products_config', JSON.stringify(config));
    
    console.log('Configuração de produtos atualizada:', config);
}

// Fechar modal ao clicar fora
document.getElementById('product-modal').addEventListener('click', (e) => {
    if (e.target.id === 'product-modal') {
        closeModal();
    }
});

// Auto-gerar slug ao digitar nome
document.getElementById('product-name').addEventListener('input', (e) => {
    if (!editingId) {
        const slug = e.target.value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        document.getElementById('product-slug').value = slug;
    }
});

// ============================================
// ANALYTICS FUNCTIONS
// ============================================

// Carregar eventos do histórico
function loadEvents() {
    try {
        const stored = localStorage.getItem(EVENTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.warn('Erro ao carregar eventos:', e);
        return [];
    }
}

// Mostrar histórico de analytics
function showAnalyticsHistory() {
    const events = loadEvents();
    const analytics = loadAnalytics();
    
    if (events.length === 0) {
        alert('📊 Nenhum evento registrado ainda!\n\nOs eventos aparecerão aqui quando:\n- Alguém acessar o checkout\n- Alguém gerar um código PIX');
        return;
    }
    
    // Criar HTML para modal de histórico
    let html = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;" onclick="this.remove()">
            <div style="background: white; max-width: 900px; width: 100%; max-height: 90vh; overflow: auto; border-radius: 12px; padding: 30px;" onclick="event.stopPropagation()">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 style="margin: 0;">📊 Histórico de Analytics</h2>
                    <button onclick="this.closest('div').parentElement.remove()" style="background: #ff6b6b; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">✕ Fechar</button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px;">
                        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">ACESSOS AO CHECKOUT</div>
                        <div style="font-size: 28px; font-weight: 700;">${analytics.checkoutViews || 0}</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 8px;">
                        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">PIX GERADOS</div>
                        <div style="font-size: 28px; font-weight: 700;">${analytics.pixGenerated || 0}</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; border-radius: 8px;">
                        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">TAXA DE CONVERSÃO</div>
                        <div style="font-size: 28px; font-weight: 700;">${analytics.conversionRate || 0}%</div>
                    </div>
                </div>
                
                <h3 style="margin-bottom: 15px;">Últimos Eventos (${events.length})</h3>
                
                <div style="max-height: 400px; overflow-y: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #f5f5f5; text-align: left;">
                                <th style="padding: 12px; border-bottom: 2px solid #ddd;">Tipo</th>
                                <th style="padding: 12px; border-bottom: 2px solid #ddd;">Produto</th>
                                <th style="padding: 12px; border-bottom: 2px solid #ddd;">Valor</th>
                                <th style="padding: 12px; border-bottom: 2px solid #ddd;">Data/Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${events.slice().reverse().map(event => {
                                const date = new Date(event.timestamp);
                                const dateStr = date.toLocaleDateString('pt-BR');
                                const timeStr = date.toLocaleTimeString('pt-BR');
                                
                                let icon = '👁️';
                                let color = '#667eea';
                                let typeText = 'Checkout';
                                
                                if (event.type === 'pix_generated') {
                                    icon = '💰';
                                    color = '#f5576c';
                                    typeText = 'PIX Gerado';
                                } else if (event.type === 'product_view') {
                                    icon = '📦';
                                    color = '#4facfe';
                                    typeText = 'Visualização';
                                }
                                
                                const amount = event.amount ? `R$ ${parseFloat(event.amount).toFixed(2)}` : '-';
                                
                                return `
                                    <tr style="border-bottom: 1px solid #eee;">
                                        <td style="padding: 12px;">
                                            <span style="background: ${color}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
                                                ${icon} ${typeText}
                                            </span>
                                        </td>
                                        <td style="padding: 12px;">${event.productName || '-'}</td>
                                        <td style="padding: 12px; font-weight: 600;">${amount}</td>
                                        <td style="padding: 12px; font-size: 13px; color: #666;">
                                            ${dateStr}<br>${timeStr}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

// Resetar analytics
function resetAnalytics() {
    if (!confirm('🔄 Tem certeza que deseja resetar TODOS os dados de analytics?\n\nIsso incluirá:\n- Acessos ao checkout\n- PIX gerados\n- Taxa de conversão\n- Histórico de eventos\n\n⚠️ Esta ação não pode ser desfeita!')) {
        return;
    }
    
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify({
        checkoutViews: 0,
        pixGenerated: 0,
        productViews: {},
        conversionRate: 0,
        lastReset: new Date().toISOString()
    }));
    
    localStorage.setItem(EVENTS_KEY, JSON.stringify([]));
    
    updateStats();
    
    alert('✅ Analytics resetado com sucesso!');
    console.log('📊 Analytics resetado!');
}

