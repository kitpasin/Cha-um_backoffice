import axios from "axios";

export const getProducts = (language) => {
    return axios.get(`product/data?language=${language}`).then( 
      (res) => { return { status: true, data: res.data.data }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const getMenuList =  (language) => {
    return  axios.get(`subcategory/menu?language=${language}`).then( 
      (res) => { return { status: true, menu: res.data.menu, submenu: res.data.submenu, category: res.data.category, subcategory: res.data.subcategory }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const svCreateProduct = (formData) => {
  return axios.post(`product/create`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svUpdateProduct = (id, formData) => {
  return axios.post(`product/update/${id}`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svDeleteProductByToken = (token,language) => {
  return axios.delete(`product/${language}/${token}`).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

 
