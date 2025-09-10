export const mockData = {
    categories: [
        { id: 1, name: '计算机基础', active: true },
        { id: 2, name: '编程语言', active: false },
        { id: 3, name: '软件开发', active: false },
        { id: 4, name: '数据科学', active: false },
        { id: 5, name: '人工智能', active: false },
        { id: 6, name: '网络安全', active: false }
    ],
    banners: {
        1: [
            {
                id: 1,
                title: '计算机组成原理精讲',
                image: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1518770660439-4636190af475")',
                desc: '从硬件到软件的完整计算机体系讲解'
            },
            {
                id: 2,
                title: '数据结构与算法',
                image: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1515879218367-8466d910aaa4")',
                desc: '核心数据结构与经典算法详解'
            },
            {
                id: 3,
                title: '操作系统原理',
                image: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1558494949-ef010cbdcc31")',
                desc: '深入理解计算机操作系统'
            }
        ],
        2: [
            {
                id: 4,
                title: 'Python 编程基础',
                image: 'linear-gradient(to right, #00BCD4, #3F51B5)',
                desc: '最受欢迎的编程语言入门课程'
            },
            {
                id: 5,
                title: 'Java 核心技术',
                image: 'linear-gradient(to right, #009688, #4CAF50)',
                desc: '企业级开发必备技能'
            }
        ],
        3: [
            {
                id: 6,
                title: '软件工程实践',
                image: 'linear-gradient(to right, #FF5722, #FF9800)',
                desc: '规范化的软件开发流程指南'
            },
            {
                id: 7,
                title: '设计模式精讲',
                image: 'linear-gradient(to right, #E91E63, #9C27B0)',
                desc: '23种设计模式系统讲解'
            }
        ],
        4: [
            {
                id: 8,
                title: '数据分析实战',
                image: 'linear-gradient(to right, #2196F3, #03A9F4)',
                desc: 'Python数据分析与可视化'
            },
            {
                id: 9,
                title: '数据库原理',
                image: 'linear-gradient(to right, #673AB7, #3F51B5)',
                desc: '关系型与非关系型数据库详解'
            }
        ],
        5: [
            {
                id: 10,
                title: '机器学习基础',
                image: 'linear-gradient(to right, #795548, #FF5722)',
                desc: '人工智能入门必修课'
            },
            {
                id: 11,
                title: '深度学习实战',
                image: 'linear-gradient(to right, #607D8B, #795548)',
                desc: '神经网络与深度学习应用'
            }
        ],
        6: [
            {
                id: 12,
                title: '网络安全基础',
                image: 'linear-gradient(to right, #795548, #9E9E9E)',
                desc: '信息安全与网络防护'
            },
            {
                id: 13,
                title: '密码学原理',
                image: 'linear-gradient(to right, #607D8B, #455A64)',
                desc: '现代密码学体系详解'
            }
        ]
    },
    categoryCourses: {
        1: [
            {
                id: 101,
                title: '计算机组成原理',
                description: '深入理解计算机硬件体系结构，包括CPU、内存、总线等核心概念',
                image: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
                price: '¥299',
                originalPrice: '¥399',
                students: 12345,
                tags: ['计算机基础', '必修课'],
                teacher: '王教授',
                level: '中级',
                duration: '32学时'
            },
            {
                id: 102,
                title: '数据结构基础',
                description: '常用数据结构详解，包括数组、链表、树、图等，配合算法实战练习',
                image: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
                price: '¥399',
                originalPrice: '¥599',
                students: 8765,
                tags: ['算法', '基础课'],
                teacher: '李教授',
                level: '中级',
                duration: '48学时'
            },
            // ... 更多课程
        ],
        2: [
            {
                id: 201,
                title: 'Python程序设计',
                description: 'Python语言基础知识与高级特性，结合实际案例讲解',
                image: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
                price: '¥199',
                originalPrice: '¥299',
                students: 23456,
                tags: ['Python', '入门'],
                teacher: '张教授',
                level: '初级',
                duration: '24学时'
            },
            // ... 更多课程
        ],
        // ... 其他分类的课程
    },
    hotCourses: [
        {
            id: 1,
            title: 'Vue.js 3.0 企业级应用开发',
            description: '从基础到高级的Vue3完整课程，包含组合式API、响应式原理、性能优化等核心知识',
            image: 'url("https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5")',
            price: '¥399',
            originalPrice: '¥599',
            students: 12345,
            tags: ['Vue3', '实战', '热门'],
            teacher: '张教授',
            level: '中级',
            duration: '24小时'
        },
        {
            id: 2,
            title: 'React 18 实战开发教程',
            description: '最新React特性讲解，结合实际项目的完整课程，包括Hooks、状态管理、性能优化等',
            image: 'url("https://images.unsplash.com/photo-1633356122544-f134324a6cee")',
            price: '¥499',
            originalPrice: '¥699',
            students: 8765,
            tags: ['React', 'Hooks', '进阶'],
            teacher: '李老师',
            level: '高级',
            duration: '32小时'
        },
        {
            id: 3,
            title: 'TypeScript 高级开发实战',
            description: 'TypeScript进阶教程，系统讲解类型系统、装饰器、高级类型等核心概念',
            image: 'url("https://images.unsplash.com/photo-1633356122544-f134324a6cee")',
            price: '¥299',
            originalPrice: '¥459',
            students: 6543,
            tags: ['TypeScript', '进阶', '热门'],
            teacher: '王讲师',
            level: '中级',
            duration: '18小时'
        },
        {
            id: 4,
            title: 'Node.js 服务端开发实践',
            description: '使用 Node.js 开发企业级服务端应用，包含Express、数据库、身份认证等',
            image: 'url("https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b")',
            price: '¥399',
            originalPrice: '¥599',
            students: 4567,
            tags: ['Node.js', '后端', '实战'],
            teacher: '刘教授',
            level: '高级',
            duration: '28小时'
        },
        {
            id: 5,
            title: '微信小程序开发入门到精通',
            description: '完整的小程序开发教程，从基础语法到复杂项目开发，一站式学习',
            image: 'url("https://images.unsplash.com/photo-1633356122544-f134324a6cee")',
            price: '¥299',
            originalPrice: '¥459',
            students: 7890,
            tags: ['小程序', '入门', '热门'],
            teacher: '赵老师',
            level: '初级',
            duration: '20小时'
        },
        {
            id: 6,
            title: 'Flutter 跨平台应用开发',
            description: '使用 Flutter 开发高性能的跨平台应用，覆盖移动端和桌面端开发技术',
            image: 'url("https://images.unsplash.com/photo-1516116216624-53e697fedbea")',
            price: '¥599',
            originalPrice: '¥799',
            students: 3456,
            tags: ['Flutter', '跨平台', '进阶'],
            teacher: '孙讲师',
            level: '高级',
            duration: '36小时'
        }
    ]
} 