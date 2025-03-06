import { IsEmail, IsNotEmpty, IsNotIn, Length } from "class-validator";

export class CustomerInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @Length(10, 10)
  phone: string;
  @Length(3, 99)
  @IsNotEmpty()
  @Length(3, 99)
  password: string;
}

export class CustomerLoginInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(2, 99)
  password: string;
}

export class EditCustomerProfileInputs {
  @Length(3, 16)
  firstName: string;
  @Length(3, 16)
  lastName: string;
  @Length(6, 16)
  address: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export class CartItem {
  @IsNotEmpty()
  _id: string;
  @IsNotEmpty()
  unit: number;
}

export class OrderInputs {
  txnId: string;
  amount: string;
  items: [CartItem];
}

export class CreateDeliveryUserInputs {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;

  @Length(3, 12)
  firstName: string;

  @Length(3, 12)
  lastName: string;

  @Length(6, 24)
  address: string;

  @Length(4, 12)
  pinCode: string;
}
