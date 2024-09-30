import express from 'express'
import { UserController } from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.route("/login").post(
    (req,res)=>new UserController().login(req,res)
)

userRouter.route("/loginAdmin").post(
    (req,res)=>new UserController().loginAdmin(req,res)
)

userRouter.route("/getAdminMail").post(
    (req,res)=>new UserController().getAdminMail(req,res)
)

userRouter.route("/getMail").post(
    (req,res)=>new UserController().getMail(req,res)
)

userRouter.route("/changePassword").post(
    (req,res)=>new UserController().changePassword(req,res)
)

userRouter.route("/register").post(
    (req,res)=>new UserController().register(req,res)
)

userRouter.route("/changeProfile").post(
    (req,res)=>new UserController().changeProfile(req,res)
)

userRouter.route("/getUsers").post(
    (req,res)=>new UserController().getUsers(req,res)
)

userRouter.route("/getRegistrationRequests").get(
    (req,res)=>new UserController().getRegistrationRequests(req,res)
)

userRouter.route("/setUserStatus").post(
    (req,res)=>new UserController().setUserStatus(req,res)
)

userRouter.route("/createRestaurant").post(
    (req,res)=>new UserController().createRestaurant(req,res)
)

userRouter.route("/createReservation").post(
    (req,res)=>new UserController().createReservation(req,res)
)

userRouter.route("/createOrder").post(
    (req,res)=>new UserController().createOrder(req,res)
)

userRouter.route("/getAllRestaurantsNames").get(
    (req,res)=>new UserController().getAllRestaurantsNames(req,res)
)

userRouter.route("/createWaiter").post(
    (req,res)=>new UserController().createWaiter(req,res)
)

userRouter.route("/getWaiterRestaurant").post(
    (req,res)=>new UserController().getWaiterRestaurant(req,res)
)

userRouter.route("/getRestaurants").get(
    (req,res)=>new UserController().getRestaurants(req,res)
)

userRouter.route("/getWaitersNames").post(
    (req,res)=>new UserController().getWaitersNames(req,res)
)

userRouter.route("/saveRestaurant").post(
    (req,res)=>new UserController().saveRestaurant(req,res)
)

userRouter.route("/getReservationsDates").get(
    (req,res)=>new UserController().getReservationsDates(req,res)
)

userRouter.route("/getReservationsDatesForRestaurant").post(
    (req,res)=>new UserController().getReservationsDatesForRestaurant(req,res)
)

userRouter.route("/getNumberOfUsers").get(
    (req,res)=>new UserController().getNumberOfUsers(req,res)
)

userRouter.route("/getOrdersForWaiterRestaurant").post(
    (req,res)=>new UserController().getOrdersForWaiterRestaurant(req,res)
)

userRouter.route("/changeOrder").post(
    (req,res)=>new UserController().changeOrder(req,res)
)

userRouter.route("/changeReservation").post(
    (req,res)=>new UserController().changeReservation(req,res)
)

userRouter.route("/getUserOrders").post(
    (req,res)=>new UserController().getUserOrders(req,res)
)

userRouter.route("/getUserReservations").post(
    (req,res)=>new UserController().getUserReservations(req,res)
)

userRouter.route("/getWaiterReservations").post(
    (req,res)=>new UserController().getWaiterReservations(req,res)
)

userRouter.route("/getRestaurantReservations").post(
    (req,res)=>new UserController().getRestaurantReservations(req,res)
)

userRouter.route("/getLayout").post(
    (req,res)=>new UserController().getLayout(req,res)
)

userRouter.route("/dropReservation").post(
    (req,res)=>new UserController().dropReservation(req,res)
)

userRouter.route("/notArrived").post(
    (req,res)=>new UserController().notArrived(req,res)
)


export default userRouter;