"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
const restaurant_1 = __importDefault(require("../models/restaurant"));
const reservations_1 = __importDefault(require("../models/reservations"));
const order_1 = __importDefault(require("../models/order"));
const crypto_1 = require("crypto");
class UserController {
    constructor() {
        this.login = (req, res) => {
            let usernameP = req.body.username;
            let passwordP = req.body.password;
            user_1.default.findOne({ username: usernameP, status: "active" })
                .then((user) => {
                if (!user) {
                    res.json(null);
                    return;
                }
                const [salt, storedHash] = user.password.split(':');
                const hash = (0, crypto_1.scryptSync)(passwordP, salt, 64).toString('hex');
                if (hash !== storedHash) {
                    res.json(null);
                    return;
                }
                res.json(user);
            })
                .catch((error) => {
                console.error("Error finding user:", error);
                res.status(500).json({ message: "Error finding user." });
            });
        };
        this.loginAdmin = (req, res) => {
            let usernameP = req.body.username;
            let passwordP = req.body.password;
            user_1.default.findOne({ username: usernameP, type: "admin" })
                .then((user) => {
                if (!user) {
                    res.json(null);
                    return;
                }
                const [salt, storedHash] = user.password.split(':');
                const hash = (0, crypto_1.scryptSync)(passwordP, salt, 64).toString('hex');
                if (hash !== storedHash) {
                    res.json(null);
                    return;
                }
                res.json(user);
            })
                .catch((error) => {
                console.error("Error finding user:", error);
                res.status(500).json({ message: "Error finding user." });
            });
        };
        this.getAdminMail = (req, res) => {
            let mail = req.body.mail;
            user_1.default.findOne({ email: mail,
                type: "admin" }).then((user) => {
                res.json(user);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.getMail = (req, res) => {
            let mail = req.body.mail;
            user_1.default.findOne({ email: mail,
                type: { $ne: "admin" }, status: "active" }).then((user) => {
                res.json(user);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.changePassword = (req, res) => {
            let mail = req.body.mail;
            let newPassword = req.body.password;
            const salt = (0, crypto_1.randomBytes)(16).toString('hex');
            const hash = (0, crypto_1.scryptSync)(newPassword, salt, 64).toString('hex');
            newPassword = `${salt}:${hash}`;
            user_1.default.updateOne({ email: mail }, { $set: { "password": newPassword } }).then(ok => res.json(1)).catch(err => console.log(err));
        };
        this.register = (req, res) => {
            const user = req.body;
            const salt = (0, crypto_1.randomBytes)(16).toString('hex');
            const hash = (0, crypto_1.scryptSync)(user.password, salt, 64).toString('hex');
            user.password = `${salt}:${hash}`;
            user_1.default.findOne({ username: user.username })
                .then((existingUserByUsername) => {
                if (existingUserByUsername) {
                    res.json({ message: "Username already in use" });
                    return;
                }
                user_1.default.findOne({ email: user.email })
                    .then((existingUserByEmail) => {
                    if (existingUserByEmail) {
                        res.json({ message: "Email already in use" });
                        return;
                    }
                    const newUser = new user_1.default(user);
                    newUser.save().then((savedUser) => {
                        res.json({ message: "Registration successful" });
                    }).catch((error) => {
                        console.error("Error saving user:", error);
                        res.status(500).json({ message: "Error saving user." });
                    });
                })
                    .catch((error) => {
                    console.error("Error checking email:", error);
                    res.status(500).json({ message: "Error checking email." });
                });
            })
                .catch((error) => {
                console.error("Error checking username:", error);
                res.status(500).json({ message: "Error checking username." });
            });
        };
        this.changeProfile = (req, res) => {
            let userP = req.body;
            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,10}$/;
            if (passwordRegex.test(userP.password)) {
                const salt = (0, crypto_1.randomBytes)(16).toString('hex');
                const hash = (0, crypto_1.scryptSync)(userP.password, salt, 64).toString('hex');
                userP.password = `${salt}:${hash}`;
            }
            user_1.default.findOne({ email: userP.email }).then((user) => {
                user.password = userP.password;
                user.securityQuestion = userP.securityQuestion;
                user.securityAnswer = userP.securityAnswer;
                user.address = userP.address;
                user.phone = userP.phone;
                user.creditCardNumber = userP.creditCardNumber;
                user.profilePicture = userP.profilePicture;
                user.save().then((savedUser) => {
                    res.json({ message: "Successful change!" });
                }).catch((error) => {
                    console.error("Error saving user:", error);
                    res.status(500).json({ message: "Error saving user." });
                });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.getUsers = (req, res) => {
            let typeP = req.body.type;
            user_1.default.find({ type: typeP, status: { $ne: "pending" } }).then((users) => {
                res.json(users);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.getRegistrationRequests = (req, res) => {
            user_1.default.find({ type: { $ne: "admin" }, status: "pending" }).then((users) => {
                res.json(users);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.setUserStatus = (req, res) => {
            let userP = req.body.user;
            let statusP = req.body.status;
            user_1.default.updateOne({ email: userP.email }, { $set: { status: statusP } }).then((data) => {
                res.json({ message: "Ok" });
            }).catch((err) => {
                console.log(err);
            });
        };
        this.createRestaurant = (req, res) => {
            let restaurantP = req.body;
            const newRestaurant = new restaurant_1.default(restaurantP);
            newRestaurant.save().then((savedRestaurant) => {
                res.json({ message: "Restaurant created successfully" });
            }).catch((error) => {
                console.error("Error creating restaurant:", error);
                res.status(500).json({ message: "Error creating restaurant." });
            });
        };
        this.createReservation = (req, res) => {
            let reservationP = req.body;
            const newReservation = new reservations_1.default(reservationP);
            newReservation.save().then((savedReservation) => {
                res.json({ message: "Reservation created successfully" });
            }).catch((error) => {
                console.error("Error creating restaurant:", error);
                res.status(500).json({ message: "Error creating restaurant." });
            });
        };
        this.createOrder = (req, res) => {
            let orderP = req.body;
            const newOrder = new order_1.default(orderP);
            newOrder.save().then((savedOrder) => {
                res.json({ message: "Order created successfully" });
            }).catch((error) => {
                console.error("Error creating restaurant:", error);
                res.status(500).json({ message: "Error creating restaurant." });
            });
        };
        this.getAllRestaurantsNames = (req, res) => {
            restaurant_1.default.find({}, 'name').then(restaurants => {
                const restaurantNames = restaurants.map(restaurant => restaurant.name);
                res.json(restaurantNames);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.createWaiter = (req, res) => {
            let user = req.body.user;
            const salt = (0, crypto_1.randomBytes)(16).toString('hex');
            const hash = (0, crypto_1.scryptSync)(user.password, salt, 64).toString('hex');
            user.password = `${salt}:${hash}`;
            user_1.default.findOne({ username: user.username })
                .then((existingUserByUsername) => {
                if (existingUserByUsername) {
                    return res.json({ message: "Username already in use" });
                }
                user_1.default.findOne({ email: user.email })
                    .then((existingUserByEmail) => {
                    if (existingUserByEmail) {
                        return res.json({ message: "Email already in use" });
                    }
                    const newUser = new user_1.default(user);
                    newUser.save()
                        .then((savedUser) => {
                        res.json({ message: "Registration successful" });
                        restaurant_1.default.updateOne({ name: user.restaurant }, { $push: { waiters: user.username } })
                            .then(result => {
                            if (result) {
                            }
                            else {
                                console.error('No restaurant found with the given name');
                            }
                        })
                            .catch(err => {
                            console.error('An error occurred while updating the restaurant', err);
                        });
                    })
                        .catch((error) => {
                        console.error("Error saving user:", error);
                        res.status(500).json({ message: "Error saving user." });
                    });
                })
                    .catch((error) => {
                    console.error("Error checking email:", error);
                    res.status(500).json({ message: "Error checking email." });
                });
            })
                .catch((error) => {
                console.error("Error checking username:", error);
                res.status(500).json({ message: "Error checking username." });
            });
        };
        this.getWaiterRestaurant = (req, res) => {
            let usernameP = req.body.username;
            restaurant_1.default.findOne({ waiters: usernameP }, 'name')
                .then(restaurant => {
                if (restaurant) {
                    res.json({ restaurantName: restaurant.name });
                }
                else {
                    res.status(404).json({ message: 'No restaurant found for the given waiter username' });
                }
            })
                .catch(err => {
                console.error('Error finding restaurant:', err);
                res.status(500).json({ message: 'An error occurred while fetching the restaurant' });
            });
        };
        this.getRestaurants = (req, res) => {
            restaurant_1.default.find({}).then(restaurants => {
                res.json(restaurants);
            }).catch((err) => {
                console.log(err);
            });
        };
        this.getWaitersNames = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let waitersUsernames = req.body.waiters;
                let waitersDetailsPromises = waitersUsernames.map((username) => {
                    return user_1.default.findOne({ username: username }, 'firstname lastname').exec();
                });
                let waitersDetails = yield Promise.all(waitersDetailsPromises);
                waitersDetails = waitersDetails.filter(waiter => waiter !== null);
                res.json(waitersDetails);
            }
            catch (error) {
                console.error("Error fetching waiters names:", error);
                res.status(500).json({ message: "An error occurred while fetching waiters names." });
            }
        });
        this.saveRestaurant = (req, res) => {
            let restaurantNameP = req.body.restaurantName;
            let fieldP = req.body.field;
            let arrayP = req.body.array;
            let updateData = {};
            updateData[fieldP] = arrayP;
            restaurant_1.default.findOneAndUpdate({ name: restaurantNameP }, { $set: updateData })
                .then(updatedRestaurant => {
                if (updatedRestaurant) {
                    res.json({
                        message: 'Restaurant updated successfully'
                    });
                }
                else {
                    res.status(404).json({ message: 'Restaurant not found' });
                }
            })
                .catch(error => {
                console.error("Error updating restaurant:", error);
                res.status(500).json({ message: 'An error occurred while updating the restaurant' });
            });
        };
        this.getReservationsDates = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dates = yield reservations_1.default.find({ status: "confirmed" }, 'date').exec();
                return res.json(dates);
            }
            catch (err) {
                return res.status(500).json({ error: 'An error occurred while fetching reservation dates.' });
            }
        });
        this.getReservationsDatesForRestaurant = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let restaurantNameP = req.body.restaurantName;
            try {
                const reservations = yield reservations_1.default.find({ status: "confirmed" }, 'date table').exec();
                const result = reservations.map(reservation => {
                    return {
                        date: reservation.date,
                        table: reservation.table
                    };
                });
                return res.json(result);
            }
            catch (err) {
                return res.status(500).json({ error: 'An error occurred while fetching reservation dates.' });
            }
        });
        this.getNumberOfUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield user_1.default.countDocuments({ type: "gost" }).exec();
                return res.json({ numberOfUsers: count });
            }
            catch (err) {
                return res.status(500).json({ error: 'An error occurred while counting users.' });
            }
        });
        this.getOrdersForWaiterRestaurant = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let usernameP = req.body.username;
            try {
                const restaurant = yield restaurant_1.default.findOne({ waiters: usernameP }).exec();
                if (!restaurant) {
                    return res.status(404).json({ error: 'Restaurant not found for the given waiter username.' });
                }
                const orders = yield order_1.default.find({ restaurant: restaurant.name, status: "pending" }).exec();
                return res.json(orders);
            }
            catch (err) {
                return res.status(500).json({ error: 'An error occurred while fetching orders for the waiter.' });
            }
        });
        this.changeOrder = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let orderP = req.body;
            try {
                const updatedOrder = yield order_1.default.findByIdAndUpdate(orderP._id, orderP, { new: true }).exec();
                if (!updatedOrder) {
                    return res.status(404).json({ message: "Order not found." });
                }
                return res.json({ message: "Order updated successfully", order: updatedOrder });
            }
            catch (err) {
                console.error("Error updating order:", err);
                return res.status(500).json({ message: "Error updating order." });
            }
        });
        this.changeReservation = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let reservationP = req.body;
            try {
                const updatedReservation = yield reservations_1.default.findByIdAndUpdate(reservationP._id, reservationP, { new: true }).exec();
                if (!updatedReservation) {
                    return res.status(404).json({ message: "Order not found." });
                }
                return res.json({ message: "Order updated successfully", order: updatedReservation });
            }
            catch (err) {
                console.error("Error updating order:", err);
                return res.status(500).json({ message: "Error updating order." });
            }
        });
        this.getUserOrders = (req, res) => {
            let usernameP = req.body.username;
            order_1.default.find({ username: usernameP }).then(orders => {
                res.json(orders);
            }).catch(err => {
                console.error(err);
                res.status(500).send('Error fetching orders');
            });
        };
        this.getUserReservations = (req, res) => {
            let usernameP = req.body.username;
            reservations_1.default.find({ username: usernameP }).then(reservations => {
                res.json(reservations);
            }).catch(err => {
                console.error(err);
                res.status(500).send('Error fetching orders');
            });
        };
        this.getWaiterReservations = (req, res) => {
            let usernameP = req.body.username;
            reservations_1.default.find({ waiter: usernameP }).then(reservations => {
                res.json(reservations);
            }).catch(err => {
                console.error(err);
                res.status(500).send('Error fetching orders');
            });
        };
        this.getRestaurantReservations = (req, res) => {
            let nameP = req.body.name;
            reservations_1.default.find({ restaurant: nameP }).then(reservations => {
                res.json(reservations);
            }).catch(err => {
                console.error(err);
                res.status(500).send('Error fetching orders');
            });
        };
        this.getLayout = (req, res) => {
            let nameP = req.body.name;
            restaurant_1.default.findOne({ name: nameP }, 'layout').then(layout => {
                res.json(layout);
            }).catch(err => {
                console.error(err);
                res.status(500).send('Error fetching orders');
            });
        };
        this.dropReservation = (req, res) => {
            let idP = req.body.id;
            reservations_1.default.deleteOne({ _id: idP }).then(reservation => {
                res.json({ message: "Reservation deleted" });
            }).catch((err) => {
                console.log(err);
                res.json({ message: "Fail" });
            });
        };
        this.notArrived = (req, res) => {
            let usernameP = req.body.username;
            user_1.default.findOne({ username: usernameP }).then(user => {
                if (!user) {
                    return res.status(404).send('User not found');
                }
                if (user.numberOfNotComing != null) {
                    user.numberOfNotComing += 1;
                    if (user.numberOfNotComing >= 3) {
                        user.status = 'deactive';
                    }
                }
                user.save().then(() => {
                    res.status(200).send('User updated successfully');
                }).catch(err => {
                    console.error(err);
                    res.status(500).send('Error updating user');
                });
            }).catch(err => {
                console.error(err);
                res.status(500).send('Error fetching user');
            });
        };
    }
}
exports.UserController = UserController;
