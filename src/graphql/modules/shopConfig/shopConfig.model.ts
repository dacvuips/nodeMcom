import mongoose from "mongoose";

import { BaseDocument, ModelHook, ModelLoader } from "../../../base/baseModel";
import { MainConnection } from "../../../loaders/database";
import { ShopBanner, ShopBannerSchema } from "./shopBanner.graphql";
import { ShopProductGroup, ShopProductGroupSchema } from "./shopProductGroup.graphql";
import { ShopTag, ShopTagSchema } from "./shopTag.graphql";

const Schema = mongoose.Schema;

export type IShopConfig = BaseDocument & {
  memberId?: string; // Mã chủ shop
  // VNPOST config
  vnpostToken?: string; // Token vnpost
  vnpostCode?: string; // Mã CRM VNPost
  vnpostPhone?: string; // Điện thoại VNPost
  vnpostName?: string; // Tên người dùng VNPost
  // Shipping config
  shipPreparationTime?: string; // Thời gian chuẩn bị
  shipDefaultDistance?: number; // Khoản cách giao hàng mặc định
  shipDefaultFee?: number; // Phí giao hàng mặc định
  shipNextFee?: number; // Phí ship cộng thêm mỗi km
  shipOneKmFee?: number; // Phí ship dưới 1 km
  shipUseOneKmFee?: boolean; // Bật phí ship dưới 1 km
  shipNote?: string; // Ghi chú cho shipper
  shipAhamoveToken?: string; // Token ship Ahamove
  // Banner hiển thị
  banners?: ShopBanner[]; // Banner của shop
  productGroups?: ShopProductGroup[]; // Nhóm sản phẩm của shop
  rating?: number; // Đánh giá sao
  ratingQty?: number; // Số lượng đánh giá
  soldQty?: number; // Số lượng đã bán
  tags?: ShopTag[]; // Tags đánh giá cho cửa hàng
  // Upsale
  upsaleTitle?: string; // Tiêu đề Upsale
  // theme
  primaryColor?: string; // Màu primary
  accentColor?: string; // Màu accent
  // sms
  smsOrder?: boolean; // Bật tin nhắn đơn hàng
  smsOtp?: boolean; // Bạt tin nhắn OTP
};

const shopConfigSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
    vnpostToken: { type: String },
    vnpostCode: { type: String },
    vnpostPhone: { type: String },
    vnpostName: { type: String },
    shipPreparationTime: { type: String },
    shipDefaultDistance: { type: Number, default: 0, min: 0 },
    shipDefaultFee: { type: Number, default: 0, min: 0 },
    shipNextFee: { type: Number, default: 0, min: 0 },
    shipOneKmFee: { type: Number, default: 0, min: 0 },
    shipUseOneKmFee: { type: Boolean, default: false },
    shipNote: { type: String },
    shipAhamoveToken: { type: String },
    banners: { type: [ShopBannerSchema], default: [] },
    productGroups: { type: [ShopProductGroupSchema], default: [] },
    rating: { type: Number, default: 0 },
    ratingQty: { type: Number, default: 0 },
    soldQty: { type: Number, default: 0 },
    tags: { type: [ShopTagSchema], default: [] },
    upsaleTitle: { type: String, default: "Ngon hơn khi ăn kèm" },
    primaryColor: { type: String },
    accentColor: { type: String },
    smsOrder: { type: Boolean, default: false },
    smsOtp: { type: Boolean, default: false },
  },
  { timestamps: true }
);

shopConfigSchema.index({ memberId: 1 }, { unique: true });
// shopConfigSchema.index({ name: "text" }, { weights: { name: 2 } });

export const ShopConfigHook = new ModelHook<IShopConfig>(shopConfigSchema);
export const ShopConfigModel: mongoose.Model<IShopConfig> = MainConnection.model(
  "ShopConfig",
  shopConfigSchema
);

export const ShopConfigLoader = ModelLoader<IShopConfig>(ShopConfigModel, ShopConfigHook);
