import { createRouter, createWebHistory } from "vue-router";
// import About from "@/components/About.vue"
import Home from "@/routes/Home.vue"
import Login from "@/routes/Login/Login.vue"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: 'Home',
            path: '/',
            component: Home
        },
        {
            name: 'Login',
            path: '/Login',
            component: Login
        }
    ]
})

export default router