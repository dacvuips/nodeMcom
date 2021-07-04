import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { onDelivering } from "../../../events/onDelivering.event";
import { onMemberDelivering } from "../../../events/onMemberDelivering.event";
import { Ahamove } from "../../../helpers/ahamove/ahamove";
import { Context } from "../../context";
import { DriverModel } from "../driver/driver.model";
import { OrderModel, OrderStatus, ShipMethod } from "../order/order.model";
import { DeliveryInfo } from "../order/types/deliveryInfo.type";

export default {
  schema: gql`
    extend type Order {
      "Mã tài xế"
      driverId: ID
      "Tên tài xế"
      driverName: String
      "Điện thoại tài xế"
      driverPhone: String
      "Biển số xe tài xế"
      driverLicense: String
    }
    extend type Mutation {
      transferOrderToDriver(orderId: ID!, driverId: ID!, note: String): Order
    }
  `,
  resolver: {
    Mutation: {
      transferOrderToDriver: async (root: any, args: any, context: Context) => {
        context.auth([ROLES.MEMBER]);
        const { orderId, driverId, note } = args;
        let [order, driver] = await Promise.all([
          OrderModel.findById(orderId),
          DriverModel.findById(driverId),
        ]);
        if (!order) throw Error("Đơn hàng không đúng.");
        if (!driver) throw Error("Tài xế không đúng.");
        if (order.status != OrderStatus.CONFIRMED || order.shipMethod)
          throw Error("Đơn hàng này không thể giao.");
        order.driverId = driver._id;
        order.driverName = driver.name;
        order.driverPhone = driver.phone;
        order.driverLicense = driver.licensePlates;
        order.deliveryInfo = {
          ...order.deliveryInfo,
          serviceName: "DRIVER",
          status: "ACCEPTED",
          statusText: Ahamove.StatusText.ACCEPTED,
        } as DeliveryInfo;
        order.shipMethod = ShipMethod.DRIVER;
        order = await order.save();
        onMemberDelivering.next(order);
        onDelivering.next(order);
        return order;
      },
    },
  },
};
