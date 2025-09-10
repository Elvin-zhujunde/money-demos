// 产品数据
const products = [
    {
        id: 1,
        name: "广式月饼礼盒",
        price: 199,
        originalPrice: 299,
        image: "./images/product1.jpeg",
        description: "传统口味 精致礼盒",
        sales: 2000,
        category: "礼盒套装",
        specs: "8枚装",
        weight: "800g",
        flavors: ["五仁", "莲蓉", "豆沙", "枣泥"],
        features: ["精选食材", "传统工艺", "送礼佳品"],
        stock: 500,
        rating: 4.8,
        reviews: 1256
    },
    {
        id: 2,
        name: "流心奶黄月饼",
        price: 288,
        originalPrice: 388,
        image: "./images/product2.jpeg",
        description: "流心工艺 香浓奶黄",
        sales: 1500,
        category: "流心月饼",
        specs: "6枚装",
        weight: "600g",
        flavors: ["奶黄流心", "巧克力流心"],
        features: ["爆浆流心", "香浓内馅", "创新工艺"],
        stock: 300,
        rating: 4.9,
        reviews: 856
    },
    {
        id: 4,
        name: "传统五仁月饼",
        price: 168,
        originalPrice: 258,
        image: "./images/product4.jpeg",
        description: "经典五仁 果香浓郁",
        sales: 2500,
        category: "传统月饼",
        specs: "4枚装",
        weight: "400g",
        flavors: ["五仁"],
        features: ["传统配方", "果仁饱满"],
        stock: 800,
        rating: 4.7,
        reviews: 1589
    },
    {
        id: 5,
        name: "冰皮月饼礼盒",
        price: 228,
        originalPrice: 328,
        image: "./images/product5.jpeg",
        description: "清凉爽滑 入口即化",
        sales: 1800,
        category: "礼盒套装",
        specs: "6枚装",
        weight: "480g",
        flavors: ["抹茶", "芒果", "巧克力"],
        features: ["冰皮外壳", "果味内馅", "低糖配方"],
        stock: 400,
        rating: 4.8,
        reviews: 968
    }
];

// 动态生成产品卡片
function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    // 判断是否在商品列表页
    const isProductsPage = document.querySelector('.products-page');
    const productsToShow = isProductsPage ? products : products.slice(0, 3);

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <a href="product-detail.html?id=${product.id}" class="product-link"></a>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <div class="price-info">
                    <span class="current-price">¥${product.price}</span>
                    <span class="original-price">¥${product.originalPrice}</span>
                </div>
                <div class="sales-info">
                    <span>已售${product.sales}件</span>
                </div>
                <button class="buy-button" onclick="addToCart(${product.id})">
                    ${isProductsPage ? '加入购物车' : '立即购买'}
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// 倒计时功能
function initCountdown() {
    const updateCountdown = () => {
        const now = new Date();
        const end = new Date();
        end.setHours(23, 59, 59);
        
        const diff = end - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.querySelector('.countdown').innerHTML = `
            <span class="time-block">${String(hours).padStart(2, '0')}</span>:
            <span class="time-block">${String(minutes).padStart(2, '0')}</span>:
            <span class="time-block">${String(seconds).padStart(2, '0')}</span>
        `;
    };
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// 页面滚动动画
function initScrollAnimation() {
    const elements = document.querySelectorAll('.feature-item, .story-feature');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    });
    
    elements.forEach(element => observer.observe(element));
}

// 添加分类标签点击事件
function initCategoryTags() {
    const tags = document.querySelectorAll('.category-tags .tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            // 这里可以添加筛选逻辑
        });
    });
}

// 添加排序功能
function initSortOptions() {
    const sortLinks = document.querySelectorAll('.sort-options a');
    sortLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sortLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            // 这里可以添加排序逻辑
        });
    });
}

// 更新初始化函数
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    initAnimation();
    initCountdown();
    initScrollAnimation();

    // 在商品列表页初始化额外功能
    if (document.querySelector('.products-page')) {
        initCategoryTags();
        initSortOptions();
    }
});

// 初始化动画效果
function initAnimation() {
    // 添加灯笼摆动动画
    const lanterns = document.querySelectorAll('.lantern');
    lanterns.forEach((lantern, index) => {
        lantern.style.animationDelay = `${index * 0.5}s`;
    });
} 