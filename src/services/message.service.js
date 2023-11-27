import axios from "axios";

export const svGetMessages = (language) => {
    return axios.get(`message/data?language=${language}`).then( 
      (res) => { return { status: true, data: res.data.data }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const getMenuList =  (language) => {
    return  axios.get(`category/menu?language=${language}`).then( 
      (res) => { return { status: true, menu: res.data.menu, submenu: res.data.submenu, category: res.data.category, subcategory: res.data.subcategory }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const svCreateMessage = (formData) => {
  return axios.post(`message/create`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svUpdateMessage = (id, formData) => {
  return axios.post(`message/update/${id}`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svDeleteMessageByToken = (id) => {
  return axios.delete(`message/delete/${id}`).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

 
