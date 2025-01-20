import { IsEmail, IsNotEmpty, IsNotIn, Length } from "class-validator";

export class CustomerInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @Length(10, 10)
  phone: string;
  @Length(3, 99)
  @IsNotEmpty()
  password: string;
}

export class CustomerLoginInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(3, 99)
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

export class OrderInputs {
  _id: string;
  unit: number;
}
