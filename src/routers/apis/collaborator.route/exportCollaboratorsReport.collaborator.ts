import {
  BaseRoute,
  Request,
  Response,
  NextFunction,
} from "../../../base/baseRoute";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../../graphql/context";
import Excel from "exceljs";
import { UtilsHelper } from "../../../helpers";
import { CustomerCommissionLogModel } from "../../../graphql/modules/customerCommissionLog/customerCommissionLog.model";
import { ObjectId } from "mongodb";
import { isEmpty, set } from "lodash";
import { isValidObjectId, Types } from "mongoose";
import { ErrorHelper } from "../../../base/error";
import { BranchModel } from "../../../graphql/modules/branch/branch.model";
import moment from "moment";

const STT = "STT";

export const exportCollaboratorsReport = async (req: Request, res: Response) => {
  const context = (req as any).context as Context;
  context.auth(ROLES.ADMIN_EDITOR_MEMBER);

  let fromDate: string = req.query.fromDate
    ? req.query.fromDate.toString()
    : null;
  let toDate: string = req.query.toDate ? req.query.toDate.toString() : null;
  const memberId: string = req.query.memberId? req.query.memberId.toString(): null;
  
  if (!isEmpty(memberId)) {
    if (!isValidObjectId(memberId)) {
      throw ErrorHelper.requestDataInvalid("Mã bưu cục");
    }
  }

  const { $gte, $lte } = UtilsHelper.getDatesWithComparing(fromDate, toDate);

  const $match: any = {};

  if ($gte) {
    set($match, "createdAt.$gte", $gte);
  }

  if ($lte) {
    set($match, "createdAt.$lte", $lte);
  }

  if (memberId) {
    set($match, "memberId", new ObjectId(memberId));
  }

  if (context.isMember()) {
    set($match, "memberId", new ObjectId(context.id));
  }

  // console.log('$match',$match);

  const [data, branches] = await Promise.all([
    CustomerCommissionLogModel.aggregate([
      {
        $match
      },
      {
          $group: {
              _id: {
                  customerId: "$customerId",
                  memberId: "$memberId",
                  collaboratorId: "$collaboratorId"
              },
              commission: { $sum: "$value" },
          }
      },
      {
          $project:{
              _id: "$_id.customerId",
              collaboratorId: "$_id.collaboratorId",
              memberId: "$_id.memberId",
              commission:1
          }
      },
      {
          $sort:{
              commission: -1
          }
      },
      {
          $lookup: {
              from: 'collaborators',
              localField: 'collaboratorId',
              foreignField: '_id',
              as: 'collaborator'
          }
      },
      { $unwind: '$collaborator'},
      {
          $lookup: {
              from: 'members',
              localField: 'memberId',
              foreignField: '_id',
              as: 'member'
          }
      },
      { $unwind: '$member'},
      {
          $project:{
              _id: "$collaborator._id",
              collaboratorCode: "$collaborator.code",
              collaboratorName: "$collaborator.name",
              memberId: "$member.memberId",
              memberCode: "$member.code",
              memberShopName: "$member.shopName",
              memberDistrict: "$member.district",
              branchId: "$member.branchId",
              commission:1
          }
      },
      {
          $lookup: {
              from: 'branches',
              localField: 'branchId',
              foreignField: '_id',
              as: 'branch'
          }
      },
      { $unwind: '$branch'},
      {
          $project:{
              _id: 1,
              collaboratorCode: 1,
              collaboratorName:1,
              memberId: 1,
              memberCode: 1,
              memberShopName: 1,
              memberDistrict: 1,
              branchId: 1,
              branchCode: "$branch.code",
              branchName: "$branch.name",
              commission:1
          }
      }
    ]),
    BranchModel.find({})
  ]);


  let staticsticData: any = [];
  const branchesData = [];

  const workbook = new Excel.Workbook();

  const createSheetData = (data: any, name: string) => {
    const sheet = workbook.addWorksheet(name);
    const excelHeaders = [
      STT,
      "Mã nhân viên",
      "Cộng tác viên",
      "Mã bưu cục",
      "Bưu cục",
      "Quận / Huyện",
      "Chi nhánh",
      "Hoa hồng cộng tác viên",
    ];

    sheet.addRow(excelHeaders);

    data.forEach((d: any, i: number) => {
      const dataRow = [
        i + 1,//STT
        d.collaboratorCode,
        d.collaboratorName,
        d.memberCode,//"Mã bưu cục",
        d.memberShopName,// "Bưu cục",
        d.memberDistrict,
        d.branchName,//"Chi nhánh",
        d.commission,
      ];
      sheet.addRow(dataRow);
    });
    UtilsHelper.setThemeExcelWorkBook(sheet);

    const vnFromDate = moment(fromDate).format("DD-MM-YYYY");
    const vnToDate = moment(toDate).format("DD-MM-YYYY");
    const title = `BÁO CÁO HOA HỒNG CỘNG TÁC VIÊN ${vnFromDate} - ${vnToDate}`;
    UtilsHelper.setTitleExcelWorkBook(sheet, title);
  }

  const POSTS_SHEET_NAME = "Danh sách cộng tác viên";
  createSheetData(data, POSTS_SHEET_NAME);


  if (!context.isMember() && isEmpty(memberId)) {
    for (const branch of branches) {
      const branchData = data.filter((m: any) => m.branchCode === branch.code);
      // staticsticData.push(sumAllData(branch.name, branchData));
      branchesData.push({ name: branch.name, data: branchData });
    }
  }

  if (!context.isMember() && isEmpty(memberId)) {
    // staticsticData.push(sumAllData("Tổng", data));
    // createStatisticSheetData(staticsticData, "TH");

    for (const branchData of branchesData) {
      createSheetData(branchData.data, branchData.name);
    }
  }

  const vnFromDate = moment(fromDate).format("DD.MM.YYYY");
  const vnToDate = moment(toDate).format("DD.MM.YYYY");
  const fileName = `bao_cao_hoa_hong_ctv_${vnFromDate}_${vnToDate}`;
  return UtilsHelper.responseExcel(res, workbook, fileName);
}