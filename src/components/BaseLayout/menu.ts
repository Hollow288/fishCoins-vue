import { Menus } from '@/types/menu';

export const menuData: Menus[] = [
    {
        id: '0',
        title: '系统首页',
        index: '/dashboard',
        icon: 'Compass',
    },
    {
        id: '1',
        title: '其他',
        index: '1',
        icon: 'More',
        children: [
            {
                id: '10',
                pid: '1',
                index: '/Blog',
                title: '博客文章',
                icon: 'Tickets'
            }
        ]
    },
    {
        id: '8',
        title: 'Hotta',
        index: '8',
        icon: 'MostlyCloudy',
        children: [
            {
                id: '81',
                pid: '8',
                index: '/IllustratedArms',
                title: '武器图鉴',
                icon: 'CopyDocument'
            },
            {
                id: '82',
                pid: '8',
                index: '/IllustratedWillpower',
                title: '意志图鉴',
                icon: 'FullScreen'
            },
            {
                id: '83',
                pid: '8',
                index: '/IllustratedMimicry',
                title: '拟态图鉴',
                icon: 'Star'
            },
            {
                id: '86',
                pid: '8',
                index: '/EventNews',
                title: '活动资讯',
                icon: 'Bell'
            },
            {
                id: '87',
                pid: '8',
                index: '/Food',
                title: '食物图鉴',
                icon: 'Food'
            }
        ],
    }
];
