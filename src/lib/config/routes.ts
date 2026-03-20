export const COMMON_ROUTES = {
    HOME: '/',
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
}

export const ACTIVITY_ROUTES = {
    LIST: '/activity',
    EDIT: '/edit',
    ADD: '/add',
    GET_BY_ID: (id:string) => `/activity/${id}`,
    DELETE: '/delete',
}