export class Reservation{
    _id: string | null = null;
    username: string = "";
    firstname: string = "";
    lastname: string = "";
    phoneNumber: string = "";
    restaurant: string = "";
    restaurantAddress: string = "";
    date: Date = new Date();
    numberOfPeople: number = 0;
    rejectReason: string = "";
    additionalRequest: string = "";
    status: string = "";
    table: string = "";
    waiter: string = "";
    arrived: string = "";
    extraHour: boolean = false;
    canDrop: boolean = false;
}