// 获取URL参数中的商品ID
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));

// 显示提示信息
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    const container = document.querySelector('.toast-container');
    container.appendChild(toast);
    
    // 添加动画
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 渲染商品详情
function renderProductDetail() {
    const product = products.find(p => p.id === productId);
    if (!product) {
        location.href = '/products.html';
        return;
    }

    // 更新页面标题
    document.title = `${product.name} - 天猫中秋月饼专卖`;

    // 设置主图
    document.getElementById('main-product-image').src = product.image;
    document.getElementById('main-product-image').alt = product.name;

    // 更新商品信息
    document.querySelector('.product-title').textContent = product.name;
    document.querySelector('.rating-score').textContent = product.rating;
    document.querySelector('.review-count').textContent = `(${product.reviews}条评价)`;
    document.querySelector('.sales-count').textContent = `月销${product.sales}件`;
    document.querySelector('.current-price').textContent = `¥${product.price}`;
    document.querySelector('.original-price').textContent = `¥${product.originalPrice}`;
    document.querySelector('.stock-info').textContent = `库存${product.stock}件`;

    // 渲染规格选项
    const specOptions = document.querySelector('.spec-options');
    specOptions.innerHTML = `<span class="spec-option active">${product.specs}</span>`;

    // 渲染口味选项
    const flavorOptions = document.querySelector('.flavor-options');
    flavorOptions.innerHTML = product.flavors.map(flavor => 
        `<span class="flavor-option">${flavor}</span>`
    ).join('');

    // 渲染商品特色
    const featureList = document.querySelector('.feature-list');
    featureList.innerHTML = product.features.map(feature =>
        `<li><i class="icon-check"></i>${feature}</li>`
    ).join('');
}

// 初始化数量选择器
function initQuantitySelector() {
    const input = document.querySelector('.quantity-controls input');
    const decreaseBtn = document.querySelector('.decrease');
    const increaseBtn = document.querySelector('.increase');
    
    decreaseBtn.addEventListener('click', () => {
        if (input.value > 1) input.value--;
    });
    
    increaseBtn.addEventListener('click', () => {
        input.value++;
    });
}

// 初始化加入购物车功能
function initAddToCart() {
    const addToCartBtn = document.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(document.querySelector('.quantity-controls input').value);
        // 这里可以添加购物车逻辑
        showToast(`成功加入购物车 ${quantity} 件商品`);
    });
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    renderProductDetail();
    initQuantitySelector();
    initAddToCart();
}); 