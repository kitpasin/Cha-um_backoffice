const appConfigDEV = {
    isDevMode: true,
    language: "th",
    timeZone: "Asia/Bangkok",
    languageAvailable: ["th"],  
    apiPath:"http://localhost:8000/api/backoffice/v1/",
    uploadPath:"http://localhost:8000/",
    webPath:"http://localhost:8000/",
    pages: {
        categories: true,
        subcategories: true,
        products: true,
        services: true,
        portfolios: true,
        designs: true,
        posts: true,
        messages: true,
        webinfo: true,
        languages: false,
        admins: true,
        configs: true,
        groups: {
            category: true,
            product: true,
            article: true,
            system: true,
        }
    },
    features: {
        multilingual: true,
        flexibleCategory: true,
        multipleImage: true,
        seo: true,
        price: false,
        tag: true,
        iframe: true,
        redirect: true,
        social: false,
        notify: false,
    }
}
const appConfigPROD = {
    isDevMode: false,
    language: "fr",
    timeZone: "Europe/Paris",
    languageAvailable: ["fr","en"],  
    apiPath:"https://capbreton.tamarind.fr/api/backoffice/v1/",
    uploadPath:"https://capbreton.tamarind.fr/",
    webPath:"https://capbreton.tamarind.fr/",
    // apiPath:"https://paris.tamarind.fr/api/backoffice/v1/",
    // uploadPath:"https://paris.tamarind.fr/",
    // webPath:"https://paris.tamarind.fr/",
    pages: {
        dashboard: true,
        messages: false,
        inbox: false,
        subscribe: false,
        productcate: false,
        products: false,
        members: false,
        slides: true,
        menu: false,
        category: true,
        posts: true,
        reports: false,
        webinfo: true,
        languages: true,
        admins: true,
        configs: true,
        profile: true,
        groups: {
            notify: true,
            article: true,
            product: false,
            report: false,
            system: true,
        }
    },
    features: {
        multilingual: true,
        flexibleCategory: true,
        multipleImage: true,
        seo: true,
        price: false,
        tag: true,
        iframe: true,
        redirect: true,
        social: false,
        notify: false,
    }
}

export default appConfigDEV;
// export default appConfigPROD;



