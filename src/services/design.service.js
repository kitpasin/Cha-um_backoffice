import axios from "axios";

export const getDesigns = (language) => {
    return axios.get(`design/data?language=${language}`).then( 
      (res) => { return { status: true, data: res.data.data }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const getMenuList =  (language) => {
    return  axios.get(`subcategory/menu?language=${language}`).then( 
      (res) => { return { status: true, menu: res.data.menu, submenu: res.data.submenu, category: res.data.category, subcategory: res.data.subcategory, designs: res.data.designs }} , 
      (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
    )
}

export const svCreateDesign = (formData) => {
  return axios.post(`design/create`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svUpdateDesign = (id, formData) => {
  return axios.post(`design/update/${id}`, formData).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

export const svDeleteDesignByToken = (token,language) => {
  return axios.delete(`design/${language}/${token}`).then( 
    (res) =>  { return { status: true, description: res.data.description }},
    (error) => { return { status: false, description: (!error.response.data)?"Something went wrong.": error.response.data.description } }
  )
}

 
