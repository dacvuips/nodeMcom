import { NextSeo } from "next-seo";
import { OrderPage } from "../../../components/index/order/order-page";
import { DefaultLayout } from "../../../layouts/default-layout/default-layout";
import { Redirect } from "../../../lib/helpers/redirect";
import SEO from "../../../lib/helpers/seo";
import { MemberModel } from "./../../../../dist/graphql/modules/member/member.model";
import { GetServerSidePropsContext } from "next";

export default function Page(props) {
  return (
    <>
      <NextSeo {...props.seo} />
      <OrderPage />
    </>
    // <OrderProvider>

    // </OrderProvider>
  );
}

Page.Layout = DefaultLayout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code = "3MSHOP" } = context.params;
  const shop = await MemberModel.findOne({ code }, "shopName shopLogo shopCover");
  if (!shop) {
    Redirect(context.res, `/not-found-shop`);
  }
  const seo = await SEO("Lịch sử đơn hàng", {
    image: shop.shopCover || shop.shopLogo,
    description: shop.shopName,
    shopName: shop.shopName,
  });
  return {
    props: JSON.parse(
      JSON.stringify({
        seo,
      })
    ),
  };
}
