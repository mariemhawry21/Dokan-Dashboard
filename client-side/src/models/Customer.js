const customer = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address: [],  
    joinDate: new Date(), 
    birthDate: null,  
    avatar: "",
    ordersCount: 0,
    lastOrderDate: null, 
    tags: [],  
    isBlocked: false,
    isHotCustomer: false,
    deletedAt: null  
  };
  
  const address = {
    id: "",
    province: {
      id: "",
      name: ""
    },
    city: {
      id: "",
      provinceId: "",
      name: ""
    },
    text: ""
  };
  
  const city = {
    id: "",
    provinceId: "",
    name: ""
  };
  
  const province = {
    id: "",
    name: ""
  };
  
  const customerUpdateModel = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    birthDate: null,  
    avatar: "",
    address: [],
    tags: [],
    isBlocked: false
  };
  
  const customerTagUpdate = {
    tags: []
  };
  
  const blockCustomerDto = {
    isBlocked: false
  };
  
  const customerMonthlyOrdersStats = {
    month: "",
    orderCount: 0
  };
  