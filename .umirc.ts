import { defineConfig } from "umi";
const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  plugins: ['@umijs/plugins/dist/model','@umijs/plugins/dist/locale','@umijs/plugins/dist/request'],
  model: {},
  request: {},
  routes: [
    { path: "/login", component: "./login/login", layout: false },
    { path: "/", component: "./index" },
    {
      path: '/CRSMTrove',
      name: 'CRSM',
      component: './CRSMTrove',
      routes: [
        {
          path: '/CRSMTrove',
          redirect: '/CRSMTrove/CRSMList',
        },
        {
          path: '/CRSMTrove/CRSMList',
          name: 'CRSM仓位列表',
          component: './CRSMTrove/CRSMList',
        },
        {
          path: '/CRSMTrove/positionList',
          name: '账户仓位列表',
          component: './CRSMTrove/positionList',
        }
      ],
    },
    {
      path: '/permissions',
      name: '权限管理',
      component: './permissions',
      routes: [
        {
          path: '/permissions',
          redirect: '/permissions/administrator',
        },
        {
          path: '/permissions/administrator',
          name: '管理员',
          component: './permissions/administrator',
        },
        {
          path: '/permissions/role',
          name: '角色管理',
          component: './permissions/role',
        },
        {
          path: '/permissions/permission',
          name: '权限设置',
          component: './permissions/permission',
        }
      ],
    },
    {
      path: '/selfCustody',
      name: '自托管',
      component: './selfCustody',
      routes: [
        {
          path: '/selfCustody',
          redirect: '/selfCustody/dataPanel',
        },
        {
          path: '/selfCustody/dataPanel',
          name: '数据展示',
          component: './selfCustody/dataPanel',
        },
        {
          path: '/selfCustody/deposit',
          name: '自托管存入',
          component: './selfCustody/deposit',
        },
        {
          path: '/selfCustody/withdraw',
          name: '自托管取出',
          component: './selfCustody/withdraw',
        }
      ],
    },
    { path: '/overview', name: '数据总览' ,component: './overview'},
    {
      path: '/statistics',
      name: '数据统计',
      component: './statistics',
      routes: [
        {
          path: '/statistics',
          redirect: '/statistics/dataView',
        },
        {
          path: '/statistics/dataView',
          name: '页面统计',
          component: './statistics/dataView',
        },
        {
          path: '/statistics/dataVault',
          name: '仓位统计',
          component: './statistics/dataVault',
        },
        {
          path: '/statistics/dataWallet',
          name: '钱包连接统计',
          component: './statistics/dataWallet',
        },
        {
          path: '/statistics/dataCdp',
          name: '仓位列表',
          component: './statistics/dataCdp',
        },
        {
          path: '/statistics/datacaptain',
          name: '团队列表',
          component: './statistics/datacaptain',
        },
        {
          path: '/statistics/data0penBox',
          name: '抽奖统计',
          component: './statistics/data0penBox',
        },
      ],
    },
    { path: '/news', name: '新闻管理' ,component: './news'},
    { path: '/feedback', name: '反馈管理', component: './feedback'},
    { path: '/notices', name: '公告管理', component: './notices'},
    { path: '/points', name: '积分管理', component: './points'},
    { path: '/NFTAirdrop', name: 'NFT空投管理', component: './NFTAirdrop'},
    { path: "/404", component: "./error/404", layout: false },
  ],
  npmClient: 'yarn',
  extraBabelPlugins: [
    !isDev ? 'transform-remove-console' : ''
  ],
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
    baseSeparator: '-',
  },
  hash: true,
  // exportStatic: {},
  esbuildMinifyIIFE: true,
  fastRefresh: true,
  jsMinifier: 'terser',
  codeSplitting:{
    jsStrategy: 'granularChunks'
  },
  // history: { type: 'hash' },
  links: [
    { href: 'https://yala.org', rel: 'canonical' }
  ],
  favicons: ["/assets/favicon.ico"],
});
