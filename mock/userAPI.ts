const users = [
  { id: 0, name: 'Umi', nickName: 'U', gender: 'MALE' },
  { id: 1, name: 'Fish', nickName: 'B', gender: 'FEMALE' },
];


export default {
  'post /api/v1/userLogin': (req: any, res: any) => {
    res.json({
      success: true,
      data: { 
        name: 'name',
        id: 1,
        token: 'sjdfhjsfjsdgfhdjsgfdhhf',
       },
      errorCode: 0,
    });
  },
  'GET /api/v1/queryUserList': (req: any, res: any) => {
    res.json({
      success: true,
      data: { list: users },
      errorCode: 0,
    });
  },
  'PUT /api/v1/user/': (req: any, res: any) => {
    res.json({
      success: true,
      errorCode: 0,
    });
  },
};
