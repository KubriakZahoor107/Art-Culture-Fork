export default {
    route: '/home',
    meta: {
        title: {
            default: 'Головна',
            env: 'server-only'
        },
        description: {
            default: 'Це стартова сторінка сайту Art & Culture з Vike SSR.',
            env: 'server-only'
        }
    }
}
