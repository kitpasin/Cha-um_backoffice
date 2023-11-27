import axios from "axios";

export const getCategory = (language) => {
    return axios.get(`category/data?language=${language}`).then( 
      (res) => { return { status: true, data: res.data.data, subdata: res.data.subdata, menu: res.data.menu, submenu: res.data.submenu }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const svCreateCategory = (formData) => {
  return axios.post(`category/create`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svCreateSubCategory = (formData) => {
  return axios.post(`subcategory/create`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svUpdateCategory = (id, formData) => {
  return axios.post(`category/update/${id}`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svUpdateSubCategory = (id, formData) => {
  return axios.post(`subcategory/update/${id}`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svDeleteCategoryByToken = (token,language) => {
  return axios.delete(`category/${language}/${token}`).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { 
      return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svDeleteSubCategoryByToken = (token,language) => {
  return axios.delete(`subcategory/${language}/${token}`).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { 
      return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

 
