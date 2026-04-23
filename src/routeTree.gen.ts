import { Route as rootRoute } from './router/__root'
import { Route as IndexRoute } from './routes/index'

export const routeTree = rootRoute.addChildren([IndexRoute])
