import { IsEmail, IsNotEmpty, IsNotIn, Length } from "class-validator";

export class CustomerInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @Length(10, 10)
  phone: string;
  @IsNotEmpty()
  password: string;
}

export class CustomerLoginInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(6, 99)
  password: string;
}

export class EditCustomerProfile {
  @Length(3, 16)
  firstNam: string;
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
