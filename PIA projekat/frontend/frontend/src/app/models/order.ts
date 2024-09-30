import { DishOrder } from "./dishOrder";

export class Order{
    _id: string | null = null;
    firstname: string = "";
    lastname: string = "";
    username: string = "";
    restaurant: string = "";
    orderItems: DishOrder[] = [];
    totalPrice: number = 0;
    deliveryAddress: string = "";
    status: string = "";
    deliveredDate: Date | null = null;
    confirmDate: Date |  null = null;
    createdDate: Date | null = null;
    estimatedTime: string = "";
    rejectReason: string = "";
    phoneNumber: string = "";
    acceptErrorMessage: string = "";
    declineErrorMessage: string = ""; 
}