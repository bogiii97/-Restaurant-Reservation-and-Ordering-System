import express from 'express'
import UserModel from '../models/user'
import RestaurantModel from '../models/restaurant'
import ReservationModel from '../models/reservations'
import OrderModel from '../models/order'
import { randomBytes, scryptSync } from 'crypto';
import reservations from '../models/reservations'

export class UserController{
    login = (req: express.Request, res: express.Response)=>{
        let usernameP = req.body.username;
        let passwordP = req.body.password;
        
        UserModel.findOne({ username: usernameP, status:"active" })
            .then((user: any) => {
                if (!user) {
                    res.json(null);
                    return;
                }
                const [salt, storedHash] = user.password.split(':');
                const hash = scryptSync(passwordP, salt, 64).toString('hex');
    
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
    }

    loginAdmin = (req: express.Request, res: express.Response)=>{
        let usernameP = req.body.username;
        let passwordP = req.body.password;

        UserModel.findOne({ username: usernameP, type:"admin" })
            .then((user: any) => {
                if (!user) {
                    res.json(null);
                    return;
                }
                const [salt, storedHash] = user.password.split(':');
                const hash = scryptSync(passwordP, salt, 64).toString('hex');
    
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
    }

    getAdminMail = (req: express.Request, res: express.Response)=>{
        let mail = req.body.mail;
       
        UserModel.findOne({email: mail, 
        type: "admin"}).then((user)=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
        })
    }

    getMail = (req: express.Request, res: express.Response)=>{
        let mail = req.body.mail;
       
        UserModel.findOne({email: mail, 
        type: {$ne: "admin"}, status: "active"}).then((user)=>{
            res.json(user)
        }).catch((err)=>{
            console.log(err)
        })
    }

    changePassword = (req: express.Request, res: express.Response)=>{
        let mail = req.body.mail;
        let newPassword = req.body.password

        const salt = randomBytes(16).toString('hex');
        const hash = scryptSync(newPassword, salt, 64).toString('hex');
        newPassword = `${salt}:${hash}`;
       
        UserModel.updateOne({email: mail}, 
            {$set: {"password": newPassword}}).then(
                ok=>res.json(1)
        ).catch(err=>console.log(err))
    }

    register = (req: express.Request, res: express.Response)=>{
        const user: any = req.body;

        const salt = randomBytes(16).toString('hex');
        const hash = scryptSync(user.password, salt, 64).toString('hex');
        user.password = `${salt}:${hash}`;

        UserModel.findOne({username: user.username})
        .then((existingUserByUsername: any) => {
            if(existingUserByUsername){
                res.json({message: "Username already in use"})
                return;
            }
            UserModel.findOne({email:user.email})
            .then((existingUserByEmail: any) => {
                if(existingUserByEmail){
                    res.json({message: "Email already in use"})
                    return;
                }

                const newUser = new UserModel(user);
                newUser.save().then((savedUser: any) => {
                    res.json({message: "Registration successful"});
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
    }

    changeProfile = (req: express.Request, res: express.Response)=>{
        let userP: any = req.body;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,10}$/;
        if(passwordRegex.test(userP.password)){
            const salt = randomBytes(16).toString('hex');
            const hash = scryptSync(userP.password, salt, 64).toString('hex');
            userP.password = `${salt}:${hash}`;
        }
       
        UserModel.findOne({email: userP.email}).then((user: any)=>{
            user.password = userP.password;
            user.securityQuestion = userP.securityQuestion;
            user.securityAnswer = userP.securityAnswer;
            user.address = userP.address;
            user.phone = userP.phone;
            user.creditCardNumber = userP.creditCardNumber;
            user.profilePicture = userP.profilePicture;
            user.save().then((savedUser: any) => {
                res.json({message: "Successful change!"});
            }).catch((error: any) => {
                console.error("Error saving user:", error);
                res.status(500).json({ message: "Error saving user." });
            });
        }).catch((err)=>{
            console.log(err)
        })
    }

    getUsers = (req: express.Request, res: express.Response)=>{ 
        let typeP = req.body.type;
        UserModel.find({ type: typeP, status: {$ne: "pending"}}).then((users)=>{
            res.json(users)
        }).catch((err)=>{
            console.log(err)
        })
        
    }

    getRegistrationRequests = (req: express.Request, res: express.Response)=>{ 
        UserModel.find({ type: {$ne: "admin"}, status: "pending"}).then((users)=>{
            res.json(users)
        }).catch((err)=>{
            console.log(err)
        })
    }

    setUserStatus = (req: express.Request, res: express.Response)=>{ 
        let userP = req.body.user;
        let statusP = req.body.status;
        UserModel.updateOne({ email: userP.email},  {$set: {status: statusP}}).then((data)=>{
            res.json({message: "Ok"})
        }).catch((err)=>{
            console.log(err)
        })
    }

    createRestaurant = (req: express.Request, res: express.Response)=>{
        let restaurantP: any = req.body;
        const newRestaurant = new RestaurantModel(restaurantP);
        newRestaurant.save().then((savedRestaurant: any) => {
            res.json({message: "Restaurant created successfully"});
        }).catch((error) => {
            console.error("Error creating restaurant:", error);
            res.status(500).json({ message: "Error creating restaurant." });
        });
    }

    createReservation = (req: express.Request, res: express.Response)=>{
        let reservationP: any = req.body;
        const newReservation = new ReservationModel(reservationP);
        newReservation.save().then((savedReservation: any) => {
            res.json({message: "Reservation created successfully"});
        }).catch((error) => {
            console.error("Error creating restaurant:", error);
            res.status(500).json({ message: "Error creating restaurant." });
        });
    }

    createOrder = (req: express.Request, res: express.Response)=>{
        let orderP: any = req.body;
        const newOrder = new OrderModel(orderP);
        newOrder.save().then((savedOrder: any) => {
            res.json({message: "Order created successfully"});
        }).catch((error) => {
            console.error("Error creating restaurant:", error);
            res.status(500).json({ message: "Error creating restaurant." });
        });
    }

    getAllRestaurantsNames = (req: express.Request, res: express.Response)=>{
        RestaurantModel.find({}, 'name').then(restaurants=>{
            const restaurantNames = restaurants.map(restaurant => restaurant.name);
            res.json(restaurantNames);
        }).catch((err)=>{
            console.log(err)
        })
    }

    createWaiter = (req: express.Request, res: express.Response) => {
        let user = req.body.user;
    
        const salt = randomBytes(16).toString('hex');
        const hash = scryptSync(user.password, salt, 64).toString('hex');
        user.password = `${salt}:${hash}`;
    
        UserModel.findOne({ username: user.username })
            .then((existingUserByUsername: any) => {
                if (existingUserByUsername) {
                    return res.json({ message: "Username already in use" });
                }
    
                UserModel.findOne({ email: user.email })
                    .then((existingUserByEmail: any) => {
                        if (existingUserByEmail) {
                            return res.json({ message: "Email already in use" });
                        }
    
                        const newUser = new UserModel(user);
                        newUser.save()
                            .then((savedUser: any) => {
                                res.json({ message: "Registration successful" });
    
                                RestaurantModel.updateOne(
                                    { name: user.restaurant },
                                    { $push: { waiters: user.username } }
                                )
                                    .then(result => {
                                        if (result) {
                                            
                                        } else {
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
    }
    

    getWaiterRestaurant = (req: express.Request, res: express.Response)=>{
        let usernameP = req.body.username;
        RestaurantModel.findOne({ waiters: usernameP }, 'name')
        .then(restaurant => {
            if (restaurant) {
                res.json({restaurantName : restaurant.name});
            } else {
                res.status(404).json({ message: 'No restaurant found for the given waiter username' });
            }
        })
        .catch(err => {
            console.error('Error finding restaurant:', err);
            res.status(500).json({ message: 'An error occurred while fetching the restaurant' });
        });
    }

    getRestaurants = (req: express.Request, res: express.Response)=> {
        RestaurantModel.find({}).then(restaurants=>{
            res.json(restaurants);
        }).catch((err)=>{
            console.log(err)
        })
    }

    getWaitersNames = async (req: express.Request, res: express.Response) => {
        try {
            let waitersUsernames = req.body.waiters;
            
            let waitersDetailsPromises = waitersUsernames.map((username: string) => {
                return UserModel.findOne({ username: username }, 'firstname lastname').exec();
            });
    
            let waitersDetails = await Promise.all(waitersDetailsPromises);
    
            waitersDetails = waitersDetails.filter(waiter => waiter !== null);
    
            res.json(waitersDetails);
        } catch (error) {
            console.error("Error fetching waiters names:", error);
            res.status(500).json({ message: "An error occurred while fetching waiters names." });
        }
    };

    saveRestaurant = (req: express.Request, res: express.Response) => {
        let restaurantNameP: string = req.body.restaurantName;
        let fieldP: string = req.body.field;
        let arrayP: any[] = req.body.array;
    
        let updateData: Record<string, any> = {};
        updateData[fieldP] = arrayP;
    
        RestaurantModel.findOneAndUpdate(
            { name: restaurantNameP }, 
            { $set: updateData }
        )
        .then(updatedRestaurant => {
            if (updatedRestaurant) {
                res.json({
                    message: 'Restaurant updated successfully'
                });
            } else {
                res.status(404).json({ message: 'Restaurant not found' });
            }
        })
        .catch(error => {
            console.error("Error updating restaurant:", error);
            res.status(500).json({ message: 'An error occurred while updating the restaurant' });
        });
    };

    getReservationsDates = async (req: express.Request, res: express.Response) => {
        try {
            const dates = await ReservationModel.find({status: "confirmed"}, 'date').exec();
            return res.json(dates);
        } catch (err) {
            return res.status(500).json({ error: 'An error occurred while fetching reservation dates.' });
        }
    };

    getReservationsDatesForRestaurant = async (req: express.Request, res: express.Response) => {
        let restaurantNameP: string = req.body.restaurantName;
        try {
            const reservations = await ReservationModel.find({ status: "confirmed" }, 'date table').exec();
    
            const result: any = reservations.map(reservation => {
                return {
                    date: reservation.date,
                    table: reservation.table
                };
                }
            );
            return res.json(result);
        } catch (err) {
            return res.status(500).json({ error: 'An error occurred while fetching reservation dates.' });
        }
    };
    

    getNumberOfUsers = async (req: express.Request, res: express.Response) => {
        try {
            const count = await UserModel.countDocuments({type: "gost"}).exec();
            return res.json({ numberOfUsers: count });
        } catch (err) {
            return res.status(500).json({ error: 'An error occurred while counting users.' });
        }
    };

    getOrdersForWaiterRestaurant = async (req: express.Request, res: express.Response) => {
        let usernameP = req.body.username;
    
        try {
            const restaurant = await RestaurantModel.findOne({ waiters: usernameP }).exec();
            if (!restaurant) {
                return res.status(404).json({ error: 'Restaurant not found for the given waiter username.' });
            }
            const orders = await OrderModel.find({ restaurant: restaurant.name, status: "pending" }).exec();
            return res.json(orders);
        } catch (err) {
            return res.status(500).json({ error: 'An error occurred while fetching orders for the waiter.' });
        }
    };

    changeOrder = async (req: express.Request, res: express.Response) => {
        let orderP = req.body;
    
        try {
            const updatedOrder = await OrderModel.findByIdAndUpdate(orderP._id, orderP, { new: true }).exec();
    
            if (!updatedOrder) {
                return res.status(404).json({ message: "Order not found." });
            }
    
            return res.json({ message: "Order updated successfully", order: updatedOrder });
        } catch (err) {
            console.error("Error updating order:", err);
            return res.status(500).json({ message: "Error updating order." });
        }
    }

    changeReservation = async (req: express.Request, res: express.Response) => {
        let reservationP = req.body;
    
        try {
            const updatedReservation = await ReservationModel.findByIdAndUpdate(reservationP._id, reservationP, { new: true }).exec();
    
            if (!updatedReservation) {
                return res.status(404).json({ message: "Order not found." });
            }
    
            return res.json({ message: "Order updated successfully", order: updatedReservation });
        } catch (err) {
            console.error("Error updating order:", err);
            return res.status(500).json({ message: "Error updating order." });
        }
    } 
    
    
    
    getUserOrders = (req: express.Request, res: express.Response) => {
        let usernameP = req.body.username;
    
        OrderModel.find({ username: usernameP }).then(orders => {
           res.json(orders);
        }).catch(err => {
            console.error(err);
            res.status(500).send('Error fetching orders');
        });
    };

    getUserReservations = (req: express.Request, res: express.Response) => {
        let usernameP = req.body.username;
    
        ReservationModel.find({ username: usernameP }).then(reservations => {
           res.json(reservations);
        }).catch(err => {
            console.error(err);
            res.status(500).send('Error fetching orders');
        });
    };

    getWaiterReservations = (req: express.Request, res: express.Response) => {
        let usernameP = req.body.username;
    
        ReservationModel.find({ waiter: usernameP }).then(reservations => {
           res.json(reservations);
        }).catch(err => {
            console.error(err);
            res.status(500).send('Error fetching orders');
        });
    };

    getRestaurantReservations = (req: express.Request, res: express.Response) => {
        let nameP = req.body.name;
    
        ReservationModel.find({ restaurant: nameP }).then(reservations => {
           res.json(reservations);
        }).catch(err => {
            console.error(err);
            res.status(500).send('Error fetching orders');
        });
    };
    
    getLayout = (req: express.Request, res: express.Response) => {
        let nameP = req.body.name;
    
        RestaurantModel.findOne({ name: nameP }, 'layout').then(layout => {
           res.json(layout);
        }).catch(err => {
            console.error(err);
            res.status(500).send('Error fetching orders');
        });
    };

    dropReservation = (req: express.Request, res: express.Response) => {
        let idP = req.body.id;
    
        ReservationModel.deleteOne({_id: idP}).then(reservation => {
            res.json({message: "Reservation deleted"})
        }).catch((err)=>{
            console.log(err)
            res.json({message: "Fail"})
        })
    }

    notArrived = (req: express.Request, res: express.Response) => {
        let usernameP = req.body.username;
    
        UserModel.findOne({ username: usernameP }).then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }
            if(user.numberOfNotComing != null){
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