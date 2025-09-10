const express = require('express')
const router = express.Router()
const bannerController = require('../controllers/banner')
const categoryController = require('../controllers/category')
const productController = require('../controllers/product')
const userController = require('../controllers/user')
const cartController = require('../controllers/cart')
const orderController = require('../controllers/order')
const addressController = require('../controllers/address')
const sellerController = require('../controllers/seller')
const uploadController = require('../controllers/upload')
const adminController = require('../controllers/admin')
const { checkLogin, checkAdmin } = require('../middleware/auth')

// 轮播图相关接口
router.get('/banners', bannerController.getBanners)
router.post('/admin/banners', bannerController.createBanner)
router.put('/admin/banners/:id', bannerController.updateBanner)
router.delete('/admin/banners/:id', bannerController.deleteBanner)

// 商品分类接口
router.get('/categories', categoryController.getCategories)
router.get('/categories/:id/products', categoryController.getCategoryProducts)

// 订单��关接口
router.get('/orders/my', orderController.getMyOrders)
router.get('/orders/stats', orderController.getOrderStats)
router.get('/orders/search', orderController.searchOrders)
router.get('/orders/:orderNo', orderController.getOrderDetail)
router.post('/orders', orderController.createOrder)
router.post('/orders/:order_no/pay', orderController.payOrder)
router.post('/orders/:orderNo/cancel', orderController.cancelOrder)
router.post('/orders/:orderNo/receive', orderController.confirmReceive)

// 商品相关接口
router.get('/products/search', productController.searchProducts)
router.get('/products/hot', productController.getHotProducts)
router.get('/products/:id', productController.getProductDetail)

// 用户相关接口
router.post('/user/register', userController.register)
router.post('/user/login', userController.login)
router.post('/user/become-seller', userController.becomeSeller)
router.put('/user/profile', userController.updateProfile)

// 购物车相关接口
router.get('/cart/:userId', cartController.getCartItems)
router.post('/cart/add', cartController.addToCart)
router.put('/cart/quantity', cartController.updateQuantity)
router.delete('/cart/:id', cartController.removeItem)
router.post('/cart/batch-remove', cartController.batchRemove)

// 地址相关接口
router.get('/addresses/:userId', addressController.getAddresses)
router.post('/addresses', addressController.addAddress)
router.put('/addresses/:id', addressController.updateAddress)
router.delete('/addresses/:id', addressController.deleteAddress)

// 商家相关接口
router.get('/seller/products', sellerController.getProducts)
router.post('/seller/products', sellerController.createProduct)
router.put('/seller/products/:id', sellerController.updateProduct)
router.delete('/seller/products/:id', sellerController.deleteProduct)
router.put('/seller/products/:id/status', sellerController.updateProductStatus)

router.get('/seller/orders', sellerController.getOrders)
router.post('/seller/orders/:orderNo/ship', sellerController.shipOrder)
router.post('/seller/orders/:orderNo/cancel', sellerController.cancelOrder)

router.get('/seller/products/search', productController.searchSellerProducts)

// 文件上传接口
router.post('/upload', uploadController.uploadFile)

// 用户管理相关接口
router.get('/admin/users', adminController.getUsers)
router.put('/admin/users/:id', adminController.updateUser)
router.delete('/admin/users/:id', adminController.deleteUser)

// 分类管理相关接口
router.get('/categories', categoryController.getCategories)
router.post('/admin/categories', categoryController.createCategory)
router.put('/admin/categories/:id', categoryController.updateCategory)
router.delete('/admin/categories/:id', categoryController.deleteCategory)

module.exports = router