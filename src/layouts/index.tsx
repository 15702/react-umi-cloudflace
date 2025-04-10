import React, { useEffect, useLayoutEffect, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, CopyOutlined, SnippetsOutlined, DownOutlined, BarChartOutlined, KeyOutlined,
  PoweroffOutlined, ExclamationCircleFilled, ToolOutlined,  AppstoreAddOutlined, ContainerOutlined, RadarChartOutlined, UnorderedListOutlined,
  ClusterOutlined, AuditOutlined
} from '@ant-design/icons';
import { Space, Layout, Menu, Divider, ConfigProvider, Dropdown, Modal, Form, Input } from 'antd';
import styles from './index.less';
import icon_log from "@/assets/img/icon_logo.png";
import { Link, Outlet, setLocale , getLocale, useLocation, useModel, history } from 'umi';
import { intl } from "@/utils";
import { apiPermissionsMenu, apiPermissionsApiOrButton } from '@/api/permission';

const { Header, Sider, Content } = Layout;

const App = () => {
  const { loginEmail, setLoginEmail, setApiOrButtonPermissions } = useModel('global');
  const [collapsed, setCollapsed] = useState(false);
  const [ openChange, setOpenChange ] = useState<boolean>(false);
  const [ changeLoading, setChangeLoading ] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [ routesList ] = useState({
    path: '/',
    component: '../layouts/index',
    routes: [
      { path: '/', name : intl('menu_1'), code: '/index', icon: <HomeOutlined /> , component: './index/index' },
      {
        path: '/permissions',
        name: intl('menu_9'),
        code: '/permissions',
        icon: <ClusterOutlined /> ,
        component: './permissions',
        routes: [
          {
            path: '/permissions/administrator',
            name: intl('permissions_1'),
            code: '/permissions/administrator',
            component: './permissions/administrator',
          },
          {
            path: '/permissions/role',
            name: intl('permissions_2'),
            code: '/permissions/role',
            component: './permissions/role',
          },
          {
            path: '/permissions/permission',
            name: intl('permissions_3'),
            code: '/permissions/permission',
            component: './permissions/permission',
          }
        ],
      },
      {
        path: '/CRSMTrove',
        name: intl('menu_11'),
        code: '/CRSMTrove',
        icon: <UnorderedListOutlined />,
        component: './CRSMTrove',
        routes: [
          {
            path: '/CRSMTrove/CRSMList',
            name: intl('CRSM_1'),
            code: '/CRSMTrove/CRSMList',
            component: './CRSMTrove/CRSMList',
          },
          {
            path: '/CRSMTrove/positionList',
            name: intl('CRSM_2'),
            code: '/CRSMTrove/positionList',
            component: './CRSMTrove/positionList',
          }
        ],
      },
      {
        path: '/selfCustody',
        name: intl('menu_10'),
        code: '/selfCustody',
        icon: <AuditOutlined /> ,
        component: './selfCustody',
        routes: [
          {
            path: '/selfCustody/dataPanel',
            name: intl('selfCustody_1'),
            code: '/selfCustody/dataPanel',
            component: './selfCustody/dataPanel',
          },
          {
            path: '/selfCustody/deposit',
            name: intl('selfCustody_2'),
            code: '/selfCustody/deposit',
            component: './selfCustody/deposit',
          },
          {
            path: '/selfCustody/withdraw',
            name: intl('selfCustody_3'),
            code: '/selfCustody/withdraw',
            component: './selfCustody/withdraw',
          }
        ],
      },
      { path: '/overview', name: intl('menu_8'), code: '/overview', icon: <RadarChartOutlined /> ,component: './overview/index' },
      {
        path: '/statistics',
        name: intl('menu_4'),
        code: '/statistics',
        icon: <BarChartOutlined />,
        component: './statistics',
        routes: [
          {
            path: '/statistics/dataView',
            name: intl('statistics_5'),
            code: '/statistics/dataView',
            component: './statistics/dataView',
          },
          {
            path: '/statistics/dataVault',
            name: intl('statistics_6'),
            code: '/statistics/dataVault',
            component: './statistics/dataVault',
          },
          {
            path: '/statistics/dataWallet',
            name: intl('statistics_7'),
            code: '/statistics/dataWallet',
            component: './statistics/dataWallet',
          },
          {
            path: '/statistics/dataCdp',
            name: intl('statistics_8'),
            code: '/statistics/dataCdp',
            component: './statistics/dataCdp',
          },
          {
            path: '/statistics/datacaptain',
            name: intl('team_1'),
            code: '/statistics/datacaptain',
            component: './statistics/datacaptain',
          },
          {
            path: '/statistics/data0penBox',
            name: intl('draw_1'),
            code: '/statistics/data0penBox',
            component: './statistics/data0penBox',
          },
        ],
      },
      { path: '/news', name: intl('menu_2'), code: '/news', icon: <CopyOutlined />,component: './news' },
      { path: '/feedback', name: intl('menu_3'), code: '/feedback', icon: <SnippetsOutlined />, component: './feedback' },
      { path: '/notices', name: intl('menu_5'), code: '/notices', icon: <ToolOutlined />, component: './notices' },
      { path: '/points', name: intl('menu_6'), code: '/points', icon: <AppstoreAddOutlined />, component: './points' },
      { path: '/NFTAirdrop', name: intl('menu_7'), code: '/NFTAirdrop', icon: <ContainerOutlined />, component: './NFTAirdrop' },
    ]
  })
  const [ newRoutesList, setNewRoutesList ] = useState({
    path: '',
    component: '',
    routes: []
  })
  const location = useLocation()
  const [ modal, contextHolder] = Modal.useModal();
  const [ form ] = Form.useForm();

  useEffect(()=>{
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize);
  },[window.outerWidth])

  useLayoutEffect(()=>{
    getPermissions()
    getPermissionsApiOrButton()
    const email = localStorage.getItem('loginEmail')
    if(email){
      setLoginEmail(email)
    }
  },[])

  useEffect(() => {
    console.log(location.pathname)
    if(newRoutesList?.path){
      const path = location.pathname;
      setSelectedKeys([path]);

      const parentKey = setMenu(newRoutesList).find((item: any) =>
        item.children?.some((child: any) => child.key === path)
      )?.key
      console.log(parentKey)
      setOpenKeys(parentKey ? [parentKey] : []);
    }
  }, [location.pathname, newRoutesList]);

  const getPermissionsApiOrButton = async () =>{
    const apiPermissionApiOrButtonRes: any = await apiPermissionsApiOrButton()
    console.log(apiPermissionApiOrButtonRes)
    if(apiPermissionApiOrButtonRes?.code === 0){
      setApiOrButtonPermissions(apiPermissionApiOrButtonRes.data)
    }
  }

  const getPermissions = async () =>{
    const apiPermissionPageRes: any = await apiPermissionsMenu()
    console.log(apiPermissionPageRes)
    if(apiPermissionPageRes?.code === 0){
      const routesListCopy = routesList.routes.slice()
      const filteredRoutesList = filterRoutes(routesListCopy, apiPermissionPageRes.data)
      console.log(filteredRoutesList)
      const newRoutesList = {
        path: routesList.path,
        component: routesList.component,
        routes: filteredRoutesList
      }
      const cleanRoutes = newRoutesList.routes.map((route:any) => {
        const { icon, ...rest } = route;
        return rest;
      });
      localStorage.setItem('yalalist', JSON.stringify(cleanRoutes))
      setNewRoutesList(newRoutesList)
    }
  }

  const filterRoutes = (routes: any, menuData: any) => {
    return routes .map((route: any) => {
        if (route.path === '/') {
          return { ...route };
        }
        const matchedMenu = menuData.find((menu: any) => menu.code === route.code);
        if (!matchedMenu) return null;
        let newRoute = { ...route };
        if (route.routes && matchedMenu.children) {
          newRoute.routes = filterRoutes(route.routes, matchedMenu.children);
        }
        return newRoute;
      }).filter(Boolean); 
  };
  
  const handleResize = () =>{
    if(window.outerWidth <= 576){
      setCollapsed(true)
    }else{
      setCollapsed(false)
    }
  }

  const setMenu = (item: any) => {
    const result = item.routes && item.routes.map((element: any) => {
        return {
            label: element.path ? <Link to={element.path} >{element.name}</Link> : element.name,
            key: element.path,
            icon: element.icon,
            children: (element.routes && element.routes.length !== 0) 
                    ? (element.routes,
                    setMenu(element))
                    : undefined
        }
    })
    return result
  }
  
  const switchLocale = () => {
    const locale = getLocale()
    if(locale == 'en-US'){
      setLocale('zh-CN')
    }
    if(locale == 'zh-CN'){
      setLocale('en-US')
    }
  }

  const clickChange = () =>{
    setOpenChange(true)
  }

  const confirmChange = () =>{
    form.submit()
  }

  const onFinish = (values: any) => {
    console.log(values)
    setChangeLoading(true)
    // apiChangePassword(values.oldPassword, values.newPassword).then(res=>{
    //   console.log(res)
    //   setChangeLoading(false)
    //   if(res?.code == 0){
    //     message.success(intl('public_13'))
    //   }
    // })
  }

  const signOut = () =>{
    modal.confirm({
      title: intl('public_4'),
      icon: <ExclamationCircleFilled />,
      content: `${intl('header_5')} ?`,
      onOk() {
        localStorage.removeItem('Authorization');
        localStorage.removeItem('loginEmail');
        setLoginEmail('')
        history.replace('/login')
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const items = [
    // {
    //   key: '1',
    //   label: ( <div onClick={clickChange}>{intl('header_2')}</div>),
    //   icon: <KeyOutlined />,
    // },
    // {
    //   type: 'divider',
    // },
    {
      key: '2',
      label: ( <div onClick={signOut}>{intl('header_3')}</div>),
      icon: <PoweroffOutlined />,
    },
  ]

  return (
    <ConfigProvider theme={{token: {colorPrimary: '#21c789'}}} >
      {contextHolder}
      <Layout style={{height: '100%'}}>
        <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={window.outerWidth <= 576 ? 0 : 80} >
          <div className={styles.titLog}>
            <img src={icon_log} /> 
            <div hidden={collapsed}>Yala {intl('header_4')}</div>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            items={setMenu(newRoutesList)}
            openKeys={openKeys}
            selectedKeys={selectedKeys}
            onOpenChange={(keys) => {
              setOpenKeys(keys.length ? [keys[keys.length - 1]] : []);
            }}
          />
        </Sider>
        <Layout>
          <Header className={styles.header}>
              <div className={styles.headerLeft} onClick={()=>setCollapsed(!collapsed)}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </div>
              <div className={styles.headerRight}>
                <div onClick={()=>switchLocale()}>{intl('header_1')}</div>
                <Divider type="vertical" />
                <Dropdown 
                  menu={{
                    // @ts-ignore
                    items,
                  }}
                  placement="bottomRight"
                  arrow={{
                    pointAtCenter: true,
                  }}
                >
                  <div>
                    <Space><div>{loginEmail}</div> <DownOutlined /></Space>
                  </div>
                </Dropdown>
              </div>
              {/* <Modal
                title={intl('header_2')}
                width= '500px'
                open={openChange}
                confirmLoading={changeLoading}
                onOk={confirmChange}
                onCancel={()=>setOpenChange(false)}
              >
                <Form
                  className={styles.form}
                  form={form}
                  name="obtain"
                  onFinish={onFinish}
                  autoComplete="off"
                >
                <Form.Item
                    label={intl('login_3')}
                    name="newsLink"
                    rules={[{required: true,message: intl('login_5'),}]}
                    >
                      <Input placeholder={intl('login_3')}/>
                  </Form.Item>
                </Form>
              </Modal> */}
          </Header>
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default App;
