import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { Context } from "../../context";
import { OrderLoader, OrderModel } from "../order/order.model";
import { RegisServiceLoader } from "../regisService/regisService.model";
import { RegisSMSLoader } from "../regisSMS/regisSMS.model";
import {
  ICustomerCommissionLog,
  CustomerCommissionLogType,
} from "./customerCommissionLog.model";
import { customerCommissionLogService } from "./customerCommissionLog.service";
import { MemberLoader } from "../member/member.model";
import { set } from "lodash";
import { CustomerLoader } from "../customer/customer.model";
import { CustomerHelper } from "../customer/customer.helper";
import { CollaboratorModel } from "../collaborator/collaborator.model";

const Query = {
  getAllCustomerCommissionLog: async (root: any, args: any, context: Context) => {
    const customerHelper = await CustomerHelper.fromContext(context);
    if (customerHelper) {
      set(args, "q.filter.customerId", customerHelper.customer._id);
    }
    return customerCommissionLogService.fetch(args.q);
  },
  getAllMemberCollaboratorCommissionLog: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    if (context.isMember()) {
      set(args, "q.filter.returnMemberId", context.id);
    }
    return customerCommissionLogService.fetch(args.q);
  },
};

const CustomerCommissionLog = {
  order: GraphQLHelper.loadById(OrderLoader, "orderId"),
  regisSMS: GraphQLHelper.loadById(RegisSMSLoader, "regisSMSId"),
  regisService: GraphQLHelper.loadById(RegisServiceLoader, "regisServiceId"),
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
  customer: GraphQLHelper.loadById(CustomerLoader, "customerId"),

  note: async (root: ICustomerCommissionLog, args: any, context: Context) => {

    const order = await OrderLoader.load(root.orderId);
    const member = await MemberLoader.load(order.sellerId);
    const collaborator = await CollaboratorModel.findById(order.collaboratorId);

    switch (root.type) {
      case CustomerCommissionLogType.RECEIVE_COMMISSION_2_FROM_ORDER:
        return `Hoa hồng CTV dành cho CTV : ${collaborator.name} - SĐT: ${collaborator.phone} từ đơn hàng ${order.code} - khách hàng: ${order.buyerName}`;
      case CustomerCommissionLogType.RETURN_COMMISSION_2_FROM_ORDER_TO_SHOPPER:
        return `Hoa hồng CTV dành cho BC: ${member.shopName} - mã BC: ${member.code} nhận từ đơn hàng ${order.code} - khách hàng: ${order.buyerName}`;
      default:
        return "";
    }
  },
};

export default {
  Query,
  CustomerCommissionLog,
};