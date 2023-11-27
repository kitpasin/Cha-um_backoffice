import axios from "axios";

export const getPortfolios = (language) => {
    return axios.get(`portfolio/data?language=${language}`).then( 
      (res) => { return { status: true, data: res.data.data }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const getMenuList =  (language) => {
    return  axios.get(`subcategory/menu?language=${language}`).then( 
      (res) => { return { status: true, menu: res.data.menu, submenu: res.data.submenu, category: res.data.category, subcategory: res.data.subcategory, portfolios: res.data.portfolios }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const svCreatePortfolio = (formData) => {
  return axios.post(`portfolio/create`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svUpdatePortfolio = (id, formData) => {
  return axios.post(`portfolio/update/${id}`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svDeletePortfolioByToken = (token,language) => {
  return axios.delete(`portfolio/${language}/${token}`).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

 
