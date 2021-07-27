import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { OrderDetailPage } from "../../../components/index/order-detail/order-detail-page";
import { DefaultLayout } from "../../../layouts/default-layout/default-layout";
import { OrderModel } from "../../../../dist/graphql/modules/order/order.model";
import { Redirect } from "../../../lib/helpers/redirect";
import { OrderDetailProvider } from "../../../components/index/order-detail/providers/order-detail-provider";
import { MemberModel } from "./../../../../dist/graphql/modules/member/member.model";
import SEO from "../../../lib/helpers/seo";

export default function Page(props) {
  return (
    <OrderDetailProvider id={props.id}>
      <NextSeo {...props.seo} />
      <OrderDetailPage />
    </OrderDetailProvider>
  );
}

Page.Layout = DefaultLayout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { order, code = "3MSHOP" } = context.params;
  const orderDetail = await OrderModel.findOne({ code: order }, "_id");
  const shop = await MemberModel.findOne({ code }, "shopName shopLogo shopCover");
  if (!shop) {
    Redirect(context.res, `/not-found-shop`);
  }
  if (!order) Redirect(context.res, "/404");
  const { id } = orderDetail;
  const seo = await SEO("Chi tiết đơn hàng", {
    image: shop.shopCover || shop.shopLogo,
    description: shop.shopName,
    shopName: shop.shopName,
  });
  return {
    props: JSON.parse(
      JSON.stringify({
        id,
        seo,
      })
    ),
  };
}