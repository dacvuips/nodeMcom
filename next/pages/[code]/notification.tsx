import { NextSeo } from "next-seo";
import { NotificationPage } from "../../components/index/notifcation/notification";
import { NotificationProvider } from "../../components/index/notifcation/provider/notification-provider";
import { DefaultLayout } from "../../layouts/default-layout/default-layout";
import { Redirect } from "../../lib/helpers/redirect";
import SEO from "../../lib/helpers/seo";
import { MemberModel } from "./../../../dist/graphql/modules/member/member.model";
import { GetServerSidePropsContext } from "next";

export default function Page(props) {
  return (
    <NotificationProvider>
      <NextSeo {...props.seo} />
      <NotificationPage />
    </NotificationProvider>
  );
}

Page.Layout = DefaultLayout;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code = "3MSHOP" } = context.params;
  const shop = await MemberModel.findOne({ code }, "shopName shopLogo shopCover");
  if (!shop) {
    Redirect(context.res, `/not-found-shop`);
  }
  const seo = await SEO("Thông báo", {
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