import { history } from 'umi';
import './global.less';

export function onRouteChange({ location, routes, action } :any) {
  console.log('route changed', location, routes, action);
  if(!localStorage.getItem("Authorization") && location.pathname != '/login'){
    history.replace('/login')
  }else if(localStorage.getItem('yalalist') && localStorage.getItem("Authorization")){
    const yalalist = JSON.parse(localStorage.getItem('yalalist') as any)
    console.log(yalalist)
    const isAllowed = extractPaths(yalalist).includes(location.pathname)
    if(!isAllowed){
      history.replace('/404')
    }
  }
}

const extractPaths = (routes: any) => {
  let paths: any = [];
  routes.forEach((route: any) => {
    paths.push(route.path);
    if (route.routes) {
      paths = paths.concat(extractPaths(route.routes));
    }
  });
  return paths;
};