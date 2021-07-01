import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { Homepage } from "../components/index/homepage/homepage";
import { DefaultLayout } from "../layouts/default-layout/default-layout";
import { MemberModel } from "../../dist/graphql/modules/member/member.model";
import { useEffect } from "react";
import { Redirect } from "../lib/helpers/redirect";

export default function Page(props) {
  useEffect(() => {
    sessionStorage.setItem("shop", JSON.stringify(props.shop));
    sessionStorage.setItem("shopCode", props.code);
  }, []);
  return (
    <>
      <NextSeo title={`Trang chủ`} />
      <Homepage productId={props.productId} />
    </>
  );
}
Page.Layout = DefaultLayout;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { code = "3MSHOP", productId } = context.query;
  console.log(productId);
  const shop = await MemberModel.findOne({ code }, "shopName shopLogo");
  if (!shop) {
    Redirect(context.res, "/not-found-shop");
  }
  return {
    props: JSON.parse(
      JSON.stringify({
        code,
        productId,
        shop,
      })
    ),
  };
}
