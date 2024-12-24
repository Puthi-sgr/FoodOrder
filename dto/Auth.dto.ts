import { VendorPayLoad } from "./Vendor.dto";
import { CustomerPayload } from "./Customer.dto";
export type AuthPayLoad = VendorPayLoad | CustomerPayload;
